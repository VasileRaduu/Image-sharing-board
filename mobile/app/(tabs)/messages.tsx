import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ConversationsList from "../../components/ConversationsList";
import ChatScreen from "../../components/ChatScreen";
import { Conversation } from "../../types";
import { colors, spacing } from "../../utils/designSystem";
import { useUnreadCount } from "../../hooks/useMessages";

const MessagesScreen = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const { unreadCount } = useUnreadCount();

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  const handleBack = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
      }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" as const, color: colors.neutral[900] }}>
          Messages
        </Text>
        <TouchableOpacity onPress={() => router.push("/new-message")}>
          <Ionicons name="create-outline" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Unread count badge */}
      {unreadCount > 0 && (
        <View style={{
          position: "absolute",
          top: spacing.sm,
          right: spacing.md + 30,
          backgroundColor: colors.error[500],
          borderRadius: 10,
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

      {/* Conversations List */}
      <ConversationsList onConversationSelect={handleConversationSelect} />

      {/* Chat Modal */}
      <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
        {selectedConversation && (
          <ChatScreen conversation={selectedConversation} onBack={handleBack} />
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MessagesScreen;
