import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search posts, users...',
  value = '',
  onClear
}) => {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear?.();
  };

  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mx-4 my-2">
      <Ionicons name="search" size={20} color="#6B7280" />
      <TextInput
        className="flex-1 ml-2 text-gray-900 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="ml-2">
          <Ionicons name="close-circle" size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar; 