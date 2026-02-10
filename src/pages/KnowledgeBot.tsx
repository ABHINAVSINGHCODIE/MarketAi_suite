
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, Loader2, Info, Mic, MicOff } from 'lucide-react';
import { askChatbot } from '../services/geminiService';
import { FormattedMessage } from '../components/FormattedMessage';
import type { ChatMessage } from '../types.ts';

const KnowledgeBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your MarketAI Assistant, powered by RAG technology. I have access to our internal sales and marketing knowledge base. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [micError, setMicError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognitionImpl = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    setIsSpeechSupported(Boolean(SpeechRecognitionImpl) && isSecure);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognitionImpl = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) return;

    setMicError('');

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const results = event.results;
      if (!results || results.length === 0) return;
      const transcript = results[0][0]?.transcript || '';
      if (transcript.trim()) {
        setInput(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      const errorCode = event?.error || 'unknown-error';
      const errorMap: Record<string, string> = {
        'no-speech': 'No speech detected. Click the mic and speak right away.',
        'audio-capture': 'Microphone is not available or blocked.',
        'not-allowed': 'Microphone permission was denied. Allow mic access in the browser.',
        'aborted': 'Recording was stopped.',
        'service-not-allowed': 'Speech service is not allowed in this browser.',
        'network': 'Network error occurred while using speech recognition.'
      };
      setMicError(errorMap[errorCode] || `Mic error: ${errorCode}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askChatbot(input, messages);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error: any) {
      console.error('Chatbot Error:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        full: error
      });
      
      const errorMsg = error?.message?.includes('high demand') || error?.status === 'UNAVAILABLE'
        ? "The AI service is experiencing high demand right now. Please try again in a moment."
        : `I encountered an error: ${error?.message || 'Unknown error'}. Please try again.`;
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-lg">
              <Bot size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">MarketAI Assistant</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600 font-semibold">Knowledge Base Connected</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 shadow-sm">
            <Info size={16} />
            RAG-Augmented Retrieval
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-lg p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.role === 'user' 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-tr-sm' 
                : 'bg-white border-2 border-slate-200 text-slate-800 rounded-tl-sm'
              }`}>
                <FormattedMessage text={msg.text} isUser={msg.role === 'user'} />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <Bot size={16} className="text-slate-400" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          placeholder="Ask about marketing strategy, sales pitches, or lead qualification..."
          className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 pr-28 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-lg placeholder:text-slate-400 text-slate-900"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="button"
          onClick={toggleListening}
          disabled={!isSpeechSupported}
          title={isSpeechSupported ? (isListening ? 'Stop recording' : 'Start recording') : 'Speech recognition not supported'}
          className={`absolute right-14 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all shadow-lg ${
            isSpeechSupported
              ? isListening
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-900/30 hover:shadow-xl"
        >
          <Send size={20} />
        </button>
      </form>
      {(micError || !isSpeechSupported) && (
        <p className="text-xs text-slate-500 pl-2">
          {micError || 'Speech recognition is not supported in this browser. Try Chrome or Edge on HTTPS or localhost.'}
        </p>
      )}
    </div>
  );
};

export default KnowledgeBot;
