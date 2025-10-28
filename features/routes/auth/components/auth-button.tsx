"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="text-gray-500 text-sm sm:text-base">読み込み中...</div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-gray-700 text-sm sm:text-base">
          {session.user?.name || session.user?.email}
        </span>
        <Button
          className="h-10 px-4 font-medium text-sm sm:h-11 sm:px-6 sm:text-base"
          onClick={() => signOut({ callbackUrl: "/" })}
          size="default"
          variant="destructive"
        >
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <Button
      asChild
      className="h-10 px-4 font-medium text-sm sm:h-11 sm:px-6 sm:text-base"
      size="default"
      variant="default"
    >
      <Link href="/auth/signin">ログイン</Link>
    </Button>
  );
}
