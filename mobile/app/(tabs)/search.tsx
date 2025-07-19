import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import SearchBar from '../../components/SearchBar';
import { useSearch } from '../../hooks/useSearch';
import { User, Post } from '../../types';
import { colors, spacing, borderRadius } from '../../utils/designSystem';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/formatters';

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "users" | "posts">("all");
  const router = useRouter();

  const { users, posts, isLoading } = useSearch(query, activeTab === "all" ? undefined : activeTab);

  const handleUserSelect = (user: User) => {
    // Navigate to user profile
    router.push(`/profile/${user.userName}`);
  };

  const handlePostSelect = (post: Post) => {
    // Navigate to post detail or open comments modal
    // For now, we'll just show an alert
    console.log("Selected post:", post._id);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
      }}
      onPress={() => handleUserSelect(item)}
    >
      <Avatar
        source={item.profilePicture}
        size="md"
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
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={{
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
      }}
      onPress={() => handlePostSelect(item)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
        <Avatar
          source={item.user.profilePicture}
          size="sm"
          fallback={`${item.user.firstName} ${item.user.lastName}`}
          style={{ marginRight: spacing.sm }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" as const, color: colors.neutral[900] }}>
            {item.user.firstName} {item.user.lastName}
          </Text>
          <Text style={{ color: colors.neutral[500], fontSize: 12 }}>
            @{item.user.userName} · {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
      <Text 
        style={{ color: colors.neutral[700], fontSize: 14 }}
        numberOfLines={3}
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const renderTabButton = (title: string, value: "all" | "users" | "posts") => (
    <TouchableOpacity
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: activeTab === value ? colors.primary[500] : "transparent",
      }}
      onPress={() => setActiveTab(value)}
    >
      <Text
        style={{
          color: activeTab === value ? "white" : colors.neutral[600],
          fontWeight: "600" as const,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" as const, color: colors.neutral[900], marginBottom: spacing.md }}>
          Search
        </Text>
        <SearchBar
          placeholder="Search users and posts..."
          onUserSelect={handleUserSelect}
          onPostSelect={handlePostSelect}
        />
      </View>

      {/* Tab Navigation */}
      <View style={{ flexDirection: "row", paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
        {renderTabButton("All", "all")}
        {renderTabButton("Users", "users")}
        {renderTabButton("Posts", "posts")}
      </View>

      {/* Results */}
      {query.length > 0 ? (
        <FlatList
          data={activeTab === "users" ? users : activeTab === "posts" ? posts : [...users, ...posts]}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            if (activeTab === "users" || ("userName" in item && activeTab === "all")) {
              return renderUserItem({ item: item as User });
            } else {
              return renderPostItem({ item: item as Post });
            }
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <View style={{ padding: spacing.xl, alignItems: "center" }}>
                <Text style={{ color: colors.neutral[500], fontSize: 16 }}>
                  No results found for "{query}"
                </Text>
              </View>
            ) : null
          }
        />
      ) : (
        <View style={{ flex: 1, padding: spacing.xl, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.neutral[500], fontSize: 16, textAlign: "center" }}>
            Search for users and posts to get started
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
