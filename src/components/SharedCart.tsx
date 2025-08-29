import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Users,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface CartItem {
  id: string;
  product: {
    id: string;
    product_name: string;
    product_image: string;
    product_price: number;
    product_url: string;
    source: string;
  };
  quantity: number;
  added_by_user?: {
    display_name?: string;
  };
}

interface SharedCartProps {
  roomId?: string;
  channelId?: string;
}

export const SharedCart = ({ roomId, channelId }: SharedCartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const { user } = useUser();

  const isPublic = !!channelId;

  useEffect(() => {
    if (roomId || channelId) {
      fetchCart();
    }
  }, [roomId, channelId, user]);

  const fetchCart = async () => {
    try {
      // Get cart for room or channel
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq(roomId ? 'room_id' : 'channel_id', roomId || channelId)
        .single();

      if (cartError && cartError.code !== 'PGRST116') throw cartError;

      if (!cartData) {
        // Create cart if it doesn't exist
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert(roomId ? { room_id: roomId } : { channel_id: channelId })
          .select('id')
          .single();

        if (createError) throw createError;
        setCartId(newCart.id);
        return;
      }

      setCartId(cartData.id);

      // Fetch cart items with products and user info
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (
            id,
            product_name,
            product_image,
            product_price,
            product_url,
            source
          ),
          users (
            display_name
          )
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) throw itemsError;

      const formattedItems = itemsData?.map(item => ({
        id: item.id,
        product: item.products,
        quantity: item.quantity,
        added_by_user: item.users
      })) || [];

      setCartItems(formattedItems);
      
      // Calculate total
      const total = formattedItems.reduce((sum, item) => 
        sum + (item.product.product_price * item.quantity), 0
      );
      setTotalValue(total);

    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!cartId || cartItems.length === 0) {
    return (
      <Card className="p-6 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Cart is Empty</h3>
        <p className="text-muted-foreground">
          Start adding products to see them here!
        </p>
      </Card>
    );
  }

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
                {isPublic ? "Community" : "Shopping together"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Cart Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cart Items</h3>
        
        <div className="space-y-3">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4 hover:shadow-card transition-all duration-200">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.product.product_image || '/placeholder.svg'} 
                  alt={item.product.product_name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{item.product.product_name}</h4>
                  <p className="text-sm text-muted-foreground">{item.product.source}</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary">₹{item.product.product_price}</span>
                    {item.added_by_user?.display_name && (
                      <span className="text-xs text-muted-foreground">
                        Added by {item.added_by_user.display_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Quantity */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(item.product.product_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
            Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};