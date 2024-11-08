import Link from "next/link";
import React from "react";
import OnlineCount from "./OnlineCount";
import { Button } from "./ui/button";

export default function LandingPage() {
  return (
      <div className="relative flex min-h-[calc(100vh-8rem)] py-6 flex-col items-center justify-center bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/40"></div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Welcome to <span className="text-primary">SocketChess</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Play chess online, challenge your friends, and improve your skills.
          </p>
          <OnlineCount />
          <Link href="/game">
            <Button size="lg" className="font-semibold">
              Start Playing
            </Button>
          </Link>
        </div>
    </div>
  );
}
