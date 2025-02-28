"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatRoom from "../../../components/chatroom";
import { useAuthContext } from "../../../utils/authContext";

export default function Page() {
  const authContext = useAuthContext() || {}; // Get authentication context
  const user = authContext.user; // Extract user
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    if (!user) {
      router.push("/auth/login"); // Redirect to login if user is not authenticated
      console.log("User is signed out");
    }
  }, []);

  // Ensure username is always a string, avoid "undefined"
  const userWithDefaultUsername = user
    ? {
      ...user,
      username: user.username || "", // Default username to empty string if undefined
    }
    : null;

  // Render ChatRoom only if user exists
  return userWithDefaultUsername ? <ChatRoom user={userWithDefaultUsername} /> : null;
}
