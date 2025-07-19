import { useCreatePost } from "@/hooks/useCreatePost";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, Animated } from "react-native";
import { useState, useRef } from "react";
import { colors, spacing, borderRadius, shadows } from "../utils/designSystem";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

const PostComposer = () => {
  const {
    content,
    setContent,
    selectedImage,
    isCreating,
    pickImageFromGallery,
    takePhoto,
    removeImage,
    createPost,
  } = useCreatePost();

  const { user } = useUser();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={{
      backgroundColor: colors.neutral[50],
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      padding: spacing.md,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Avatar 
          source={user?.imageUrl}
          size="md"
          fallback={user?.firstName || 'User'}
          style={{ marginRight: spacing.md }}
        />
        <View style={{ flex: 1 }}>
          <TextInput
            ref={inputRef}
            style={{
              color: colors.neutral[900],
              fontSize: 18,
              lineHeight: 24,
              minHeight: 48,
              textAlignVertical: 'top',
            }}
            placeholder="What's happening?"
            placeholderTextColor={colors.neutral[400]}
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={280}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </View>

      {selectedImage && (
        <View style={{ marginTop: spacing.md, marginLeft: 56 }}>
          <View style={{ position: 'relative' }}>
            <View style={{
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              ...shadows.sm,
            }}>
              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: 200 }}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: spacing.sm,
                right: spacing.sm,
                width: 32,
                height: 32,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: borderRadius.full,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={removeImage}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[200],
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ 
              padding: spacing.sm, 
              marginRight: spacing.sm,
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary[50],
            }} 
            onPress={pickImageFromGallery}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              padding: spacing.sm,
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary[50],
            }} 
            onPress={takePhoto}
          >
            <Ionicons name="camera-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {content.length > 0 && (
            <Text style={{
              fontSize: 14,
              marginRight: spacing.sm,
              color: content.length > 260 ? colors.error[500] : colors.neutral[500],
            }}>
              {280 - content.length}
            </Text>
          )}

          <Button
            title="Post"
            onPress={createPost}
            variant={content.trim() || selectedImage ? 'primary' : 'secondary'}
            size="small"
            loading={isCreating}
            disabled={isCreating || !(content.trim() || selectedImage)}
          />
        </View>
      </View>
    </View>
  );
};
export default PostComposer;