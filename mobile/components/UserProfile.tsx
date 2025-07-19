import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { formatNumber } from '../utils/formatters';
import FollowButton from './FollowButton';
import { useFollowers, useFollowing } from '../hooks/useFollow';

interface UserProfileProps {
  user: User;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onEditProfile,
  onSignOut,
  isOwnProfile = false,
}) => {
  const { followers } = useFollowers(user._id);
  const { following } = useFollowing(user._id);

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-6 px-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold">Profile</Text>
          {isOwnProfile && (
            <TouchableOpacity onPress={onSignOut}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Profile Info */}
      <View className="px-4 py-6">
        <View className="flex-row items-center mb-6">
          <Image
            source={{ uri: user.profilePicture || 'https://via.placeholder.com/100' }}
            className="w-20 h-20 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-gray-600 text-base">@{user.userName}</Text>
            {isOwnProfile ? (
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-full mt-2 self-start"
                onPress={onEditProfile}
              >
                <Text className="text-white font-semibold">Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View className="mt-2">
                <FollowButton targetUserId={user._id} size="medium" />
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around py-4 border-t border-gray-200">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">0</Text>
            <Text className="text-gray-600 text-sm">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {formatNumber(followers.length)}
            </Text>
            <Text className="text-gray-600 text-sm">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {formatNumber(following.length)}
            </Text>
            <Text className="text-gray-600 text-sm">Following</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
