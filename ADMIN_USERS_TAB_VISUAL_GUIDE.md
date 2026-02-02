# Admin Users Tab - Visual Guide & Features

## 📊 Enhanced User Details Modal

### Interface Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 👤 John Doe                                              ✕      │
├─────────────────────────────────────────────────────────────────┤
│ 👤 Overview | 🏪 Connected Shops | 📋 Offers | ⏱️ Activity    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ User Information:                                                │
│ ┌─────────────────────────┬─────────────────────────┐            │
│ │ User ID: #1            │ Email: john@example.com │            │
│ └─────────────────────────┴─────────────────────────┘            │
│                                                                   │
│ 👤 Regular User                                                 │
│ Joined: 01/15/2026                                              │
│                                                                   │
│ ┌──────────────────┬──────────────────┐                          │
│ │ Connected Shops  │ Account Visits   │                          │
│ │      8           │      45          │                          │
│ └──────────────────┴──────────────────┘                          │
│                                                                   │
│ ┌──────────────────┬──────────────────┐                          │
│ │ Active Bookmarks │ Viewed Offers    │                          │
│ │      18          │      125         │                          │
│ └──────────────────┴──────────────────┘                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏪 Connected Shops Tab

```
Connected Shops (8)

┌─────────────────────────────────────────────────────┐
│ 🏪 Local Pizza                    [APPROVED]        │
│ Owner: Ahmed Khan                                   │
│ 📧 pizza@example.com                                │
│ 📍 Downtown                                         │
│ 🏷️ Food & Beverages                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🏪 Fashion Hub                    [APPROVED]        │
│ Owner: Sarah Ahmed                                  │
│ 📧 fashion@example.com                              │
│ 📍 Business District                                │
│ 🏷️ Clothing                                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🏪 Tech Store                     [PENDING]         │
│ Owner: Mike Smith                                   │
│ 📧 tech@example.com                                 │
│ 📍 Mall Area                                        │
│ 🏷️ Electronics                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Offers Tab

### Active Offers Viewed
```
✨ Active Offers Viewed (12)

1. 50% Pizza Discount
   From: Local Pizza
   📍 Downtown

2. Free Delivery on Orders
   From: Local Pizza
   📍 Downtown

3. BOGO Sale on Fashion
   From: Fashion Hub
   📍 Business District

+9 more offers
```

### Past Offers History
```
📜 Past Offers History (5)

1. 30% Off Weekend Special
   Expired: 01/31/2026

2. Early Bird Breakfast Deal
   Expired: 01/25/2026

3. Monthly Membership Offer
   Expired: 01/20/2026
```

---

## ⏱️ Activity Tab

```
┌────────────────────────────────────────────┐
│ Account Visit Metrics                      │
├────────────────────────────────────────────┤
│ Total Visits:        45                    │
│ Last Visit:          02/02/2026            │
│ Profile Views:       120                   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Engagement Score                           │
├────────────────────────────────────────────┤
│ ████████░░  75/100                         │
│                                             │
│ Score breakdown:                           │
│ • Likes Given:       25                    │
│ • Bookmarks Created: 18                    │
│ • Shops Visited:     12                    │
└────────────────────────────────────────────┘
```

---

## 📊 User Statistics Cards (Overview)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total Users  │  │ Regular Users│  │ Shopkeepers  │  │ Admins       │
│    5000      │  │    4200      │  │     750      │  │     50       │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
   [Blue]           [Green]            [Orange]         [Purple]
```

---

## 🔍 Search & Filter System

```
┌─────────────────────────────────────────────────────────┐
│ Search by name or email...                    🔍        │
└─────────────────────────────────────────────────────────┘

Role Filter:
[All Roles ▼]

Showing 127 of 5000 users
```

---

## 👥 Users Table

```
┌────┬──────────┬─────────────────┬────────┬──────────────┐
│ ID │ Name     │ Email           │ Role   │ Actions      │
├────┼──────────┼─────────────────┼────────┼──────────────┤
│ #1 │ John Doe │ john@example.com│ 👤 User│  👁️ View    │
├────┼──────────┼─────────────────┼────────┼──────────────┤
│ #2 │ Jane Smith│jane@example.com│ 🏪 Shopkeeper│ 👁️ View│
├────┼──────────┼─────────────────┼────────┼──────────────┤
│ #3 │ Admin Sam│ admin@example.com│ 👑 Admin│  👁️ View   │
└────┴──────────┴─────────────────┴────────┴──────────────┘
```

