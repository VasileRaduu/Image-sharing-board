import { useSignOut } from "@/hooks/useSignOut";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/designSystem";

const SignOutButton = () => {
  const { handleSignOut } = useSignOut();
  return (
    <TouchableOpacity 
      onPress={handleSignOut}
      accessibilityLabel="Sign out"
      accessibilityRole="button"
      style={{ padding: 8 }}
    >
      <Ionicons name="log-out-outline" size={24} color={colors.error[500]} />
    </TouchableOpacity>
  );
};
export default SignOutButton;