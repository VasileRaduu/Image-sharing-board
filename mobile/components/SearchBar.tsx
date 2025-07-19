import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "../utils/designSystem";
import Avatar from "./ui/Avatar";
import { User, Post } from "../types";
import { useSearchUsers, useSearchPosts } from "../hooks/useSearch";

interface SearchBarProps {
  onUserSelect?: (user: User) => void;
  onPostSelect?: (post: Post) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onUserSelect,
  onPostSelect,
  placeholder = "Search users and posts...",
  showSuggestions = true,
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const { users, isLoading: isLoadingUsers } = useSearchUsers(query, showSuggestions && isFocused);
  const { posts, isLoading: isLoadingPosts } = useSearchPosts(query, showSuggestions && isFocused);

  const isLoading = isLoadingUsers || isLoadingPosts;
  const hasResults = (users.length > 0 || posts.length > 0) && query.length > 0;

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
      }}
      onPress={() => {
        onUserSelect?.(item);
        setQuery("");
        inputRef.current?.blur();
      }}
    >
      <Avatar
        source={item.profilePicture}
        size="sm"
        fallback={`${item.firstName} ${item.lastName}`}
        style={{ marginRight: spacing.sm }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600" as const, color: colors.neutral[900] }}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={{ color: colors.neutral[500], fontSize: 14 }}>
          @{item.userName}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.neutral[400]} />
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={{
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
      }}
      onPress={() => {
        onPostSelect?.(item);
        setQuery("");
        inputRef.current?.blur();
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
        <Avatar
          source={item.user.profilePicture}
          size="xs"
          fallback={`${item.user.firstName} ${item.user.lastName}`}
          style={{ marginRight: spacing.sm }}
        />
        <Text style={{ fontWeight: "600" as const, color: colors.neutral[900] }}>
          {item.user.firstName} {item.user.lastName}
        </Text>
      </View>
      <Text 
        style={{ color: colors.neutral[700], fontSize: 14 }}
        numberOfLines={2}
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const renderSuggestions = () => {
    if (!showSuggestions || !isFocused) return null;
    if (query.length === 0) return null;
    if (!hasResults && !isLoading) return null;

    return (
      <View
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: colors.neutral[200],
          maxHeight: 300,
          zIndex: 1000,
          ...shadows.md,
        }}
      >
        {isLoading ? (
          <View style={{ padding: spacing.md, alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
            <Text style={{ color: colors.neutral[500], marginTop: spacing.xs }}>
              Searching...
            </Text>
          </View>
        ) : (
          <FlatList
            data={[...users, ...posts]}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              if ("userName" in item) {
                return renderUserItem({ item: item as User });
              } else {
                return renderPostItem({ item: item as Post });
              }
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.neutral[100],
          borderRadius: borderRadius.lg,
          paddingHorizontal: spacing.md,
          borderWidth: 1,
          borderColor: isFocused ? colors.primary[500] : colors.neutral[200],
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.neutral[500]}
          style={{ marginRight: spacing.sm }}
        />
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.neutral[900],
            paddingVertical: spacing.sm,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            style={{ padding: spacing.xs }}
          >
            <Ionicons name="close-circle" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        )}
      </View>
      {renderSuggestions()}
    </View>
  );
};

export default SearchBar;
