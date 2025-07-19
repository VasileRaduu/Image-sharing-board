import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Post } from "@/types";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/designSystem";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import Header from "./ui/Header";
import { Ionicons } from "@expo/vector-icons";

interface CommentsModalProps {
  selectedPost: Post;
  onClose: () => void;
}

const CommentsModal = ({ selectedPost, onClose }: CommentsModalProps) => {
  const { commentText, setCommentText, createComment, isCreatingComment, deleteComment } = useComments();
  const { currentUser } = useCurrentUser();

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteComment(commentId) },
    ]);
  };

  return (
    <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet">
      <Header 
        title="Comments"
        leftIcon="close"
        onLeftPress={handleClose}
      />

      {selectedPost && (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
          {/* ORIGINAL POST */}
          <View style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.neutral[200],
            backgroundColor: 'white',
            padding: spacing.md,
          }}>
            <View style={{ flexDirection: 'row' }}>
              <Avatar
                source={selectedPost.user.profilePicture}
                size="md"
                fallback={`${selectedPost.user.firstName} ${selectedPost.user.lastName}`}
                style={{ marginRight: spacing.sm }}
              />

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                  <Text style={{ 
                    fontWeight: '600' as const, 
                    color: colors.neutral[900], 
                    marginRight: spacing.xs 
                  }}>
                    {selectedPost.user.firstName} {selectedPost.user.lastName}
                  </Text>
                  <Text style={{ color: colors.neutral[500], fontSize: 14 }}>
                    @{selectedPost.user.userName}
                  </Text>
                </View>

                {selectedPost.content && (
                  <Text style={{ 
                    color: colors.neutral[900], 
                    fontSize: 16, 
                    lineHeight: 24, 
                    marginBottom: spacing.md 
                  }}>
                    {selectedPost.content}
                  </Text>
                )}

                {selectedPost.image && (
                  <View style={{
                    borderRadius: borderRadius.lg,
                    overflow: 'hidden',
                    marginBottom: spacing.md,
                    ...shadows.sm,
                  }}>
                    <Image
                      source={{ uri: selectedPost.image }}
                      style={{ width: '100%', height: 200 }}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* COMMENTS LIST */}
          {selectedPost.comments.map((comment) => {
            const isOwnComment = currentUser?._id === comment.user._id;
            
            return (
              <View key={comment._id} style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.neutral[200],
                backgroundColor: 'white',
                padding: spacing.md,
              }}>
                <View style={{ flexDirection: 'row' }}>
                  <Avatar
                    source={comment.user.profilePicture}
                    size="sm"
                    fallback={`${comment.user.firstName} ${comment.user.lastName}`}
                    style={{ marginRight: spacing.sm }}
                  />

                  <View style={{ flex: 1 }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      marginBottom: spacing.xs,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ 
                          fontWeight: '600' as const, 
                          color: colors.neutral[900], 
                          marginRight: spacing.xs 
                        }}>
                          {comment.user.firstName} {comment.user.lastName}
                        </Text>
                        <Text style={{ color: colors.neutral[500], fontSize: 12 }}>
                          @{comment.user.userName}
                        </Text>
                      </View>
                      
                      {isOwnComment && (
                        <TouchableOpacity 
                          onPress={() => handleDeleteComment(comment._id)}
                          style={{ padding: spacing.xs }}
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.error[500]} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={{ 
                      color: colors.neutral[900], 
                      fontSize: 16, 
                      lineHeight: 24 
                    }}>
                      {comment.content}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* ADD COMMENT INPUT */}
          <View style={{
            padding: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.neutral[200],
            backgroundColor: 'white',
          }}>
            <View style={{ flexDirection: 'row' }}>
              <Avatar
                source={currentUser?.profilePicture}
                size="sm"
                fallback={currentUser?.firstName || 'User'}
                style={{ marginRight: spacing.sm }}
              />

              <View style={{ flex: 1 }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.neutral[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    fontSize: 16,
                    marginBottom: spacing.md,
                    textAlignVertical: 'top',
                    minHeight: 80,
                  }}
                  placeholder="Write a comment..."
                  placeholderTextColor={colors.neutral[400]}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={3}
                />

                <Button
                  title="Reply"
                  onPress={() => createComment(selectedPost._id)}
                  variant={commentText.trim() ? 'primary' : 'secondary'}
                  size="small"
                  loading={isCreatingComment}
                  disabled={isCreatingComment || !commentText.trim()}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

export default CommentsModal;
