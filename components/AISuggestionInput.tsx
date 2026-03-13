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
      className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111317] via-[#111317]/90 to-transparent z-10"
    >
      <div className="max-w-xl mx-auto relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Peça uma sugestão para a IA"
          className="w-full bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full py-5 px-6 pr-14 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-all shadow-2xl"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
}
