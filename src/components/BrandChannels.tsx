import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, ShoppingBag } from "lucide-react";

interface BrandChannel {
  id: string;
  name: string;
  logo: string;
  members: number;
  trending: number;
  category: string;
  description: string;
}

const brandChannels: BrandChannel[] = [
  {
    id: "zara",
    name: "Zara",
    logo: "🛍️",
    members: 12500,
    trending: 25,
    category: "Fashion",
    description: "Latest drops and trending styles"
  },
  {
    id: "nike",
    name: "Nike",
    logo: "👟",
    members: 18900,
    trending: 42,
    category: "Sportswear",
    description: "New releases and limited editions"
  },
  {
    id: "hm",
    name: "H&M",
    logo: "👕",
    members: 9800,
    trending: 18,
    category: "Fast Fashion",
    description: "Affordable fashion and weekly updates"
  },
  {
    id: "adidas",
    name: "Adidas",
    logo: "⚡",
    members: 15200,
    trending: 31,
    category: "Sportswear",
    description: "Athletic wear and lifestyle collection"
  },
  {
    id: "uniqlo",
    name: "Uniqlo",
    logo: "🎯",
    members: 7600,
    trending: 12,
    category: "Basics",
    description: "Quality essentials and innovative fabrics"
  },
  {
    id: "gucci",
    name: "Gucci",
    logo: "✨",
    members: 5400,
    trending: 8,
    category: "Luxury",
    description: "High-end fashion and exclusive pieces"
  }
];

interface BrandChannelsProps {
  onChannelSelect: (channelId: string) => void;
}

export const BrandChannels = ({ onChannelSelect }: BrandChannelsProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Brand Channels
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join public brand channels to discover new drops, react to products, and build shared carts with the community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandChannels.map((channel) => (
          <Card 
            key={channel.id} 
            className="p-6 hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer border border-border/50 hover:border-primary/20"
            onClick={() => onChannelSelect(channel.id)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{channel.logo}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{channel.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {channel.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 mr-1 text-fire" />
                    {channel.trending}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {channel.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  {channel.members.toLocaleString()} members
                </div>
                <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Join
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};