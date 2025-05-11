
import React, { useState, useRef, useEffect } from "react";
import { Send, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { sendChatMessage } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

export const AiHealthAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Gemini-powered health assistant. I can answer questions about women's health, cycle tracking, and wellness. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(user.id, input.trim());
      
      // Add assistant response to the chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="h-[500px] flex flex-col glass-effect shadow-xl overflow-hidden border border-primary/20" hover>
      <CardHeader className="pb-2 bg-gradient-to-r from-herhealth-pink-light/70 to-herhealth-purple-light/70">
        <CardTitle className="flex items-center gap-2 text-balance">
          <Brain className="h-5 w-5" />
          Gemini Health Assistant
          <Sparkles className="h-4 w-4 text-herhealth-pink-dark ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-herhealth-green to-herhealth-green-dark text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 shadow-sm backdrop-blur-sm border'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t backdrop-blur-md bg-background/70">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              className="resize-none backdrop-blur-sm bg-white/70 dark:bg-black/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              variant="gradient"
              className="shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Powered by Google's Gemini AI</p>
        </div>
      </CardContent>
    </Card>
  );
};
