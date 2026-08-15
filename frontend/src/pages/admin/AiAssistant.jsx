import React, { useState } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Camp AI Assistant. I can help you draft emails to parents, analyze registration data, or suggest group assignments based on camper profiles. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on your request regarding "${userMessage.content}", I've analyzed the current database. (This is a simulated AI response that would be connected to the Gemini API in production).` 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            AI Assistant
          </h2>
          <p className="text-muted-foreground">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex-1 bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-primary/10 text-primary'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[70%] p-4 rounded-xl text-sm ${
                msg.role === 'assistant' ? 'bg-muted/50 rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-xl bg-muted/50 rounded-tl-none text-sm text-muted-foreground flex items-center gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '200ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '400ms' }}>.</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-muted/20 shrink-0">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              className="w-full pl-4 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ask me to draft a parent email, summarize medical alerts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
