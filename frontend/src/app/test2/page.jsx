"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/auth";
import PlaybackApp from "@/components/playback-app";
export default function TestPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      // Decode JWT or fetch user details from backend
      const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decoding JWT
      setUser(decodedUser);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <PlaybackApp/>
    </div>
  );
}
