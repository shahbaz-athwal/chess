import { Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import OnlineCount from "./OnlineCount";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative flex h-[92vh] flex-col items-center justify-center bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Welcome to <span className="text-yellow-400">SocketChess</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Play chess online, challenge your friends, and improve your skills.
          </p>
          <OnlineCount />
          <Link href="/game">
            <button className="rounded-lg bg-yellow-400 px-6 py-3 text-black transition duration-300 hover:bg-yellow-500">
              Start Playing
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center flex justify-around">
        <p className="text-gray-400">&copy; 2024 SocketChess.</p>
        <Link href="https://github.com/shahbaz-athwal/chess">
          <Github className="text-gray-400" />
        </Link>
      </footer>
    </div>
  );
}
