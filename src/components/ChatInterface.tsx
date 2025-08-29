import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Image, 
  Link as LinkIcon,
  ShoppingCart,
  Heart,
  ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    color: string;
  };
  content: string;
  timestamp: string;
  type: 'text' | 'product' | 'system';
  product?: {
    name: string;
    price: string;
    image: string;
    url: string;
  };
  reactions?: {
    likes: number;
    hearts: number;
    usersWhoLiked?: string[];
  };
}

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    user: { name: "Sarah", avatar: "👩", color: "bg-secondary" },
    content: "Hey everyone! Found this amazing jacket, what do you think?",
    timestamp: "2 min ago",
    type: "text"
  },
  {
    id: "2", 
    user: { name: "Sarah", avatar: "👩", color: "bg-secondary" },
    content: "Zara Oversized Blazer",
    timestamp: "2 min ago",
    type: "product",
    product: {
      name: "Oversized Wool Blazer",
      price: "₹4,999",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
      url: "https://myntra.com/product/123"
    },
    reactions: { likes: 3, hearts: 2 }
  },
  {
    id: "3",
    user: { name: "Mike", avatar: "👨", color: "bg-primary" },
    content: "Love it! Perfect for the office 🔥",
    timestamp: "1 min ago",
    type: "text"
  },
  {
    id: "4",
    user: { name: "System", avatar: "🛍️", color: "bg-muted" },
    content: "Mike added the Oversized Wool Blazer to the shared cart",
    timestamp: "1 min ago",
    type: "system"
  }
];

interface ChatInterfaceProps {
  roomId?: string;
  onProductShare?: (url: string) => void;
}

export const ChatInterface = ({ roomId, onProductShare }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [showProductInput, setShowProductInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: { name: "You", avatar: "😊", color: "bg-accent" },
        content: newMessage,
        timestamp: "now",
        type: "text"
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleShareProduct = () => {
    if (productUrl.trim()) {
      onProductShare?.(productUrl);
      setProductUrl("");
      setShowProductInput(false);
    }
  };

  const handleReaction = (messageId: string, type: 'like' | 'heart') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || { likes: 0, hearts: 0 };
        return {
          ...msg,
          reactions: {
            ...reactions,
            [type === 'like' ? 'likes' : 'hearts']: reactions[type === 'like' ? 'likes' : 'hearts'] + 1
          }
        };
      }
      return msg;
    }));
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Group Chat</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              4 online
            </Badge>
            <div className="flex -space-x-2">
              {["👩", "👨", "👧", "😊"].map((avatar, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs"
                >
                  {avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className="flex items-start space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                message.user.color
              )}>
                {message.user.avatar}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{message.user.name}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                
                {message.type === 'text' && (
                  <p className="text-sm">{message.content}</p>
                )}
                
                {message.type === 'product' && message.product && (
                  <Card className="p-3 border border-primary/20 hover:shadow-card transition-all duration-200">
                    <div className="flex space-x-3">
                      <img 
                        src={message.product.image}
                        alt={message.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{message.product.name}</h4>
                        <p className="text-sm font-semibold text-primary">{message.product.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(message.product!.url, '_blank')}
                          >
                            <LinkIcon className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="cart"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {message.type === 'system' && (
                  <div className="text-sm text-muted-foreground italic bg-muted/50 p-2 rounded-md">
                    {message.content}
                  </div>
                )}

                {/* Reactions */}
                {message.reactions && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      size="reaction"
                      variant="ghost"
                      onClick={() => handleReaction(message.id, 'like')}
                      className="text-xs"
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {message.reactions.likes}
                    </Button>
                    <Button
                      size="reaction"
                      variant="ghost"
                      onClick={() => handleReaction(message.id, 'heart')}
                      className="text-xs"
                    >
                      <Heart className="w-3 h-3 mr-1" />
                      {message.reactions.hearts}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Product Share Input */}
      {showProductInput && (
        <div className="p-3 border-t border-border/50 bg-muted/30">
          <div className="flex space-x-2">
            <Input
              placeholder="Paste product URL from Myntra, Zara, etc..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleShareProduct}
              disabled={!productUrl.trim()}
              variant="secondary"
            >
              Share
            </Button>
            <Button 
              onClick={() => setShowProductInput(false)}
              variant="ghost"
              size="icon"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-border/50 bg-background">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowProductInput(!showProductInput)}
            className={cn(showProductInput && "bg-primary text-primary-foreground")}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            variant="default"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};