# 🛍️ Social Shopping Add-on

A collaborative **shopping experience layer** built on top of e-commerce platforms like **Myntra**.  
This add-on enables **group shopping, real-time chat, reactions, voting, and shared carts** — all without requiring login/signup.  

---

## ✨ Features

### 🔓 Public Brand Channels
- Join channels like **Zara, H&M, Nike**.  
- See new product drops in real time.  
- React with 👍/👎 or emoji.  
- Add items to a **shared brand cart**.  

### 🔒 Private Shopping Rooms
- Create private rooms with friends (via invite link).  
- Browse together and chat in real time.  
- Share product links/outfits from Myntra.  
- Vote and react on items.  
- Build a **shared cart** for collective purchases.  

### 🌟 Core Across Rooms/Channels
- Realtime chat + emoji reactions.  
- Voting system on products.  
- Group wishlist (most voted items highlighted).  
- Shared cart with live total value.  
- Synchronized product feed for everyone.  

---

## 🗄️ Database Schema (Supabase)

The project uses **Supabase (Postgres)** for backend.  

### Tables
- **users** → Anonymous users (session-based).  
- **brand_channels** → Public brand-specific channels.  
- **channel_members** → Users inside brand channels.  
- **rooms** → Private rooms created by users.  
- **room_members** → Users inside private rooms.  
- **products** → Products shared inside rooms/channels.  
- **votes** → Reactions & votes on products.  
- **messages** → Real-time chat messages.  
- **carts** → Shared cart for each room/channel.  
- **cart_items** → Products inside shared carts.  

👉 Full SQL schema: [schema.sql](./schema.sql)  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/social-shopping-addon.git
