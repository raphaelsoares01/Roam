"use client";

import { useState } from "react";

import ChatInterface from "@/components/ChatInterface";
import LiquidAddButton from "@/components/LiquidAddButton";
import Hero from "@/screens/Hero";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isChatOpen) {
    return <ChatInterface onClose={() => setIsChatOpen(false)} />;
  }

  return (
    <>
      <Hero onExplore={() => setIsChatOpen(true)} />
      <section className="trip-planner-section" aria-label="Start planning a trip">
        <LiquidAddButton onClick={() => setIsChatOpen(true)} />
      </section>
    </>
  );
}
