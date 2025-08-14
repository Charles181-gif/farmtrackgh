import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';

const screenWidth = Dimensions.get('window').width;

interface Harvest {
  id: string;
  crop_type: string;
  quantity_kg: number;
  date: string;
  notes: string | null;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes: string | null;
}

interface ProfitDataPoint {
  date: string;
  profit: number;
}

export default function ReportsScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profitData, setProfitData] = useState<ProfitDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user, timeRange]);

  const fetchReportData = async () => {
    try {
      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }
      
      // Fetch harvests
      const { data: harvestData, error: harvestError } = await supabase
        .from('harvests')
        .select('*')
        .eq('user_id', user!.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (harvestError) throw harvestError;
      
      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user!.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (expenseError) throw expenseError;
      
      setHarvests(harvestData);
      setExpenses(expenseData);
      
      // Calculate totals
      const totalRev = harvestData.reduce((sum, harvest) => sum + harvest.quantity_kg * 5, 0);
      const totalExp = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
      
      setTotalRevenue(totalRev);
      setTotalExpenses(totalExp);
      setNetProfit(totalRev - totalExp);
      
      // Generate profit data for chart
      const profitPoints: ProfitDataPoint[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Calculate revenue for this date
        const dailyRevenue = harvestData
          .filter(h => h.date === dateStr)
          .reduce((sum, h) => sum + h.quantity_kg * 5, 0);
        
        // Calculate expenses for this date
        const dailyExpenses = expenseData
          .filter(e => e.date === dateStr)
          .reduce((sum, e) => sum + e.amount, 0);
        
        // Calculate profit
        const dailyProfit = dailyRevenue - dailyExpenses;
        
        profitPoints.push({
          date: dateStr,
          profit: dailyProfit,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setProfitData(profitPoints);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₵${amount.toFixed(2)}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Prepare data for charts
  const chartData = {
    labels: profitData.map(d => formatDate(d.date)),
    datasets: [
      {
        data: profitData.map(d => d.profit),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green color for positive
      },
    ],
  };

  const chartConfig = {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientFrom: isDark ? '#334155' : '#F8FAFC',
    backgroundGradientTo: isDark ? '#1E293B' : '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(248, 250, 252, ${opacity})` : `rgba(15, 23, 42, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#10B981',
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reports</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Financial overview and trends
        </Text>
      </View>

      {/* Time Range Selector */}
      <View style={[styles.timeRangeContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Button
          title="Week"
          onPress={() => setTimeRange('week')}
          variant={timeRange === 'week' ? 'primary' : 'outline'}
          style={[styles.timeButton, { marginRight: 8 }]}
        />
        <Button
          title="Month"
          onPress={() => setTimeRange('month')}
          variant={timeRange === 'month' ? 'primary' : 'outline'}
          style={[styles.timeButton, { marginRight: 8 }]}
        />
        <Button
          title="Year"
          onPress={() => setTimeRange('year')}
          variant={timeRange === 'year' ? 'primary' : 'outline'}
          style={styles.timeButton}
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Card style={{...styles.summaryCard, backgroundColor: colors.card}}>
          <View style={styles.summaryHeader}>
            <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Total Revenue</Text>
          </View>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(totalRevenue)}</Text>
        </Card>

        <Card style={{...styles.summaryCard, backgroundColor: colors.card}}>
          <View style={styles.summaryHeader}>
            <IconSymbol name="creditcard.fill" size={24} color={colors.accent} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Total Expenses</Text>
          </View>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(totalExpenses)}</Text>
        </Card>

        <Card style={{...styles.summaryCard, backgroundColor: netProfit >= 0 ? (isDark ? '#064E3B' : '#ECFDF5') : (isDark ? '#7F1D1D' : '#FEF2F2')}}>
          <View style={styles.summaryHeader}>
            <IconSymbol name="chart.bar.fill" size={24} color={netProfit >= 0 ? colors.success : colors.error} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Net Profit</Text>
          </View>
          <Text style={[styles.summaryValue, { color: netProfit >= 0 ? colors.success : colors.error }]}>
            {formatCurrency(netProfit)}
          </Text>
        </Card>
      </View>

      {/* Profit Chart */}
      {profitData.length > 0 && (
        <Card style={{...styles.chartCard, backgroundColor: colors.card}}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Profit Trend</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>
      )}

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        
        {harvests.length > 0 && (
          <View style={styles.activitySection}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>Recent Harvests</Text>
            {harvests.slice(0, 3).map((harvest) => (
              <Card key={harvest.id} style={{...styles.activityCard, backgroundColor: colors.card}}>
                <View style={styles.activityHeader}>
                  <Text style={[styles.activityItemTitle, { color: colors.text }]}>{harvest.crop_type}</Text>
                  <Text style={[styles.activityDate, { color: colors.textSecondary }]}>{formatDate(harvest.date)}</Text>
                </View>
                <Text style={[styles.activityDetail, { color: colors.textSecondary }]}>
                  {harvest.quantity_kg} kg
                </Text>
              </Card>
            ))}
          </View>
        )}

        {expenses.length > 0 && (
          <View style={styles.activitySection}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>Recent Expenses</Text>
            {expenses.slice(0, 3).map((expense) => (
              <Card key={expense.id} style={{...styles.activityCard, backgroundColor: colors.card}}>
                <View style={styles.activityHeader}>
                  <Text style={[styles.activityItemTitle, { color: colors.text }]}>{expense.category}</Text>
                  <Text style={[styles.activityDate, { color: colors.textSecondary }]}>{formatDate(expense.date)}</Text>
                </View>
                <Text style={[styles.activityDetail, { color: colors.textSecondary }]}>
                  {formatCurrency(expense.amount)}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  timeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    width: '30%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  activitySection: {
    marginBottom: 24,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  activityCard: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityItemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 12,
  },
  activityDetail: {
    fontSize: 12,
  },
});