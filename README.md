# LocalLoot - Area-Wise Offers Platform

LocalLoot is a dynamic MERN stack web application (with SQL database) that helps users discover the best local offers and deals in Pune. The platform allows users to browse category-wise offers, filter by areas, and interact with offers through likes, bookmarks, and sharing.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and signup with JWT tokens
- **Category-Based Browsing**: Browse offers by categories (Food, Fashion, Electronics, Beauty, etc.)
- **Area-Wise Filtering**: Filter offers by specific areas in Pune
- **Top 3 Offers**: View the top 3 offers for each selected category
- **Search Functionality**: 
  - Search categories by name
  - Search areas in Pune
- **Offer Details**: Comprehensive offer pages with:
  - Shop information (name, image, address, phone)
  - Embedded Google Maps integration
  - Offer descriptions and images
  - Start and end dates
- **Social Features**:
  - Like offers
  - Bookmark offers for later
  - Share offers via native share API or copy link
- **User Dashboard**: 
  - View liked offers
  - View bookmarked offers
  - View saved shops

### UI/UX Features
- Modern, responsive design with Tailwind CSS
- Header and Footer components
- Beautiful card-based layouts
- Smooth transitions and hover effects
- Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** 18 with React Router
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls

## 📁 Project Structure

```
LocalLoot/
├── backend/
│   ├── src/
│   │   ├── index.js          # Entry point
│   │   ├── server.js         # Express app setup
│   │   ├── storage/
│   │   │   ├── db.js         # Database connection
│   │   │   └── models/       # Sequelize models
│   │   ├── web/
│   │   │   ├── auth.routes.js
│   │   │   ├── categories.routes.js
│   │   │   ├── offers.routes.js
│   │   │   └── ...           # Other routes
│   │   └── security/
│   │       └── auth.middleware.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── store/            # State management
│   │   ├── api/              # API client
│   │   └── styles/           # Global styles
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd LocalLoot
   ```

2. **Set up the database**
   - Create a MySQL database named `localoot`
   - Create a user with access to the database

3. **Configure Backend**
   - Navigate to the backend directory
   - Create a `.env` file in the `backend/` directory:
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=localoot
   DB_USER=root
   DB_PASS=your_mysql_password
   JWT_SECRET=replace_with_strong_secret_key
   JWT_EXPIRES_IN=7d
   ```

4. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Seed the Database**
   ```bash
   npm run seed
   ```
   This will create sample categories, areas, shops, and offers.

6. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:4000`

7. **Configure Frontend**
   - Navigate to the frontend directory
   - Create a `.env` file (if needed) to configure API endpoint:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

8. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

9. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📖 Usage

### For Users

1. **Sign Up / Login**
   - Create an account or login to access all features
   - Authentication is required to view offers

2. **Browse Categories**
   - Navigate to the Categories page
   - Use the search bar to find specific categories
   - Click on a category to view offers

3. **Filter by Area**
   - Select an area from the dropdown (e.g., Kothrud, Baner, Hinjawadi)
   - Use the area search to find specific locations in Pune
   - View area-specific offers

4. **View Top Offers**
   - When a category is selected, the top 3 offers are prominently displayed
   - These are the best deals in that category

5. **Interact with Offers**
   - **Like**: Click the like button to save your favorite offers
   - **Bookmark**: Bookmark offers to view them later
   - **Share**: Share offers with friends via native share or copy link
   - **View Details**: Click on an offer to see full details including shop info and map

6. **View Offer Details**
   - See complete offer information
   - View shop details (name, address, phone)
   - See location on embedded Google Maps
   - Access shop profile

### For Developers

#### API Endpoints

**Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

**Categories**
- `GET /api/categories` - Get all categories
- `GET /api/categories/:categoryId/trending` - Get trending offers for category
- `GET /api/categories/:categoryId/top-offers` - Get top 3 offers for category
- `GET /api/categories/:categoryId/offers` - Get all offers for category (with optional areaId query)

**Offers**
- `GET /api/offers/:offerId` - Get offer details
- `POST /api/offers/:offerId/like` - Like an offer
- `POST /api/offers/:offerId/bookmark` - Bookmark an offer

**Areas**
- `GET /api/areas` - Get all areas (with optional city and q query params)

## 🎨 Key Components

### Frontend Components
- **Navbar**: Navigation bar with user menu and stats
- **Footer**: Site footer with links and information
- **OfferCard**: Reusable card component for displaying offers
- **AreaFilter**: Dropdown component for area selection
- **TrendingBanner**: Banner component for category pages
- **ProtectedRoute**: Route wrapper for authenticated pages

### Pages
- **Home**: Landing page with featured categories
- **Categories**: Main offers browsing page with filters
- **OfferDetail**: Detailed offer view with map and shop info
- **Login/Signup**: Authentication pages
- **MyLikes/MyBookmarks**: User's saved content

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes for authenticated pages
- CORS configuration
- Input validation with Joi

## 🗄️ Database Schema

- **Users**: User accounts and authentication
- **Categories**: Offer categories
- **Areas**: Geographic areas (Pune)
- **Shops**: Shop information
- **Offers**: Offer details linked to shops and categories
- **OfferLike**: User likes on offers
- **OfferBookmark**: User bookmarks on offers
- **ShopSave**: User saved shops

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Email notifications for new offers
- [ ] Advanced search filters
- [ ] User reviews and ratings
- [ ] Admin dashboard
- [ ] Mobile app
- [ ] Push notifications
- [ ] Social media integration

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact: support@localloot.com

---

Built with ❤️ for Pune's local business community

