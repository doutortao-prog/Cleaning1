import React, { useState, useRef, useEffect } from 'react';
import { Brand, ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Button } from './Button';

interface ChatAssistantProps {
  activeBrand: Brand;
  mode: 'embedded' | 'floating';
}

// Declaração de tipos para a API de reconhecimento de voz do navegador
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ activeBrand, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'embedded');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o CleanMaster AI.\n\nPara agilizar seu atendimento técnico, descreva o que precisa limpar ou use o microfone para falar.\n\nSe preferir, responda as perguntas com os números das opções (ex: 1, 2).',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Efeito para garantir modo embedded sempre aberto
  useEffect(() => {
    if (mode === 'embedded') {
      setIsOpen(true);
    }
  }, [mode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lógica de Reconhecimento de Voz
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToGemini(userMsg.text, activeBrand, history);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getBrandColor = () => {
    if (activeBrand === Brand.UNGER) return 'bg-unger-green';
    if (activeBrand === Brand.EL_CASTOR) return 'bg-elcastor-red';
    return 'bg-brand-600';
  };

  const containerClasses = mode === 'embedded' 
    ? "w-full h-[650px] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col"
    : "fixed bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[500px]";

  if (mode === 'floating' && !isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-bounce-in">
        <button
          onClick={() => setIsOpen(true)}
          className={`${getBrandColor()} text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={`${getBrandColor()} px-6 py-4 text-white flex justify-between items-center transition-colors duration-300 rounded-t-xl`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">CleanMaster AI</h3>
            <span className="text-xs opacity-90 block font-light">Assistente Técnico Inteligente</span>
          </div>
        </div>
        
        {mode === 'floating' && (
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
              }`}
            >
              {msg.text.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                  }
                  return <span key={j}>{part}</span>;
               })}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-200 rounded-full px-4 py-3 flex space-x-1.5 items-center shadow-sm">
              <span className="text-xs text-gray-400 font-medium mr-1">Analisando</span>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 rounded-b-xl">
        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida..."
              rows={3}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border-transparent focus:bg-white border focus:border-brand-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all text-sm resize-none"
            />
            {/* Botão de Microfone dentro da área de texto */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-md' 
                  : 'text-gray-400 hover:text-brand-600 hover:bg-gray-100'
              }`}
              title="Falar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <Button 
              type="submit" 
              variant="primary" 
              disabled={!inputText || isTyping} 
              className={`h-12 w-12 !p-0 rounded-xl flex items-center justify-center transition-all ${!inputText ? 'opacity-50' : 'hover:scale-105 shadow-md'}`}
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
        {isListening && (
           <p className="text-xs text-red-500 mt-2 font-medium text-center animate-pulse">Ouvindo... Fale agora.</p>
        )}
      </div>
    </div>
  );
};