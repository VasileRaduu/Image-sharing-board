import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "../utils/designSystem";
import Button from "./ui/Button";
import Header from "./ui/Header";
import { useProfileUpload } from "../hooks/useProfileUpload";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
}

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: ProfileUpdateData;
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  isUpdating: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
  formData,
  saveProfile,
  updateFormField,
  isUpdating,
}) => {
  const { currentUser } = useCurrentUser();
  const { uploadProfileImage, uploadBannerImage, isUploadingProfile, isUploadingBanner } = useProfileUpload();

  // Don't render if no user data
  if (!currentUser) {
    return null;
  }

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <Header 
        title="Edit Profile"
        leftIcon="close"
        rightIcon="checkmark"
        onLeftPress={onClose}
        onRightPress={saveProfile}
      />

      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {/* Banner Image */}
        <View style={{ position: "relative", height: 150 }}>
          <Image
            source={{ 
              uri: currentUser.bannerImage || "https://via.placeholder.com/400x150/1DA1F2/FFFFFF?text=Banner" 
            }}
            style={{ width: "100%", height: 150 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: spacing.md,
              right: spacing.md,
              backgroundColor: "rgba(0,0,0,0.85)",
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              minWidth: 140,
              justifyContent: "center",
            }}
            onPress={uploadBannerImage}
            disabled={isUploadingBanner}
          >
            <Ionicons name="camera" size={18} color="white" style={{ marginRight: spacing.xs }} />
            <Text style={{ color: "white", fontSize: 13, fontWeight: "700" as const }}>
              Change Banner
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={{ 
          position: "relative", 
          marginTop: -40, 
          marginLeft: spacing.md,
          marginBottom: spacing.md 
        }}>
          <Image
            source={{ 
              uri: currentUser.profilePicture || "https://via.placeholder.com/100/1DA1F2/FFFFFF?text=Profile" 
            }}
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 40,
              borderWidth: 4,
              borderColor: "white"
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              backgroundColor: colors.primary[600],
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              borderWidth: 2,
              borderColor: "white",
              minWidth: 140,
              justifyContent: "center",
            }}
            onPress={uploadProfileImage}
            disabled={isUploadingProfile}
          >
            <Ionicons name="camera" size={16} color="white" style={{ marginRight: spacing.xs }} />
            <Text style={{ color: "white", fontSize: 11, fontWeight: "700" as const }}>
              Change Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={{ padding: spacing.md }}>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ 
              fontWeight: "600" as const, 
              color: colors.neutral[900], 
              marginBottom: spacing.xs 
            }}>
              First Name
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: 16,
              }}
              placeholder="First name"
              placeholderTextColor={colors.neutral[400]}
              value={formData.firstName}
              onChangeText={(value) => updateFormField("firstName", value)}
            />
          </View>

          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ 
              fontWeight: "600" as const, 
              color: colors.neutral[900], 
              marginBottom: spacing.xs 
            }}>
              Last Name
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: 16,
              }}
              placeholder="Last name"
              placeholderTextColor={colors.neutral[400]}
              value={formData.lastName}
              onChangeText={(value) => updateFormField("lastName", value)}
            />
          </View>

          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ 
              fontWeight: "600" as const, 
              color: colors.neutral[900], 
              marginBottom: spacing.xs 
            }}>
              Bio
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: 16,
                textAlignVertical: "top",
                minHeight: 100,
              }}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.neutral[400]}
              value={formData.bio}
              onChangeText={(value) => updateFormField("bio", value)}
              multiline
              maxLength={160}
            />
            <Text style={{ 
              color: colors.neutral[500], 
              fontSize: 12, 
              textAlign: "right",
              marginTop: spacing.xs 
            }}>
              {formData.bio.length}/160
            </Text>
          </View>

          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ 
              fontWeight: "600" as const, 
              color: colors.neutral[900], 
              marginBottom: spacing.xs 
            }}>
              Location
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: 16,
              }}
              placeholder="Where are you based?"
              placeholderTextColor={colors.neutral[400]}
              value={formData.location}
              onChangeText={(value) => updateFormField("location", value)}
            />
          </View>

          {(isUploadingProfile || isUploadingBanner || isUpdating) && (
            <View style={{ 
              alignItems: "center", 
              padding: spacing.md 
            }}>
              <Text style={{ color: colors.neutral[600] }}>
                {isUploadingProfile || isUploadingBanner ? "Uploading image..." : "Updating profile..."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