---

## 🎨 Color Coding System

| Status | Color | Badge |
|--------|-------|-------|
| APPROVED | Green | ✓ |
| PENDING | Yellow | ⏳ |
| REJECTED | Red | ✕ |
| Regular User | Green | 👤 |
| Shopkeeper | Orange | 🏪 |
| Admin | Purple | 👑 |

---

## 📈 Data Fields Tracked

### User Profile
- ✅ User ID
- ✅ Full Name
- ✅ Email Address
- ✅ Role (User/Shopkeeper/Admin)
- ✅ Account Created Date
- ✅ Last Login Date

### Activity Metrics
- ✅ Total Account Visits
- ✅ Profile Views
- ✅ Likes Given
- ✅ Bookmarks Created
- ✅ Shops Visited
- ✅ Engagement Score (0-100)

### Connected Data
- ✅ Bookmarked Shops (with details)
- ✅ Active Offers Viewed
- ✅ Past Offers History
- ✅ Shop Location & Area
- ✅ Shop Documents Status

---

## 🚀 New Backend API Response

### GET `/api/admin/users/{id}`

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2026-01-15T10:30:00",
  "lastLoginDate": "2026-02-02T15:45:00",
  "accountVisits": 45,
  "profileViews": 120,
  "likesCount": 25,
  "bookmarksCount": 18,
  "shopsVisited": 12,
  "engagementScore": 75,
  "connectedShopsCount": 8,
  "bookmarkedShops": [
    {
      "id": 1,
      "shopName": "Local Pizza",
      "ownerName": "Ahmed Khan",
      "email": "pizza@example.com",
      "area": "Downtown",
      "category": "Food",
      "address": "123 Main Street",
      "registrationStatus": "APPROVED",
      "mobileNumber": "+1234567890"
    }
  ],
  "viewedOffers": [
    {
      "id": 1,
      "title": "50% Pizza Discount",
      "shopName": "Local Pizza",
      "area": "Downtown",
      "category": "Food"
    }
  ],
  "pastOffers": [
    {
      "id": 2,
      "title": "Free Delivery",
      "shopName": "Local Pizza",
      "expiryDate": "2026-03-04T10:00:00"
    }
  ]
}
```

---

## 🔧 How to Use

### For Admin Users:

1. **Login to Admin Panel**
   - Click "Admin Panel" in navbar
   - Enter admin credentials

2. **View Users**
   - Go to "Users" tab
   - See statistics at top
   - View all users in table

3. **Search & Filter**
   - Use search bar for name/email
   - Select role from dropdown
   - Results update in real-time

4. **View User Details**
   - Click eye icon on any user row
   - Modal opens with 4 tabs
   - Navigate between tabs to explore data

5. **Explore Tabs**
   - **Overview**: Basic stats & metrics
   - **Connected Shops**: Bookmarked shops
   - **Offers**: Viewed & past offers
   - **Activity**: Engagement metrics

---

## 📱 Responsive Design

### Desktop View
- Full modal with all information
- Tabs visible and accessible
- Data in organized grids
- Smooth animations

### Tablet View
- Responsive grid layout
- Stacked metrics cards
- Tab navigation adapts
- Touch-friendly buttons

### Mobile View
- Single column layout
- Easy swipe between tabs
- Mobile-optimized modals
- Readable text sizes

---

## ✨ Key Features

1. **Comprehensive User Profiles** - All user information in one place
2. **Shopping Behavior Tracking** - See what users are interested in
3. **Engagement Analytics** - Understand user activity levels
4. **Shop Connections** - Know which shops users prefer
5. **Offer History** - Track user interest in offers
6. **Engagement Scoring** - Quantify user participation
7. **Easy Navigation** - Tab-based interface for quick access
8. **Real-time Data** - Current user statistics and metrics

---

## 🔐 Security Features

- ✅ Admin-only access
- ✅ Role-based authorization
- ✅ Secure API endpoints
- ✅ Data validation
- ✅ Protected routes
- ✅ Session management

---

## 📞 Support Information

For any issues or questions:
1. Check browser console for errors
2. Verify backend server is running (Port 8080)
3. Check CORS configuration
4. Review network requests in DevTools
5. Consult implementation guide for details

