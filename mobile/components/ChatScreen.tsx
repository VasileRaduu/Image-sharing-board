import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMessages, useSendMessage, useMarkAsRead } from "../hooks/useMessages";
import { Conversation, Message } from "../types";
import { colors, spacing, borderRadius } from "../utils/designSystem";
import Avatar from "./ui/Avatar";
import { formatDate } from "../utils/formatters";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface ChatScreenProps {
  conversation: Conversation;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ conversation, onBack }) => {
  const [messageText, setMessageText] = useState("");
  const { messages, isLoading } = useMessages(conversation._id);
  const { sendMessage, isSending } = useSendMessage();
  const { markAsRead } = useMarkAsRead();
  const { currentUser } = useCurrentUser();
  const flatListRef = useRef<FlatList>(null);

  const otherParticipant = conversation.participants.find(
    (p) => p._id !== currentUser?._id
  );

  useEffect(() => {
    if (conversation._id) {
      markAsRead(conversation._id);
    }
  }, [conversation._id]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !otherParticipant) return;

    sendMessage({
      receiverId: otherParticipant._id,
      content: messageText.trim(),
    });

    setMessageText("");
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender._id === currentUser?._id;

    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: spacing.sm,
          justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        }}
      >
        {!isOwnMessage && (
          <Avatar
            source={item.sender.profilePicture}
            size="sm"
            fallback={`${item.sender.firstName} ${item.sender.lastName}`}
            style={{ marginRight: spacing.xs }}
          />
        )}

        <View
          style={{
            maxWidth: "70%",
            backgroundColor: isOwnMessage ? colors.primary[500] : colors.neutral[200],
            borderRadius: borderRadius.lg,
            padding: spacing.sm,
          }}
        >
          <Text
            style={{
              color: isOwnMessage ? "white" : colors.neutral[900],
              fontSize: 16,
            }}
          >
            {item.content}
          </Text>
          <Text
            style={{
              color: isOwnMessage ? "rgba(255,255,255,0.7)" : colors.neutral[500],
              fontSize: 12,
              marginTop: spacing.xs,
            }}
          >
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral[200],
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: spacing.sm }}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
        </TouchableOpacity>

        <Avatar
          source={otherParticipant?.profilePicture}
          size="sm"
          fallback={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
          style={{ marginRight: spacing.sm }}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" as const, color: colors.neutral[900] }}>
            {otherParticipant?.firstName} {otherParticipant?.lastName}
          </Text>
          <Text style={{ color: colors.neutral[500], fontSize: 12 }}>
            @{otherParticipant?.userName}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        style={{ flex: 1, padding: spacing.md }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: colors.neutral[500], fontSize: 16 }}>
                No messages yet
              </Text>
              <Text style={{ color: colors.neutral[400], fontSize: 14, marginTop: spacing.sm }}>
                Start the conversation!
              </Text>
            </View>
          ) : null
        }
      />

      {/* Message Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.neutral[200],
          backgroundColor: "white",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.neutral[300],
            borderRadius: borderRadius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            fontSize: 16,
            marginRight: spacing.sm,
          }}
          placeholder="Type a message..."
          placeholderTextColor={colors.neutral[400]}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={{
            backgroundColor: messageText.trim() ? colors.primary[500] : colors.neutral[300],
            borderRadius: borderRadius.full,
            padding: spacing.sm,
          }}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || isSending}
        >
          <Ionicons
            name="send"
            size={20}
            color={messageText.trim() ? "white" : colors.neutral[500]}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
