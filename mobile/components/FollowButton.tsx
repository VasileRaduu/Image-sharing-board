import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useFollow } from "../hooks/useFollow";

interface FollowButtonProps {
  targetUserId: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "outline";
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  targetUserId, 
  size = "medium", 
  variant = "primary" 
}) => {
  const { isFollowing, isLoading, toggleFollow } = useFollow(targetUserId);

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 20,
      paddingHorizontal: 16,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    };

    const sizeStyles = {
      small: { paddingVertical: 6, minWidth: 80 },
      medium: { paddingVertical: 8, minWidth: 100 },
      large: { paddingVertical: 12, minWidth: 120 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: isFollowing ? "#E5E7EB" : "#1DA1F2",
        borderWidth: 1,
        borderColor: isFollowing ? "#D1D5DB" : "#1DA1F2",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: isFollowing ? "#D1D5DB" : "#1DA1F2",
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: "600" as const,
    };

    const sizeStyles = {
      small: { fontSize: 12 },
      medium: { fontSize: 14 },
      large: { fontSize: 16 },
    };

    const variantStyles = {
      primary: {
        color: isFollowing ? "#6B7280" : "#FFFFFF",
      },
      outline: {
        color: isFollowing ? "#6B7280" : "#1DA1F2",
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  if (isLoading) {
    return (
      <TouchableOpacity style={getButtonStyle()} disabled>
        <ActivityIndicator 
          size="small" 
          color={variant === "primary" ? "#FFFFFF" : "#1DA1F2"} 
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={toggleFollow}>
      <Text style={getTextStyle()}>
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
