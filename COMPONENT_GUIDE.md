# Updated Home Page - Component Guide

## Overview
Your Localoot home page has been redesigned with an Amazon/Meesho-style layout featuring modern components for displaying shops and offers with a premium slider for top 5 offers.

## New Components Created

### 1. **TopOffersSlider.jsx** - Hero Slider with Top 5 Offers
**Location**: `src/components/TopOffersSlider.jsx`

**Features**:
- Automatic carousel that rotates every 5 seconds
- Manual navigation with previous/next buttons
- Dot indicators to jump to specific slides
- Displays offer details including:
  - Large hero image
  - Discount percentage
  - Shop information with logo
  - Call-to-action button
- Responsive design with gradient overlays
- Slide counter in top-right corner

**API Call**: `GET /api/offers?sort=trending&limit=5`

**Usage**:
```jsx
import TopOffersSlider from '../components/TopOffersSlider';

<TopOffersSlider />
```

---

### 2. **ShopGrid.jsx** - Featured Shops Grid
**Location**: `src/components/ShopGrid.jsx`

**Features**:
- Responsive 4-column grid layout (3 on tablet, 1 on mobile)
- Shop cards with:
  - Shop logo/image
  - Heart like button
  - Featured badge
  - Shop name and area
  - Star rating with review count
  - Category tags
  - "View Offers" button
  - Share functionality
- Hover effects and animations
- Loading skeleton states

**API Call**: `GET /api/shops?limit=8`

**Usage**:
```jsx
import ShopGrid from '../components/ShopGrid';

<ShopGrid />
```

---

### 3. **OffersGrid.jsx** - Trending Offers Grid
**Location**: `src/components/OffersGrid.jsx`

**Features**:
- Responsive 3-column grid (2 on tablet, 1 on mobile)
- Offer cards displaying:
  - Offer image with hover zoom
  - Trending badge with fire emoji
  - Discount badge (percentage)
  - Heart/Like button (appears on hover)
  - Bookmark button (appears on hover)
  - Offer title and description
  - Shop information with location
  - Original and discounted price
  - Star rating and reviews
  - Valid until date
  - Call-to-action button
- Smooth animations and transitions
- Loading states

**API Call**: `GET /api/offers?limit=12`

**Usage**:
```jsx
import OffersGrid from '../components/OffersGrid';

<OffersGrid />
```

---

### 4. **PromoBanner.jsx** - Promotional Banner
**Location**: `src/components/PromoBanner.jsx`

**Features**:
- Eye-catching gradient background
- Promotional text with discount code
- Close button with X icon
- Pulse animation effect
- Dismissible state

**Usage**:
```jsx
import PromoBanner from '../components/PromoBanner';

<PromoBanner />
```

---

## Updated Home Page Layout

The new home page follows this structure:

```
1. Promo Banner (Dismissible)
   ↓
2. Top Offers Slider (Hero Section)
   ↓
3. Search & Filter Bar
   - Search box for shops/offers
   - Location/area input
   ↓
4. Category Pills (Horizontal Scroll)
   - Food & Dining
   - Fashion
   - Electronics
   - Beauty
   - Health & Wellness
   - Home & Living
   - Sports
   - More
   ↓
5. Featured Shops Section
   - Section header with "View All" link
   - ShopGrid component (8 shops)
   ↓
6. Trending Offers Section
   - Section header with "View All" link
   - OffersGrid component (12 offers)
   ↓
7. Features Info Section
   - Real-time Updates
   - Location-based Deals
   - Save & Share
   ↓
8. CTA Section (Partner with us)
```

---

## Dependencies

### New Package Added
- **lucide-react**: ^1.x.x (for icons)
  - Used icons: ChevronLeft, ChevronRight, Heart, Bookmark, Share2, Star, MapPin, Flame, Search, X

### Existing Dependencies Used
- react
- react-router-dom
- axios (for API calls)

---

## API Endpoints Required

Make sure your backend supports these endpoints:

1. **GET /api/offers?sort=trending&limit=5**
   - Returns top 5 trending offers
   - Required fields: id, title, description, image_url, discount, is_trending, price
   - Shop object: id, name, logo, area

2. **GET /api/shops?limit=8**
   - Returns featured shops
   - Required fields: id, name, logo, area, rating, reviews_count, description, category, tags, is_featured

3. **GET /api/offers?limit=12**
   - Returns trending offers
   - Required fields: id, title, description, image_url, discount, is_trending, price, rating, reviews_count, valid_until
   - Shop object: id, name, logo, area

---

## Styling

All components use **Tailwind CSS** with:
- Responsive breakpoints (md, lg)
- Gradient backgrounds
- Smooth transitions and animations
- Hover states and effects
- Shadow effects for depth
- Color scheme: Blue/Indigo primary, with accent colors (red, green, yellow)

---

## Features Implemented (Like Amazon/Meesho)

✅ **Slider**: Top 5 offers carousel with auto-rotation  
✅ **Shop Grid**: Modern card layout with ratings and reviews  
✅ **Offer Grid**: Detailed offer cards with pricing and badges  
✅ **Search Bar**: Search functionality placeholder  
✅ **Category Navigation**: Horizontal category pills  
✅ **Like/Bookmark**: User interaction buttons  
✅ **Responsive Design**: Works on all screen sizes  
✅ **Promotional Banner**: Eye-catching deals announcement  
✅ **Loading States**: Skeleton screens while fetching data  
✅ **Location-Based**: Area display and filtering  

---

## Customization Tips

### Change Colors
Edit Tailwind classes:
- Primary: `from-blue-500 to-indigo-600`
- Accent: `from-yellow-400 via-orange-400 to-red-400`

### Adjust Grid Columns
In `ShopGrid.jsx` and `OffersGrid.jsx`:
```jsx
// For shops: md:grid-cols-2 lg:grid-cols-4
// For offers: md:grid-cols-2 lg:grid-cols-3
```

### Change Auto-Scroll Time
In `TopOffersSlider.jsx`:
```jsx
}, 5000); // Change 5000ms to desired interval
```

### Modify Cards Height
Adjust `h-40`, `h-48` etc. in component classes

---

## Next Steps

1. **API Integration**: Ensure backend returns data in expected format
2. **Search Functionality**: Implement search logic in Home component
3. **Category Filtering**: Add category filter functionality
4. **Like/Bookmark Persistence**: Store in database or localStorage
5. **Deep Linking**: Update offer/shop links to work with your routes
6. **Performance**: Implement image lazy loading for better performance

---

## File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── TopOffersSlider.jsx (NEW)
│   │   ├── ShopGrid.jsx (NEW)
│   │   ├── OffersGrid.jsx (NEW)
│   │   ├── PromoBanner.jsx (NEW)
│   │   └── ... (other components)
│   ├── pages/
│   │   ├── Home.jsx (UPDATED)
│   │   └── ... (other pages)
│   └── ... (other files)
```

---

## Browser Support
- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: Full support

---

Happy coding! 🚀
