import EditProfileModal from "@/components/EditProfileModal";
import PostsList from "@/components/PostsList";
import SignOutButton from "@/components/SignOutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, shadows } from "../../utils/designSystem";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/LoadingState";

const ProfileScreens = () => {
  const { currentUser, isLoading } = useCurrentUser();
  const insets = useSafeAreaInsets();

  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(currentUser?.userName);

  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={["top"]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700' as const, color: colors.neutral[900] }}>
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text style={{ color: colors.neutral[500], fontSize: 14 }}>
            {userPosts.length} Posts
          </Text>
        </View>
        <SignOutButton />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor={colors.primary[500]}
          />
        }
      >
        <Image
          source={{
            uri:
              currentUser.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />

        <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[200] }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            marginTop: -64,
            marginBottom: spacing.md 
          }}>
            <Avatar
              source={currentUser.profilePicture}
              size="2xl"
              fallback={`${currentUser.firstName} ${currentUser.lastName}`}
              style={{ 
                borderWidth: 4, 
                borderColor: 'white',
                ...shadows.md 
              }}
            />
            <Button
              title="Edit Profile"
              onPress={openEditModal}
              variant="outline"
              size="small"
            />
          </View>

          <View style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: '700' as const, 
                color: colors.neutral[900], 
                marginRight: spacing.xs 
              }}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
            </View>
            <Text style={{ color: colors.neutral[500], marginBottom: spacing.sm }}>
              @{currentUser?.userName}
            </Text>
            {currentUser.bio && (
              <Text style={{ 
                color: colors.neutral[900], 
                marginBottom: spacing.md,
                fontSize: 16,
                lineHeight: 24 
              }}>
                {currentUser.bio}
              </Text>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
              <Ionicons name="location-outline" size={16} color={colors.neutral[500]} />
              <Text style={{ color: colors.neutral[500], marginLeft: spacing.xs }}>
                {currentUser.location || 'No location set'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
              <Ionicons name="calendar-outline" size={16} color={colors.neutral[500]} />
              <Text style={{ color: colors.neutral[500], marginLeft: spacing.xs }}>
                Joined {format(new Date(currentUser.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ marginRight: spacing.lg }}>
                <Text style={{ color: colors.neutral[900] }}>
                  <Text style={{ fontWeight: '700' as const }}>
                    {currentUser.following?.length || 0}
                  </Text>
                  <Text style={{ color: colors.neutral[500] }}> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: colors.neutral[900] }}>
                  <Text style={{ fontWeight: '700' as const }}>
                    {currentUser.followers?.length || 0}
                  </Text>
                  <Text style={{ color: colors.neutral[500] }}> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={currentUser?.userName} />
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />
    </SafeAreaView>
  );
};

export default ProfileScreens;