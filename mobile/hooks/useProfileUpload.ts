import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../utils/api";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const useProfileUpload = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile-image.jpg",
      } as any);

      const response = await api.post("/users/upload/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Alert.alert("Success", "Profile image updated successfully!");
    },
    onError: () => {
      Alert.alert("Error", "Failed to upload profile image. Try again.");
    },
  });

  const uploadBannerImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "banner-image.jpg",
      } as any);

      const response = await api.post("/users/upload/banner-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Alert.alert("Success", "Banner image updated successfully!");
    },
    onError: () => {
      Alert.alert("Error", "Failed to upload banner image. Try again.");
    },
  });

  const pickImage = async (type: "profile" | "banner") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [3, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        if (type === "profile") {
          uploadProfileImageMutation.mutate(imageUri);
        } else {
          uploadBannerImageMutation.mutate(imageUri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Try again.");
    }
  };

  return {
    uploadProfileImage: () => pickImage("profile"),
    uploadBannerImage: () => pickImage("banner"),
    isUploadingProfile: uploadProfileImageMutation.isPending,
    isUploadingBanner: uploadBannerImageMutation.isPending,
  };
};
