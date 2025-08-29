import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ThumbsUp, 
  ShoppingCart, 
  Flame,
  MessageCircle,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: string;
    originalPrice?: string;
    image: string;
    rating: number;
    reviews: number;
    category: string;
  };
  reactions?: {
    likes: number;
    hearts: number;
    fire: number;
    comments: number;
  };
  onAddToCart?: (productId: string) => void;
  onReaction?: (productId: string, type: 'like' | 'heart' | 'fire') => void;
  compact?: boolean;
}

export const ProductCard = ({ 
  product, 
  reactions = { likes: 0, hearts: 0, fire: 0, comments: 0 },
  onAddToCart,
  onReaction,
  compact = false 
}: ProductCardProps) => {
  const [userReactions, setUserReactions] = useState<string[]>([]);

  const handleReaction = (type: 'like' | 'heart' | 'fire') => {
    const hasReacted = userReactions.includes(type);
    if (hasReacted) {
      setUserReactions(prev => prev.filter(r => r !== type));
    } else {
      setUserReactions(prev => [...prev, type]);
    }
    onReaction?.(product.id, type);
  };

  const getReactionCount = (type: 'like' | 'heart' | 'fire') => {
    const base = reactions[type === 'like' ? 'likes' : type === 'heart' ? 'hearts' : 'fire'];
    const adjustment = userReactions.includes(type) ? 1 : 0;
    return base + adjustment;
  };

  if (compact) {
    return (
      <Card className="p-3 hover:shadow-card transition-all duration-200 hover:scale-[1.02]">
        <div className="flex space-x-3">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{product.name}</h4>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-sm">{product.price}</span>
              <div className="flex space-x-1">
                <Button
                  size="reaction"
                  variant="reaction"
                  onClick={() => handleReaction('like')}
                  className={cn(userReactions.includes('like') && "bg-like text-like-foreground")}
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button
                  size="reaction"
                  variant="cart"
                  onClick={() => onAddToCart?.(product.id)}
                >
                  <ShoppingCart className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {product.category}
          </Badge>
        </div>
        {product.originalPrice && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-like text-like-foreground">
              Sale
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.brand}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-1">★</span>
            {product.rating} ({product.reviews})
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-1">
            <Button
              size="reaction"
              variant="reaction"
              onClick={() => handleReaction('like')}
              className={cn(
                "text-xs",
                userReactions.includes('like') && "bg-like text-like-foreground"
              )}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {getReactionCount('like')}
            </Button>
            <Button
              size="reaction"
              variant="reaction"
              onClick={() => handleReaction('heart')}
              className={cn(
                "text-xs",
                userReactions.includes('heart') && "bg-love text-white"
              )}
            >
              <Heart className="w-3 h-3 mr-1" />
              {getReactionCount('heart')}
            </Button>
            <Button
              size="reaction"
              variant="reaction"
              onClick={() => handleReaction('fire')}
              className={cn(
                "text-xs",
                userReactions.includes('fire') && "bg-fire text-white"
              )}
            >
              <Flame className="w-3 h-3 mr-1" />
              {getReactionCount('fire')}
            </Button>
            <Button
              size="reaction"
              variant="ghost"
              className="text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {reactions.comments}
            </Button>
          </div>
          <Button
            size="sm"
            variant="cart"
            onClick={() => onAddToCart?.(product.id)}
            className="font-medium"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};