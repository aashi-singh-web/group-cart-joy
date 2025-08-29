import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  Link as LinkIcon, 
  MessageCircle, 
  ShoppingCart,
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface PrivateRoom {
  id: string;
  room_name: string;
  room_code: string;
  members: number;
  lastActivity: string;
  itemsInCart: number;
}

interface PrivateRoomsProps {
  onRoomSelect: (roomId: string) => void;
}

export const PrivateRooms = ({ onRoomSelect }: PrivateRoomsProps) => {
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [rooms, setRooms] = useState<PrivateRoom[]>([]);
  const { toast } = useToast();
  const { user, createUser } = useUser();

  useEffect(() => {
    if (user) {
      fetchUserRooms();
    }
  }, [user]);

  const fetchUserRooms = async () => {
    if (!user) return;

    try {
      const { data: roomMembersData, error } = await supabase
        .from('room_members')
        .select(`
          room_id,
          rooms (
            id,
            room_name,
            room_code,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const roomsWithDetails = await Promise.all(
        roomMembersData.map(async (member: any) => {
          const room = member.rooms;
          
          // Get member count
          const { count: memberCount } = await supabase
            .from('room_members')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);

          // Get cart items count
          const { data: cartData } = await supabase
            .from('carts')
            .select('id')
            .eq('room_id', room.id)
            .single();

          let itemsInCart = 0;
          if (cartData) {
            const { count } = await supabase
              .from('cart_items')
              .select('*', { count: 'exact', head: true })
              .eq('cart_id', cartData.id);
            itemsInCart = count || 0;
          }

          return {
            id: room.id,
            room_name: room.room_name || 'Unnamed Room',
            room_code: room.room_code,
            members: memberCount || 0,
            lastActivity: 'Recently', // Mock for now
            itemsInCart
          };
        })
      );

      setRooms(roomsWithDetails);
    } catch (error) {
      console.error('Error fetching user rooms:', error);
    }
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    try {
      // Ensure user exists
      let currentUser = user;
      if (!currentUser) {
        currentUser = await createUser();
      }

      const newRoomCode = generateRoomCode();

      // Create room
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert({
          room_name: roomName.trim(),
          room_code: newRoomCode,
          created_by: currentUser.id,
          is_private: true
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from('room_members')
        .insert({
          room_id: roomData.id,
          user_id: currentUser.id
        });

      if (memberError) throw memberError;

      // Create cart for room
      const { error: cartError } = await supabase
        .from('carts')
        .insert({
          room_id: roomData.id
        });

      if (cartError) throw cartError;

      toast({
        title: "Room Created!",
        description: `Room "${roomName}" created with code: ${newRoomCode}`,
      });

      setRoomName("");
      setShowCreateForm(false);
      fetchUserRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;

    try {
      // Ensure user exists
      let currentUser = user;
      if (!currentUser) {
        currentUser = await createUser();
      }

      // Find room by code
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', joinCode.trim().toUpperCase())
        .single();

      if (roomError || !roomData) {
        toast({
          title: "Invalid Code",
          description: "Room not found. Please check the code and try again.",
          variant: "destructive"
        });
        return;
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('room_members')
        .upsert({
          room_id: roomData.id,
          user_id: currentUser.id
        });

      if (memberError && !memberError.message.includes('duplicate')) {
        throw memberError;
      }

      toast({
        title: "Joined Room!",
        description: `Successfully joined "${roomData.room_name || 'room'}"`,
      });

      setJoinCode("");
      setShowJoinForm(false);
      fetchUserRooms();
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code Copied!",
      description: "Room code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
          Private Shopping Rooms
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create or join private rooms to shop with friends. Share links, vote on items, and build carts together
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="hero" 
          size="lg"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Room
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => setShowJoinForm(!showJoinForm)}
          className="flex items-center hover:bg-secondary hover:text-secondary-foreground"
        >
          <LinkIcon className="w-5 h-5 mr-2" />
          Join Room
        </Button>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <Card className="p-6 border-primary/20 shadow-card">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create New Room</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter room name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleCreateRoom}
                variant="cart"
                disabled={!roomName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Join Room Form */}
      {showJoinForm && (
        <Card className="p-6 border-secondary/20 shadow-card">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Join Existing Room</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter room code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleJoinRoom}
                variant="secondary"
                disabled={!joinCode.trim()}
              >
                Join
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Rooms */}
      {rooms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Active Rooms</h3>
          <div className="grid gap-4">
            {rooms.map((room) => (
              <Card 
                key={room.id}
                className="p-6 hover:shadow-card transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-border/50 hover:border-secondary/30"
                onClick={() => onRoomSelect(room.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">{room.room_name}</h4>
                      <Badge variant="outline" className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {room.members}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {room.lastActivity}
                      </div>
                      <div className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {room.itemsInCart} items
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="font-mono">
                      {room.room_code}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyRoomCode(room.room_code);
                      }}
                    >
                      {copiedCode === room.room_code ? (
                        <Check className="w-4 h-4 text-cart" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};