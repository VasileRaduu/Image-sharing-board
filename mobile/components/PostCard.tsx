import { Post, User } from '@/types'
import { formatDate, formatNumber } from '@/utils/formatters';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { View, Text, Alert, Image, TouchableOpacity, Animated } from 'react-native'
import { useState, useRef } from 'react';
import { colors, spacing, borderRadius, shadows } from '../utils/designSystem';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

interface PostCardProps {
	post: Post;
	onLike: (postId: string) => void;
	onDelete: (postId: string) => void;
	onComment: (postId: Post) => void;
	isLiked?: boolean;
	currentUser: User;
}


const PostCard = ({ onDelete, onLike, post, isLiked, onComment, currentUser }: PostCardProps) => {
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const likeScale = useRef(new Animated.Value(1)).current;
  
  if (!post?.user || !currentUser) return null;
  const isOwnPost = post.user._id === currentUser._id;
	
	const handleDelete = () => {
		Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
			{ text: "Cancel", style:"cancel" },
			{ text: "Delete",
				style: "destructive",
				onPress: () => onDelete(post._id),
			},
		]);
	};

  const handleLike = () => {
    setIsLikedState(!isLikedState);
    
    // Animate like button
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    onLike(post._id);
  };


		return (
		 <View style={{
       backgroundColor: colors.neutral[50],
       borderBottomWidth: 1,
       borderBottomColor: colors.neutral[200],
       paddingVertical: spacing.md,
     }}>
		 	<View style={{ paddingHorizontal: spacing.md }}>
				<View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
					<Avatar 
						source={post.user.profilePicture}
						size="md"
						fallback={`${post.user.firstName} ${post.user.lastName}`}
						style={{ marginRight: spacing.sm }}
					/>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
								<Text style={{ 
                  fontWeight: '600' as const, 
                  color: colors.neutral[900], 
                  fontSize: 16,
                  marginRight: spacing.xs 
                }}>
									{post.user.firstName} {post.user.lastName}
								</Text>
								<Text style={{ 
                  color: colors.neutral[500], 
                  fontSize: 14 
                }}>
									@{post.user.userName} · {formatDate(post.createdAt)}
								</Text>
							</View>
							{isOwnPost && (
								<TouchableOpacity 
                  onPress={handleDelete}
                  style={{ padding: spacing.xs }}
                >
									<Ionicons name='ellipsis-horizontal' size={20} color={colors.neutral[500]} />
								</TouchableOpacity>
							)}
						</View>

						{post.content && (
							<Text style={{ 
                color: colors.neutral[900], 
                fontSize: 16, 
                lineHeight: 24, 
                marginBottom: spacing.md 
              }}>
								{post.content}
							</Text>
						)}

						{post.image && (
							<View style={{ 
                borderRadius: borderRadius.lg, 
                overflow: 'hidden', 
                marginBottom: spacing.md,
                ...shadows.sm 
              }}>
								<Image
									source={{ uri: post.image }}
									style={{ width: '100%', height: 200 }}
									resizeMode='cover'
								/>
							</View>
						)}

						<View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.neutral[200]
        }}>
							<TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center' }} 
                onPress={() => onComment(post)}
              >
								<Ionicons name='chatbubble-outline' size={20} color={colors.neutral[500]} />
								<Text style={{ 
                  color: colors.neutral[500], 
                  fontSize: 14, 
                  marginLeft: spacing.xs 
                }}>
									{formatNumber(post.comments?.length || 0)}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Ionicons name='repeat-outline' size={20} color={colors.neutral[500]} />
								<Text style={{ 
                  color: colors.neutral[500], 
                  fontSize: 14, 
                  marginLeft: spacing.xs 
                }}>0</Text>
							</TouchableOpacity>

							<Animated.View style={{ transform: [{ scale: likeScale }] }}>
								<TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center' }} 
                  onPress={handleLike}
                >
									{isLikedState ? (
										<AntDesign name='heart' size={20} color={colors.error[500]} />
									) : (
										<Ionicons name='heart-outline' size={20} color={colors.neutral[500]} />
									)}
									<Text style={{ 
                    fontSize: 14, 
                    marginLeft: spacing.xs,
                    color: isLikedState ? colors.error[500] : colors.neutral[500]
                  }}>
										{formatNumber(post.likes?.length || 0)}
									</Text>
								</TouchableOpacity>
							</Animated.View>

							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Ionicons name='share-outline' size={20} color={colors.neutral[500]} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		 </View>
		);
	 };

export default PostCard 