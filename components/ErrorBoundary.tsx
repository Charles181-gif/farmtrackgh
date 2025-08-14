import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            We're sorry for the inconvenience. Please try restarting the app.
          </Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg px-6 py-3"
            onPress={() => this.setState({ hasError: false, error: undefined })}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}