import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useConversations } from "../hooks/useMessages";
import { Conversation } from "../types";
import { colors, spacing, borderRadius } from "../utils/designSystem";
import Avatar from "./ui/Avatar";
import { formatDate } from "../utils/formatters";

interface ConversationsListProps {
  onConversationSelect?: (conversation: Conversation) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ onConversationSelect }) => {
  const { conversations, isLoading } = useConversations();
  const router = useRouter();

  const handleConversationPress = (conversation: Conversation) => {
    onConversationSelect?.(conversation);
    router.push(`/messages/${conversation._id}`);
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherParticipant = item.participants[0]; // Assuming current user is not first
    const unreadCount = item.unreadCount?.get(otherParticipant._id) || 0;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral[200],
        }}
        onPress={() => handleConversationPress(item)}
      >
        <Avatar
          source={otherParticipant.profilePicture}
          size="md"
          fallback={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
          style={{ marginRight: spacing.sm }}
        />

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontWeight: "600" as const, color: colors.neutral[900] }}>
              {otherParticipant.firstName} {otherParticipant.lastName}
            </Text>
            {item.lastMessageAt && (
              <Text style={{ color: colors.neutral[500], fontSize: 12 }}>
                {formatDate(item.lastMessageAt)}
              </Text>
            )}
          </View>

          {item.lastMessage && (
            <Text 
              style={{ 
                color: unreadCount > 0 ? colors.neutral[900] : colors.neutral[500], 
                fontSize: 14,
                fontWeight: unreadCount > 0 ? "500" as const : "400" as const,
              }}
              numberOfLines={1}
            >
              {item.lastMessage.content}
            </Text>
          )}

          {unreadCount > 0 && (
            <View style={{
              position: "absolute",
              right: 0,
              top: spacing.sm,
              backgroundColor: colors.primary[500],
              borderRadius: borderRadius.full,
              minWidth: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{ color: "white", fontSize: 12, fontWeight: "600" as const }}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.neutral[500] }}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item._id}
      renderItem={renderConversation}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={{ padding: spacing.xl, alignItems: "center" }}>
          <Text style={{ color: colors.neutral[500], fontSize: 16, textAlign: "center" }}>
            No conversations yet
          </Text>
          <Text style={{ color: colors.neutral[400], fontSize: 14, textAlign: "center", marginTop: spacing.sm }}>
            Start a conversation by following someone and sending them a message
          </Text>
        </View>
      }
    />
  );
};

export default ConversationsList;
