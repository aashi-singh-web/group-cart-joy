import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandChannels } from "@/components/BrandChannels";
import { PrivateRooms } from "@/components/PrivateRooms";
import { ProductCard } from "@/components/ProductCard";
import { ChatInterface } from "@/components/ChatInterface";
import { SharedCart } from "@/components/SharedCart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-shopping.jpg";
import { 
  ShoppingBag, 
  Users, 
  MessageCircle, 
  Zap,
  ArrowRight,
  Heart,
  TrendingUp
} from "lucide-react";

const sampleProducts = [
  {
    id: "1",
    name: "Oversized Denim Jacket",
    brand: "Zara",
    price: "₹3,999",
    originalPrice: "₹5,999",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
    rating: 4.5,
    reviews: 234,
    category: "Outerwear"
  },
  {
    id: "2", 
    name: "Classic White Sneakers",
    brand: "Nike",
    price: "₹7,299",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    rating: 4.8,
    reviews: 512,
    category: "Footwear"
  },
  {
    id: "3",
    name: "Minimalist Backpack",
    brand: "Uniqlo", 
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    rating: 4.6,
    reviews: 89,
    category: "Accessories"
  }
];

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'channel' | 'room'>('home');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setCurrentView('channel');
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    setCurrentView('room');
  };

  if (currentView === 'channel' && selectedChannel) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-4xl">🛍️</div>
              <div>
                <h1 className="text-3xl font-bold capitalize">{selectedChannel} Channel</h1>
                <p className="text-muted-foreground">Latest drops and community favorites</p>
              </div>
              <Badge className="bg-fire text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    reactions={{
                      likes: Math.floor(Math.random() * 50) + 10,
                      hearts: Math.floor(Math.random() * 30) + 5,
                      fire: Math.floor(Math.random() * 20) + 3,
                      comments: Math.floor(Math.random() * 15) + 2
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <ChatInterface />
              <SharedCart isPublic />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'room' && selectedRoom) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-4xl">👥</div>
              <div>
                <h1 className="text-3xl font-bold">Shopping Room</h1>
                <p className="text-muted-foreground">Private shopping with friends</p>
              </div>
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                4 friends
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ChatInterface roomId={selectedRoom} />
            </div>
            <div className="space-y-6">
              <SharedCart roomId={selectedRoom} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Shop Together,
              <span className="bg-gradient-secondary bg-clip-text text-transparent block">
                Decide Together
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Experience the joy of group shopping online. Join brand channels, create private rooms with friends, 
              and make shopping decisions together with real-time chat, voting, and shared carts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="font-semibold">
                <Users className="w-5 h-5 mr-2" />
                Explore Brand Channels
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <MessageCircle className="w-5 h-5 mr-2" />
                Create Shopping Room
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Shop Alone When You Can Shop Together?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your online shopping into a social experience with features designed for collaborative decision-making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 hover:shadow-elegant transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Brand Channels</h3>
              <p className="text-muted-foreground">
                Join public channels for your favorite brands. See new drops, react to products, and build community carts.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10 hover:shadow-elegant transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Private Rooms</h3>
              <p className="text-muted-foreground">
                Create private shopping rooms with friends. Share links, vote on items, and decide together what to buy.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10 hover:shadow-elegant transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-social rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Real-time Social</h3>
              <p className="text-muted-foreground">
                Live chat, emoji reactions, voting systems, and synchronized browsing for the ultimate social shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="brands" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
              <TabsTrigger value="brands" className="text-sm font-medium">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Brand Channels
              </TabsTrigger>
              <TabsTrigger value="rooms" className="text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                Private Rooms
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brands" className="space-y-8">
              <BrandChannels onChannelSelect={handleChannelSelect} />
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-8">
              <PrivateRooms onRoomSelect={handleRoomSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-love" />
            <span className="text-lg font-semibold">Shop Together</span>
          </div>
          <p className="text-primary-foreground/80">
            Making online shopping social, collaborative, and fun.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
