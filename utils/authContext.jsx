"use client";
import { useRouter } from "next/navigation";
import { auth, onAuthStateChanged, doc, db, getDoc } from "../utils/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { setPersistence, browserSessionPersistence } from "firebase/auth";


const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
                console.log("User is signed in", user.email);
                setTimeout(() => router.push("/authCheck"), 500); // Delay redirection
            } else {
                setUser(null);
                setTimeout(() => router.push("/auth/login"), 500);
                console.log("User is signed out");
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []); // Empty dependency array to prevent re-renders

    const fetchUserData = async (uid) => {
        const docRef = doc(db, "users", uid);
        try {
            const userFound = await getDoc(docRef);
            const userData = userFound.data();

            if (!userData) return;

            setUser({
                uid: userData.uid,
                email: userData.email,
                username: userData.username,
                imageUrl: userData.imageUrl,
            });
        } catch (e) {
            console.error("Error fetching user data:", e);
        }
    };


setPersistence(auth, browserSessionPersistence)
  .then(() => console.log("Session persistence set"))
  .catch((error) => console.error("Persistence error", error));

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
