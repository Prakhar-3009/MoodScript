# MoodScript 📝✨

A beautiful, secure, and feature-rich digital journaling application that helps you capture your thoughts, track your moods, and discover patterns in your emotional journey.

## 🌟 Features

### ✍️ **Rich Journaling Experience**
- **Rich Text Editor** - Express yourself with a powerful Quill editor supporting formatting, links, and more
- **Mood Tracking** - Select from 8 different moods with visual indicators and emojis
- **Mood-Based Imagery** - Automatic mood visualization using Pixabay API
- **Draft Saving** - Never lose your work with automatic and manual draft saving
- **Collections** - Organize your entries into custom collections

### 📊 **Analytics & Insights**
- **Mood Analytics** - Visual charts showing your emotional trends over time
- **Pattern Recognition** - Discover patterns in your mood and writing habits
- **Entry Statistics** - Track your journaling consistency and growth

### 🔒 **Security & Privacy**
- **User Authentication** - Secure login with Clerk authentication
- **Data Privacy** - Your thoughts are private and secure
- **Rate Limiting** - Protected against spam with ArcJet rate limiting

### 🎨 **Beautiful UI/UX**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern Interface** - Clean, intuitive design with smooth animations
- **Dark/Light Mode** - Choose your preferred theme
- **Accessibility** - Built with accessibility best practices

### 🔍 **Search & Organization**
- **Advanced Filtering** - Filter entries by mood, date, and collection
- **Search Functionality** - Search through titles and content
- **Pagination** - Efficient browsing through large numbers of entries
- **Collection Management** - Create and manage custom collections

### 📱 **User Experience**
- **Real-time Updates** - Instant feedback and updates
- **Loading States** - Smooth loading indicators throughout the app
- **Toast Notifications** - Clear feedback for all user actions
- **Form Validation** - Comprehensive error handling and validation


## 🎨 UI Showcase
- 📱 Homepage with hero section
![Homepage Screenshot](https://i.postimg.cc/Th8TfTgN/Screenshot-2025-07-19-224819.png)
- ✍️ Journal writing interface
[![Screenshot-2025-07-19-225110.png](https://i.postimg.cc/DZqr6MZg/Screenshot-2025-07-19-225110.png)](https://postimg.cc/5Y2QNp8Y)
- 📊 Analytics dashboard
[![Screenshot-2025-07-19-224941.png](https://i.postimg.cc/RCKspg82/Screenshot-2025-07-19-224941.png)](https://postimg.cc/RqCLNLvT)
[![Screenshot-2025-07-19-225002.png](https://i.postimg.cc/0QgGps8j/Screenshot-2025-07-19-225002.png)](https://postimg.cc/Ty9W6B5v)


## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons
- **React Quill** - Rich text editor
- **Embla Carousel** - Smooth carousel components

### **Backend & Database**
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Reliable database
- **Next.js Server Actions** - API endpoints
- **Clerk** - Authentication and user management
- **ArcJet** - Rate limiting and security

### **External APIs**
- **Pixabay API** - Mood-based imagery
- **Date-fns** - Date manipulation

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast development builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Clerk account for authentication
- Pixabay API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moodscript.git
   cd moodscript
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   CLERK_SECRET_KEY="..."
   CLERK_PUBLISHABLE_KEY="..."
   PIXABAY_API_KEY="..."
   ARCJET_KEY="..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
```

## 🎯 Key Features in Detail

### **Mood Tracking System**
- 8 distinct moods with visual indicators
- Automatic mood scoring for analytics
- Mood-based image generation
- Mood filtering and search

### **Rich Text Editor**
- Full formatting capabilities
- Link embedding
- Lists and blockquotes
- Code blocks
- Clean, distraction-free interface

### **Collection Management**
- Create unlimited collections
- Organize entries by themes
- Collection-specific analytics
- Easy entry organization

### **Analytics Dashboard**
- Visual mood trends
- Writing consistency tracking
- Entry statistics
- Pattern recognition

## 🔧 Configuration

### **Database Schema**
The application uses Prisma with the following main models:
- `User` - User accounts and preferences
- `Entry` - Journal entries with mood data
- `Collection` - User-defined collections
- `Draft` - Auto-saved drafts

### **Authentication**
Clerk handles all authentication with:
- Email/password login
- Social login options
- User profile management
- Session management


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Pixabay](https://pixabay.com) for mood imagery
- [Prisma](https://prisma.io) for database management
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Next.js](https://nextjs.org) for the framework


**Made with ❤️ for mindful journaling**

---


