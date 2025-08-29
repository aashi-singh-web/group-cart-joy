-- 1. Users table
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text,
  created_at timestamp DEFAULT now()
);

-- 2. Brand Channels
CREATE TABLE public.brand_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- 3. Channel Members
CREATE TABLE public.channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.brand_channels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at timestamp DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- 4. Private Rooms
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name text,
  room_code text UNIQUE,
  created_by uuid REFERENCES public.users(id),
  is_private boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- 5. Room Members
CREATE TABLE public.room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at timestamp DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- 6. Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  product_url text NOT NULL,
  product_name text,
  product_image text,
  product_price numeric,
  created_at timestamp DEFAULT now()
);

-- 7. Votes
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES public.brand_channels(id) ON DELETE CASCADE,
  vote_type text NOT NULL,
  emoji text,
  created_at timestamp DEFAULT now(),
  UNIQUE(product_id, user_id, room_id, channel_id)
);

-- 8. Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES public.brand_channels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- 9. Shared Carts
CREATE TABLE public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES public.brand_channels(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now()
);

-- 10. Cart Items
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity int DEFAULT 1,
  added_by uuid REFERENCES public.users(id),
  created_at timestamp DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allowing public access since no auth required)
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on brand_channels" ON public.brand_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on channel_members" ON public.channel_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on room_members" ON public.room_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on votes" ON public.votes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on carts" ON public.carts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cart_items" ON public.cart_items FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample brand channels
INSERT INTO public.brand_channels (brand_name) VALUES 
  ('Zara'),
  ('H&M'),
  ('Nike'),
  ('Adidas'),
  ('Uniqlo');

-- Create carts for each brand channel
INSERT INTO public.carts (channel_id)
SELECT id FROM public.brand_channels;