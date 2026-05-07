const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const FoodItem = require('./src/models/FoodItem');

const MOCK_ITEMS = [
  // Original Items
  { name: 'Truffle Mushroom Burger', price: 14.99, category: 'Burgers', rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', description: 'Gourmet beef patty with black truffle aioli and sautéed forest mushrooms.' },
  { name: 'Saffron Seafood Paella', price: 24.50, category: 'Main Course', rating: 4.9, image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80', description: 'Traditional Spanish rice with fresh mussels, shrimp, and aromatic saffron.' },
  { name: 'Avocado Quinoa Salad', price: 12.00, category: 'Salads', rating: 4.6, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Fresh organic greens, tri-color quinoa, and ripe hass avocado with citrus zest.' },
  { name: 'Spicy Ramen Miso', price: 16.99, category: 'Soups', rating: 4.7, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80', description: 'Rich miso broth with hand-pulled noodles and slow-cooked pork belly.' },
  
  // Thali / Indian Items (IDs synchronized with buildYourPlateData.js)
  { _id: '65c276f2d2b51c1d1e1f1111', name: 'Roti', price: 15.00, category: 'Breads', rating: 4.5, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=800&fit=crop', description: 'Soft whole wheat flatbread baked in a tandoor.' },
  { _id: '65c276f2d2b51c1d1e1f2222', name: 'Butter Naan', price: 45.00, category: 'Breads', rating: 4.7, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=800&fit=crop', description: 'Classic leavened bread with a generous helping of butter.' },
  { _id: '65c276f2d2b51c1d1e1f3333', name: 'Garlic Naan', price: 55.00, category: 'Breads', rating: 4.8, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=800&fit=crop', description: 'Leavened bread topped with fresh garlic and cilantro.' },
  { _id: '65c276f2d2b51c1d1e1f4444', name: 'Aloo Paratha', price: 65.00, category: 'Breads', rating: 4.6, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&h=800&fit=crop', description: 'Wheat flatbread stuffed with spiced mashed potatoes.' },
  { _id: '65c276f2d2b51c1d1e1f5555', name: 'Cheese Bread', price: 75.00, category: 'Breads', rating: 4.8, image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&h=800&fit=crop', description: 'Tandoor naan with a heart of melted cheese.' },
  
  { _id: '65c276f2d2b51c1d1e1f6666', name: 'Paneer Butter Masala', price: 180.00, category: 'Curries', rating: 4.9, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=800&fit=crop', description: 'Creamy tomato gravy with soft cottage cheese cubes.' },
  { _id: '65c276f2d2b51c1d1e1f7777', name: 'Dal Makhani', price: 150.00, category: 'Curries', rating: 4.8, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=800&h=800&fit=crop', description: 'Black lentils slow-cooked with cream and butter.' },
  { _id: '65c276f2d2b51c1d1e1f8888', name: 'Chole Masala', price: 140.00, category: 'Curries', rating: 4.7, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=800&fit=crop', description: 'Spicy and tangy chickpea curry.' },
  { _id: '65c276f2d2b51c1d1e1f9999', name: 'Mix Veg', price: 130.00, category: 'Curries', rating: 4.5, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&h=800&fit=crop', description: 'Assorted seasonal vegetables cooked in an aromatic gravy.' },
  
  { _id: '65c276f2d2b51c1d1e1faaaa', name: 'Jeera Rice', price: 120.00, category: 'Rice', rating: 4.6, rating: 4.6, image: 'https://images.unsplash.com/photo-1596560548464-f010349b7d12?w=800&h=800&fit=crop', description: 'Basmati rice tempered with cumin seeds.' },
  { _id: '65c276f2d2b51c1d1e1fbbbb', name: 'Plain Rice', price: 80.00, category: 'Rice', rating: 4.4, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&h=800&fit=crop', description: 'Steamed fluffy basmati rice.' },
  { _id: '65c276f2d2b51c1d1e1fcccc', name: 'Veg Biryani', price: 200.00, category: 'Rice', rating: 4.8, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=800&fit=crop', description: 'Fragrant rice cooked with vegetables and spices.' },
  
  { _id: '65c276f2d2b51c1d1e1fdddd', name: 'Garden Salad', price: 60.00, category: 'Extras', rating: 4.5, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop', description: 'Fresh cucumber, tomato, and onion slices.' },
  { _id: '65c276f2d2b51c1d1e1feeee', name: 'Mixed Pickle', price: 30.00, category: 'Extras', rating: 4.3, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=800&fit=crop', description: 'Tangy and spicy mixed vegetable pickle.' },
  { _id: '65c276f2d2b51c1d1e1fffff', name: 'Boondi Raita', price: 50.00, category: 'Extras', rating: 4.6, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=800&fit=crop', description: 'Yogurt with crunchy boondi and roasted cumin.' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Seed: Connected to MongoDB');
        
        await FoodItem.deleteMany({});
        console.log('Seed: Cleared existing items');
        
        await FoodItem.insertMany(MOCK_ITEMS);
        console.log('Seed: Inserted menu items');
        
        console.log('Seed: SUCCESS');
        process.exit();
    } catch (err) {
        console.error('Seed: FAILED', err);
        process.exit(1);
    }
};

seedDB();
