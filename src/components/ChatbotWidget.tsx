
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Volume1 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

// Local OpenAI proxy endpoint (run the local server with `npm run start:server`)
const LOCAL_CHAT_ENDPOINT = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? 'http://localhost:8787/api/chat' : '/api/chat';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  widgetLanguage?: 'english' | 'hindi' | 'kannada';
  translations?: {
    title?: {
      english: string;
      hindi: string;
      kannada: string;
    };
    placeholder?: {
      english: string;
      hindi: string;
      kannada: string;
    };
    button?: {
      english: string;
      hindi: string;
      kannada: string;
    };
    greeting?: {
      english: string;
      hindi: string;
      kannada: string;
    };
  };
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ 
  widgetLanguage = 'english',
  translations
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: translations?.greeting?.[widgetLanguage] || "नमस्ते! मैं आपका कृषि सहायक हूँ। आप मुझसे फसल, मौसम, या सरकारी योजनाओं के बारे में पूछ सकते हैं।",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock responses based on keywords
  const mockResponses = {
    'मौसम': 'आपके क्षेत्र में अगले 3 दिनों के लिए मौसम पूर्वानुमान यह है: आज - धूप, कल - आंशिक रूप से बादल, परसों - बारिश की संभावना।',
    'फसल': 'इस मौसम में गेहूं, चना, और सरसों की बुवाई के लिए अच्छा समय है। क्या आप किसी विशेष फसल के बारे में जानकारी चाहते हैं?',
    'योजना': 'किसानों के लिए प्रमुख सरकारी योजनाएँ हैं: प्रधानमंत्री किसान सम्मान निधि, प्रधानमंत्री फसल बीमा योजना, और किसान क्रेडिट कार्ड। किसी विशेष योजना के बारे में अधिक जानकारी के लिए पूछें।',
    'बाजार': 'आपके निकटतम मंडी में वर्तमान कीमतें: गेहूं - ₹2150/क्विंटल, धान - ₹3200/क्विंटल, आलू - ₹1200/क्विंटल, प्याज - ₹1800/क्विंटल',
    'weather': 'The weather forecast for your area for the next 3 days is: Today - Sunny, Tomorrow - Partly Cloudy, Day after - Chance of Rain.',
    'crop': 'This season is good for planting wheat, chickpeas, and mustard. Would you like information about a specific crop?',
    'scheme': 'Major government schemes for farmers include: PM Kisan Samman Nidhi, PM Crop Insurance Scheme, and Kisan Credit Card. Ask for more information about a specific scheme.',
    'market': 'Current prices at your nearest mandi: Wheat - ₹2150/quintal, Rice - ₹3200/quintal, Potato - ₹1200/quintal, Onion - ₹1800/quintal',
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message and capture the current input value (avoid clearing before sending)
    const messageText = input.trim();
    if (!messageText) return;

    const userMessage = {
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Call the Supabase Edge Function (which now proxies to OpenAI) for a response
    (async () => {
      try {
        // Show a temporary typing indicator from the bot
        const typingMessage = { text: '...', isBot: true, timestamp: new Date() };
        setMessages(prev => [...prev, typingMessage]);

  // Include both conversational `message` and a fallback empty `cropData` so
  // deployed/older server functions that expect `cropData` won't return 400.
  // This is harmless for newer servers which accept `message`.
  const requestBody = { message: messageText, language: widgetLanguage, cropData: {} };
        console.log('Calling local chat endpoint with body:', requestBody);

        let data: any = null;
        let localFailed = false;

        // Try local server first (developer mode)
        try {
          const res = await fetch(LOCAL_CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          const text = await res.text();
          try { data = JSON.parse(text); } catch { data = { success: false, error: `Non-JSON response: ${text}` }; }

          if (!res.ok) {
            // Don't spam the console with stacks when local isn't running; keep a concise message.
            console.debug('Local server returned non-OK status:', res.status, data?.error || data);
            localFailed = true;
          }
        } catch (err) {
          // Likely connection refused when the local dev server isn't running. Log at debug level.
          console.debug('Local chat endpoint not reachable (skipping local):', String(err));
          localFailed = true;
        }

        // If local server not available or returned non-success, try direct Supabase REST call first
        if (localFailed || !data || !data.success) {
          try {
            console.log('Attempting direct REST call to Supabase Functions for diagnostics');
            const directRes = await fetch(`${SUPABASE_URL}/functions/v1/chatbot`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_PUBLISHABLE_KEY,
                'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify(requestBody),
            });

            const text = await directRes.text();
            try { data = JSON.parse(text); } catch { data = { success: false, error: `Non-JSON response: ${text}` }; }
            console.log('Direct fetch status:', directRes.status, 'body:', data);

            // If direct call returned success, use it.
            if (directRes.ok && data && data.success) {
              // use data as-is
            } else {
              // If the remote function returned a 4xx/5xx, prefer surfacing that error
              // to the user instead of calling `functions.invoke` which will likely
              // return the same error and throw a FunctionsHttpError.
              console.warn('Direct REST did not return success. Status:', directRes.status);

              // Attach the server error payload to `data` so the UI can show a helpful message.
              data = data || { success: false, error: `Server returned status ${directRes.status}` };

              // For server errors (5xx) or client errors (4xx), skip calling functions.invoke
              // to avoid triggering the FunctionsHttpError and instead show a friendly message.
              // Only attempt `functions.invoke` if the direct fetch failed due to network issues
              // (caught in the outer catch) — not when the server explicitly returned an error.
            }
            } catch (directErr) {
            console.error('Direct fetch failed:', directErr, 'falling back to functions.invoke');
            try {
              // Invoke the new `chatbot` edge function as a fallback
              const res = await supabase.functions.invoke('chatbot', { body: requestBody });
              data = res.data;
              if (res.error) {
                console.error('Supabase functions.invoke error:', res.error);
              }
            } catch (invokeErr) {
              console.error('supabase.functions.invoke threw error as well:', invokeErr);
              data = { success: false, error: `Invoke and direct fetch both failed: ${String(invokeErr)}` };
            }
          }
        }

        // Remove the typing indicator
        setMessages(prev => prev.filter(m => m !== typingMessage));

        

        if (!data || !data.success) {
          const errText = data?.error || (widgetLanguage === 'english' ? "I didn't understand that." : 'मुझे यह समझ नहीं आया।');
          const botMessage = { text: errText, isBot: true, timestamp: new Date() };
          setMessages(prev => [...prev, botMessage]);
          return;
        }

        const aiText = data.data?.text || (widgetLanguage === 'english' ? "I didn't understand that." : 'मुझे यह समझ नहीं आया।');
        const botMessage = { text: aiText, isBot: true, timestamp: new Date() };
        setMessages(prev => [...prev, botMessage]);
      } catch (e) {
        // Fallback to simple message on error
        const botMessage = {
          text: widgetLanguage === 'english' ? 'An error occurred.' : 'एक त्रुटि हुई।',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    })();
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would use the Web Speech API
    if (!isRecording) {
      // Start recording
      alert("Voice recording started. This is a mock implementation.");
      setTimeout(() => {
        setInput("मौसम का पूर्वानुमान बताएं");
        setIsRecording(false);
      }, 2000);
    } else {
      // Stop recording
      alert("Voice recording stopped");
    }
  };
  
  const speakText = (text: string) => {
    // In a real implementation, this would use the Web Speech API
    alert(`Speaking: ${text}`);
  };

  const getTitle = () => {
    if (translations?.title) {
      return translations.title[widgetLanguage];
    }
    return "AI किसान सहायक (Farmer Assistant)";
  };

  const getPlaceholder = () => {
    if (translations?.placeholder) {
      return translations.placeholder[widgetLanguage];
    }
    return "आप यहां टाइप कर सकते हैं या माइक आइकन पर क्लिक करके बोल सकते हैं...";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[400px]">
      <div className="bg-primary p-3 text-white">
        <h3 className="font-medium flex items-center">
          <Volume2 size={18} className="mr-2" />
          {getTitle()}
        </h3>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none' 
                    : 'bg-primary text-white rounded-tr-none'
                }`}
              >
                <p className="text-sm font-noto">{message.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  
                  {message.isBot && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => speakText(message.text)}
                    >
                      <Volume1 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className={isRecording ? 'bg-red-100 text-red-600 border-red-300' : ''}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="min-h-10 font-noto"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <Button 
            variant="default" 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
