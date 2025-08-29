import { useState } from "react";
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

interface PrivateRoom {
  id: string;
  name: string;
  members: number;
  lastActivity: string;
  itemsInCart: number;
  roomCode: string;
}

const sampleRooms: PrivateRoom[] = [
  {
    id: "room1",
    name: "Weekend Shopping Crew",
    members: 4,
    lastActivity: "2 min ago",
    itemsInCart: 12,
    roomCode: "WKND123"
  },
  {
    id: "room2",
    name: "Wedding Outfit Hunt",
    members: 3,
    lastActivity: "1 hour ago", 
    itemsInCart: 8,
    roomCode: "WED456"
  }
];

interface PrivateRoomsProps {
  onRoomSelect: (roomId: string) => void;
}

export const PrivateRooms = ({ onRoomSelect }: PrivateRoomsProps) => {
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      const newRoomCode = generateRoomCode();
      toast({
        title: "Room Created!",
        description: `Room "${roomName}" created with code: ${newRoomCode}`,
      });
      setRoomName("");
      setShowCreateForm(false);
    }
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      toast({
        title: "Joined Room!",
        description: `Successfully joined room with code: ${joinCode}`,
      });
      setJoinCode("");
      setShowJoinForm(false);
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
      {sampleRooms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Active Rooms</h3>
          <div className="grid gap-4">
            {sampleRooms.map((room) => (
              <Card 
                key={room.id}
                className="p-6 hover:shadow-card transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-border/50 hover:border-secondary/30"
                onClick={() => onRoomSelect(room.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">{room.name}</h4>
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
                      {room.roomCode}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyRoomCode(room.roomCode);
                      }}
                    >
                      {copiedCode === room.roomCode ? (
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