import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface BrandChannel {
  id: string;
  brand_name: string;
  members: number;
  trending: number;
  category: string;
  description: string;
  logo: string;
}

const brandLogos: Record<string, string> = {
  'Zara': '🛍️',
  'Nike': '👟',
  'H&M': '👕',
  'Adidas': '⚡',
  'Uniqlo': '🎯'
};

const brandDescriptions: Record<string, { category: string; description: string }> = {
  'Zara': { category: 'Fashion', description: 'Latest drops and trending styles' },
  'Nike': { category: 'Sportswear', description: 'New releases and limited editions' },
  'H&M': { category: 'Fast Fashion', description: 'Affordable fashion and weekly updates' },
  'Adidas': { category: 'Sportswear', description: 'Athletic wear and lifestyle collection' },
  'Uniqlo': { category: 'Basics', description: 'Quality essentials and innovative fabrics' }
};

interface BrandChannelsProps {
  onChannelSelect: (channelId: string) => void;
}

export const BrandChannels = ({ onChannelSelect }: BrandChannelsProps) => {
  const [channels, setChannels] = useState<BrandChannel[]>([]);
  const { user, createUser } = useUser();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data: channelsData, error } = await supabase
        .from('brand_channels')
        .select('*');

      if (error) throw error;

      // Get member counts for each channel
      const channelsWithCounts = await Promise.all(
        channelsData.map(async (channel) => {
          const { count } = await supabase
            .from('channel_members')
            .select('*', { count: 'exact', head: true })
            .eq('channel_id', channel.id);

          const brandInfo = brandDescriptions[channel.brand_name] || { 
            category: 'Fashion', 
            description: 'Discover amazing products' 
          };

          return {
            id: channel.id,
            brand_name: channel.brand_name,
            members: count || 0,
            trending: Math.floor(Math.random() * 50) + 5, // Mock trending score
            category: brandInfo.category,
            description: brandInfo.description,
            logo: brandLogos[channel.brand_name] || '🏪'
          };
        })
      );

      setChannels(channelsWithCounts);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const handleChannelClick = async (channelId: string) => {
    try {
      // Ensure user exists
      let currentUser = user;
      if (!currentUser) {
        currentUser = await createUser();
      }

      // Join channel if not already a member
      const { error } = await supabase
        .from('channel_members')
        .upsert({ 
          channel_id: channelId, 
          user_id: currentUser.id 
        });

      if (error && !error.message.includes('duplicate')) {
        throw error;
      }

      onChannelSelect(channelId);
      fetchChannels(); // Refresh member counts
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

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
        {channels.map((channel) => (
          <Card 
            key={channel.id} 
            className="p-6 hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer border border-border/50 hover:border-primary/20"
            onClick={() => handleChannelClick(channel.id)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{channel.logo}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{channel.brand_name}</h3>
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