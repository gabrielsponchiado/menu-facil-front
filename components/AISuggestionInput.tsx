"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";

interface AISuggestionInputProps {
  onSuggest: (text: string) => void;
}

export function AISuggestionInput({ onSuggest }: AISuggestionInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSuggest(text);
      setText(""); 
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-[#111317] via-[#111317]/90 to-transparent z-10"
    >
      <div className="max-w-xl mx-auto relative group neon-blue-border rounded-full overflow-hidden">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Peça uma sugestão para a IA"
          className="w-full bg-zinc-900/90 backdrop-blur-xl py-5 px-6 pr-14 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center neon-blue-button"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
