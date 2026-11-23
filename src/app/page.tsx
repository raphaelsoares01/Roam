"use client";

import { useState } from "react";

import ChatInterface from "@/components/ChatInterface";
import LiquidAddButton from "@/components/LiquidAddButton";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isChatOpen) {
    return <ChatInterface onClose={() => setIsChatOpen(false)} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <LiquidAddButton onClick={() => setIsChatOpen(true)} />
    </main>
  );
}
