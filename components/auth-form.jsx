"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc, db, getDoc, GoogleAuthProvider, signInWithPopup } from "../utils/firebase";

export default function AuthForm({ isSignup }) {
  const router = useRouter();

  const [user, setUser] = useState({
    username: isSignup ? "" : undefined,
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Google Login
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (isSignup) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", firebaseUser.uid), {
            username: firebaseUser.displayName || firebaseUser.email,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          });
        }
      }

      setLoading(false);
      console.log("User signed in with Google");
      router.push("/authCheck");
    } catch (err) {
      setLoading(false);
      setMessage("Error: " + (err instanceof Error ? err.message : err));
    }
  };

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        username: user.username,
        email: user.email,
        uid: newUser.uid,
      });

      setLoading(false);
      console.log("User signed up");
      router.push("/authCheck");
    } catch (err) {
      setLoading(false);
      setMessage("Error: " + err.message);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      setLoading(false);
      console.log("User logged in");
      router.push("/authCheck");
    } catch (err) {
      setLoading(false);
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignup ? "Sign Up" : "Login"}
          </CardTitle>
          <CardDescription>
            {isSignup
              ? "Create your account by entering your email and password below"
              : "Enter your email and password to log in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className="flex flex-col gap-6">
              {isSignup && (
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={user.username || ""}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    placeholder="username"
                    required
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {!isSignup && (
                    <Link
                      href="/auth/forgotpassword"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                />
              </div>
              {isSignup && (
                <div className="grid gap-2">
                  <Label htmlFor="picture">Profile Photo</Label>
                  <Input id="picture" type="file" required />
                </div>
              )}
              <Button type="submit" className="w-full bg-[#16A34A] cursor-pointer " disabled={loading}>
                {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center">
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Loading..." : isSignup ? "Sign Up with Google" : "Login with Google"}
            </Button>
          </div>
            {message && (
              <div
                className={`mt-4 text-center text-sm ${
                  message.includes("Error") ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </form>


          
        </CardContent>
      </Card>
    </div>
  );
}
