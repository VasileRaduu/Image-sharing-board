import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => signOut(),
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        
      },
    ]);
  };

  return { handleSignOut };
};