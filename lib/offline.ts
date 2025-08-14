import * as SQLite from 'expo-sqlite';
import { supabase } from './supabase';

// Define TypeScript interfaces for our data models
interface OfflineHarvest {
  id: string;
  user_id: string;
  crop_type: string;
  quantity_kg: number;
  date: string;
  notes: string | null;
  created_at: string;
  synced: number; // 0 = false, 1 = true
}

interface OfflineExpense {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  date: string;
  notes: string | null;
  created_at: string;
  synced: number; // 0 = false, 1 = true
}

class OfflineManager {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    this.db = await SQLite.openDatabaseAsync('farmtrack.db');
    
    // Create tables for harvests and expenses
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS offline_harvests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        crop_type TEXT NOT NULL,
        quantity_kg REAL NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);
    
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS offline_expenses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);
  }

  // Harvest methods
  async saveHarvestOffline(harvest: Omit<OfflineHarvest, 'synced'>) {
    if (!this.db) await this.init();
    
    await this.db!.runAsync(
      `INSERT INTO offline_harvests
       (id, user_id, crop_type, quantity_kg, date, notes, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        harvest.id,
        harvest.user_id,
        harvest.crop_type,
        harvest.quantity_kg,
        harvest.date,
        harvest.notes,
        harvest.created_at
      ]
    );
  }

  async getUnsyncedHarvests(): Promise<OfflineHarvest[]> {
    if (!this.db) await this.init();
    
    const result = await this.db!.getAllAsync(
      'SELECT * FROM offline_harvests WHERE synced = 0'
    );
    
    return result as OfflineHarvest[];
  }

  async markHarvestSynced(harvestId: string) {
    if (!this.db) return;
    
    await this.db.runAsync(
      'UPDATE offline_harvests SET synced = 1 WHERE id = ?',
      [harvestId]
    );
  }

  // Expense methods
  async saveExpenseOffline(expense: Omit<OfflineExpense, 'synced'>) {
    if (!this.db) await this.init();
    
    await this.db!.runAsync(
      `INSERT INTO offline_expenses
       (id, user_id, category, amount, date, notes, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        expense.id,
        expense.user_id,
        expense.category,
        expense.amount,
        expense.date,
        expense.notes,
        expense.created_at
      ]
    );
  }

  async getUnsyncedExpenses(): Promise<OfflineExpense[]> {
    if (!this.db) await this.init();
    
    const result = await this.db!.getAllAsync(
      'SELECT * FROM offline_expenses WHERE synced = 0'
    );
    
    return result as OfflineExpense[];
  }

  async markExpenseSynced(expenseId: string) {
    if (!this.db) return;
    
    await this.db.runAsync(
      'UPDATE offline_expenses SET synced = 1 WHERE id = ?',
      [expenseId]
    );
  }

  // Sync methods
  async syncHarvests() {
    const unsyncedHarvests = await this.getUnsyncedHarvests();
    
    for (const harvest of unsyncedHarvests) {
      try {
        const { error } = await supabase
          .from('harvests')
          .insert({
            id: harvest.id,
            user_id: harvest.user_id,
            crop_type: harvest.crop_type,
            quantity_kg: harvest.quantity_kg,
            date: harvest.date,
            notes: harvest.notes,
          });

        if (!error) {
          await this.markHarvestSynced(harvest.id);
        }
      } catch (error) {
        console.error('Sync failed for harvest:', harvest.id, error);
      }
    }
  }

  async syncExpenses() {
    const unsyncedExpenses = await this.getUnsyncedExpenses();
    
    for (const expense of unsyncedExpenses) {
      try {
        const { error } = await supabase
          .from('expenses')
          .insert({
            id: expense.id,
            user_id: expense.user_id,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            notes: expense.notes,
          });

        if (!error) {
          await this.markExpenseSynced(expense.id);
        }
      } catch (error) {
        console.error('Sync failed for expense:', expense.id, error);
      }
    }
  }

  async syncAll() {
    await this.syncHarvests();
    await this.syncExpenses();
  }

  async startAutoSync() {
    // For now, we'll just sync when called manually
    // In a real app, you would implement proper network detection
    console.log('Auto-sync is ready but not implemented yet');
  }
}

export const offlineManager = new OfflineManager();