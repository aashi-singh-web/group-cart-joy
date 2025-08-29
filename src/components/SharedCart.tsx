import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Users,
  Crown,
  ExternalLink
} from "lucide-react";
import { ProductCard } from "./ProductCard";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    brand: string;
    price: string;
    image: string;
    rating: number;
    reviews: number;
    category: string;
  };
  quantity: number;
  addedBy: {
    name: string;
    avatar: string;
  };
  votes: {
    up: number;
    down: number;
    users: string[];
  };
}

const sampleCartItems: CartItem[] = [
  {
    id: "1",
    product: {
      id: "p1",
      name: "Oversized Wool Blazer",
      brand: "Zara",
      price: "₹4,999",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
      rating: 4.5,
      reviews: 128,
      category: "Outerwear"
    },
    quantity: 1,
    addedBy: { name: "Sarah", avatar: "👩" },
    votes: { up: 3, down: 0, users: ["Mike", "Alex", "Emma"] }
  },
  {
    id: "2",
    product: {
      id: "p2",
      name: "Classic White Sneakers",
      brand: "Nike",
      price: "₹7,299",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      rating: 4.8,
      reviews: 256,
      category: "Footwear"
    },
    quantity: 2,
    addedBy: { name: "Mike", avatar: "👨" },
    votes: { up: 2, down: 1, users: ["Sarah", "Alex"] }
  }
];

interface SharedCartProps {
  roomId?: string;
  isPublic?: boolean;
}

export const SharedCart = ({ roomId, isPublic = false }: SharedCartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const totalValue = cartItems.reduce((sum, item) => {
    const price = parseInt(item.product.price.replace(/[₹,]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getMostVotedItems = () => {
    return cartItems
      .sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down))
      .slice(0, 3);
  };

  const handleVote = (itemId: string, type: 'up' | 'down') => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          votes: {
            ...item.votes,
            [type]: item.votes[type] + 1
          }
        };
      }
      return item;
    }));
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 
          ? null 
          : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <Card className="p-6 bg-gradient-background border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-cart rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-cart-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isPublic ? "Brand Cart" : "Shared Cart"}
              </h2>
              <p className="text-muted-foreground">
                {isPublic ? "Community favorites" : "Shopping with friends"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              ₹{totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalItems} items • {cartItems.length} products
            </div>
          </div>
        </div>

        {/* Cart Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isPublic ? "Community" : "4 contributors"}
              </span>
            </div>
            <Badge variant="outline" className="flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              Top Voted
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              List
            </Button>
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
          </div>
        </div>
      </Card>

      {/* Top Voted Items */}
      {!isPublic && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🔥 Most Voted Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getMostVotedItems().map((item, index) => (
              <div key={item.id} className="relative">
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 z-10 bg-fire text-white">
                    #1
                  </Badge>
                )}
                <ProductCard 
                  product={item.product}
                  compact
                  reactions={{
                    likes: item.votes.up,
                    hearts: 0,
                    fire: 0,
                    comments: 0
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cart Items</h3>
        
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-card transition-all duration-200">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                    <p className="font-semibold text-primary">{item.product.price}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 hover:shadow-card transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-primary">{item.product.price}</span>
                      <span className="text-xs text-muted-foreground">
                        Added by {item.addedBy.avatar} {item.addedBy.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Voting */}
                    <div className="flex items-center space-x-1">
                      <Button
                        size="reaction"
                        variant="outline"
                        onClick={() => handleVote(item.id, 'up')}
                        className="text-xs"
                      >
                        👍 {item.votes.up}
                      </Button>
                      <Button
                        size="reaction"
                        variant="outline"
                        onClick={() => handleVote(item.id, 'down')}
                        className="text-xs"
                      >
                        👎 {item.votes.down}
                      </Button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <Card className="p-6 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Ready to checkout?</h3>
            <p className="text-primary-foreground/80">
              Total: ₹{totalValue.toLocaleString()} • {totalItems} items
            </p>
          </div>
          <Button 
            size="lg" 
            variant="secondary"
            className="font-semibold"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Checkout on Myntra
          </Button>
        </div>
      </Card>
    </div>
  );
};