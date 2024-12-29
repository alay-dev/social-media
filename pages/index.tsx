"use client";
import { HEADER_HEIGHT } from "@/constants/layout";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { Nunito } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Events from "../layout/events";
import Following from "../layout/following";
import Header from "../layout/header";
import Main from "../layout/main";
import Sidebar from "../layout/sidebar";
import { Spinner } from "@/components/ui/spinner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export default function Home() {
  const { isInitialized, setAuthenticated, setInitialized, setUser } = useAppStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    try {
      if (isInitialized) return;

      const authUserId = localStorage.getItem("auth");
      setTimeout(() => {
        if (!authUserId) {
          setAuthenticated(false);
          router.push("/auth");
        } else {
          setAuthenticated(true);
          setUser(authUserId);
        }
        setInitialized(true);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }, [isInitialized, router, setAuthenticated, setInitialized, setUser]);

  if (!isInitialized)
    return (
      <div className="h-screen w-screen flex items-center justify-center gap-2">
        <Spinner />
        Initializing app
      </div>
    );

  return (
    <div className={`${nunito.variable} font-[family-name:var(--font-nunito)] flex w-full`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div
          className={cn("flex relative p-5 gap-6 mr-0 ml-0", `md:mr-[350px] sm:ml-[250px]`)}
          style={{
            marginTop: HEADER_HEIGHT,
          }}
        >
          <Main />
          <Events />
        </div>
        <Following />
      </div>
    </div>
  );
}
