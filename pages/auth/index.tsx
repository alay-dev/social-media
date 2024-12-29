"use client";

import { useAppStore } from "@/store/store";
import { Nunito } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Login from "@/views/login";
import Signup from "@/views/signup";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const Auth = () => {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const [authType, setAuthType] = useState("login");

  useEffect(() => {
    if (isAuthenticated) return router.push("/");
  }, [isAuthenticated, router]);

  return (
    <div className={`${nunito.variable} font-[family-name:var(--font-nunito)] bg-white`}>
      <div className="min-h-screen flex fle-col items-center justify-center p-6">
        <div className="grid lg:grid-cols-2 items-center gap-6 max-w-7xl max-lg:max-w-xl w-full">
          {authType === "signup" ? <Signup setAuthType={setAuthType} /> : <Login setAuthType={setAuthType} />}
          <div className="h-full max-lg:mt-12">
            <img src="https://readymadeui.com/login-image.webp" className="w-full h-full object-cover" alt="Dining Experience" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
