# 🧬 FoodGenie: AI-Powered Gastronomy Platform

![FoodGenie Banner](./banner.png)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blueviolet?style=for-the-badge)](https://mongodb.com)
[![AI Integration](https://img.shields.io/badge/AI-Powered-orange?style=for-the-badge)](https://groq.com)
[![UI/UX](https://img.shields.io/badge/UI-Glassmorphism-purple?style=for-the-badge)](https://framer.com/motion)

FoodGenie is a next-generation food ordering and discovery platform that leverages Artificial Intelligence to personalize the dining experience. Built with a premium glassmorphism design language, it offers a high-end feel while maintaining high performance.

## ✨ Core Features

- **🤖 AI Recommendation Engine:** Uses LLMs (via Groq/OpenAI) to suggest dishes based on user budget, mood, or dietary preferences.
- **💎 Premium UI/UX:** Fully responsive, dark-mode focused glassmorphism interface built with Framer Motion and Tailwind CSS.
- **🛒 Dynamic Cart System:** Real-time stock availability checking and secure checkout simulation.
- **📍 Real-Time Tracking:** Aesthetic order status tracking with status-specific animations.
- **👤 User Management:** Secure JWT authentication, profile customization, and order history.
- **🛠️ Admin Dashboard:** Full control over menu items, user roles, and order fulfillment.

## 🚀 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **AI Engine:** Groq API / OpenAI SDK.
- **Media:** Pexels API for dynamic, high-quality dish imagery.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local installation
- API Keys for: Groq/OpenAI and Pexels

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/food-genie.git
   cd food-genie
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in both `frontend/` and `backend/` directories based on the `.env.example` files.

4. **Seed the Database (Optional):**
   ```bash
   npm run seed
   ```

5. **Run in Development Mode:**
   ```bash
   npm run dev
   ```

## 📈 Selling Points for Buyers
- **Modern Design:** Not just another template; this is a bespoke, premium design suitable for high-end restaurants.
- **AI Differentiation:** The "Genie" feature provides a unique selling proposition in a crowded market.
- **Clean Architecture:** Modular code structure making it easy to add payment gateways (Stripe/Razorpay) or mobile wrappers (Capacitor/React Native).

## 📄 License
This project is licensed under the ISC License.

---
*Built with ❤️ for the future of dining.*
