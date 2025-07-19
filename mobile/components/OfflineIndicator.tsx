import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const OfflineIndicator: React.FC = () => {
  const { isConnected } = useNetworkStatus();

  if (isConnected) {
    return null;
  }

  return (
    <View className="bg-red-500 px-4 py-2 flex-row items-center justify-center">
      <Ionicons name="wifi-outline" size={16} color="white" />
      <Text className="text-white text-sm font-medium ml-2">
        You're offline. Some features may be limited.
      </Text>
    </View>
  );
};

export default OfflineIndicator; 