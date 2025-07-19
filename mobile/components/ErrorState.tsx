import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Something went wrong', 
  onRetry,
  showRetry = true
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text className="text-gray-900 text-xl font-bold mt-4 mb-2 text-center">
        Oops!
      </Text>
      <Text className="text-gray-600 text-base text-center mb-6 leading-6">
        {message}
      </Text>
      {showRetry && onRetry && (
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold text-base">
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorState; 