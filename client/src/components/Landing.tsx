import React from 'react';

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center bg-cover bg-center" style={{ backgroundImage: 'url(/chess-board.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-400">SocketChess</span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Play chess online, challenge your friends, and improve your skills.
          </p>
          <button className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition duration-300">
            Start Playing
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <p className="text-gray-400">&copy; 2024 SocketChess.</p>
      </footer>
    </div>
  );
}
