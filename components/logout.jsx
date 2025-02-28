import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useAuthContext } from "../utils/authContext";
import { Button } from "./ui/button";

const Logout = () => {
  const router = useRouter();
  const authContext = useAuthContext();
  const setUser = authContext ? authContext.setUser : null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");

      if (setUser) {
        setUser(null);
      }

      router.push("/auth/login");
      console.log("User is signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <Button onClick={handleLogout} className="btn bg-[#16A34A] text-white cursor-pointer">
      Logout
    </Button>
  );
};

export default Logout;
