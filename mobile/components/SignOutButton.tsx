import { useSignOut } from "@/hooks/useSignOut";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const SignOutButton = () => {
  const { handleSignOut } = useSignOut();
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <TouchableOpacity 
        onPress={handleSignOut}
        accessibilityLabel="Sign out"
        accessibilityRole="button"
      />
      <Feather name="log-out" size={24} color={"#E0245E"} />
    </TouchableOpacity>
  );
};
export default SignOutButton;