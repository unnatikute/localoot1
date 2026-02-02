# Admin Dashboard Setup Checklist ✅

## Backend Setup

### 1. Database Migration
Run this SQL to create the shops table:
```sql
CREATE TABLE shops (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shop_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20),
    address TEXT,
    area VARCHAR(255),
    category VARCHAR(255),
    shop_image LONGTEXT,
    registration_status VARCHAR(50) DEFAULT 'PENDING',
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    shopkeeper_id BIGINT,
    shop_registration_doc LONGTEXT,
    gst_doc LONGTEXT,
    owner_id_doc LONGTEXT,
    address_proof_doc LONGTEXT,
    FOREIGN KEY (shopkeeper_id) REFERENCES users(id)
);

CREATE INDEX idx_registration_status ON shops(registration_status);
CREATE INDEX idx_registration_date ON shops(registration_date);
CREATE INDEX idx_shopkeeper_id ON shops(shopkeeper_id);
```

### 2. Java Files Created/Updated

**New Files:**
- ✅ `backend/src/main/java/com/localoot/localoot/model/Shop.java` - Shop entity
- ✅ `backend/src/main/java/com/localoot/localoot/repository/ShopRepository.java` - Shop repository
- ✅ `backend/src/main/java/com/localoot/localoot/controller/AdminController.java` - Admin endpoints

**Updated Files:**
- ✅ `backend/src/main/java/com/localoot/localoot/repository/UserRepository.java` - Added queries

### 3. Backend Restart
```bash
# In backend directory
mvn clean install
mvn spring-boot:run
```

### 4. Test Backend Endpoints
- [ ] `GET http://localhost:8080/api/admin/shops` - Should return empty list or existing shops
- [ ] `GET http://localhost:8080/api/admin/users` - Should return all users
- [ ] `GET http://localhost:8080/api/admin/analytics` - Should return stats
- [ ] `GET http://localhost:8080/api/admin/users/stats` - Should return user stats

---

## Frontend Setup

### 1. Components Created

**New Components:**
- ✅ `frontend/src/components/AdminShopsTab.jsx` - Shops management
- ✅ `frontend/src/components/AdminUsersTab.jsx` - Users management
- ✅ `frontend/src/components/AdminAnalyticsTab.jsx` - Analytics dashboard

**Updated Components:**
- ✅ `frontend/src/pages/AdminPanel.jsx` - New tabbed interface
- ✅ `frontend/src/components/Navbar.jsx` - Admin menu link

### 2. Dependencies Check
All components use existing dependencies:
- ✅ `react` - Core
- ✅ `axios` - HTTP requests
- ✅ `lucide-react` - Icons (already in navbar)
- ✅ `tailwindcss` - Styling (already configured)

No new npm packages needed!

### 3. Frontend Restart
```bash
# In frontend directory
npm install (if needed)
npm run dev
```

### 4. Test Admin Features

**Access Admin Panel:**
- [ ] Go to http://localhost:5173
- [ ] Click "Login" dropdown
- [ ] Select "⭐ Admin Access"
- [ ] Login with admin account
- [ ] Click "⭐ Admin Panel" in navbar
- [ ] Should see tabbed interface

**Test Each Tab:**
- [ ] **Pending Offers**: View and approve/reject offers
- [ ] **Shops**: Search, filter, view details, approve/reject
- [ ] **Users**: Search, filter by role, view details
- [ ] **Analytics**: View statistics and engagement metrics

---

## Feature Verification

### ✅ Shops Tab Features
- [x] Display all shops
- [x] Show shop statistics (Total, Approved, Pending, Rejected)
- [x] Search by shop name, email, owner name
- [x] Filter by registration status
- [x] Filter by registration month
- [x] View shop details in modal
- [x] Show all shop documents
- [x] Approve shops (when pending)
- [x] Reject shops (when pending)
- [x] Responsive table design

### ✅ Users Tab Features
- [x] Display all users
- [x] Show user statistics by role
- [x] Search by name or email
- [x] Filter by user role
- [x] View user details in modal
- [x] Color-coded role badges
- [x] User ID display
- [x] Responsive table design

### ✅ Analytics Tab Features
- [x] Display total users, shops, offers, pending approvals
- [x] Show user statistics (Regular, Shopkeepers, Active)
- [x] Show shop statistics (Approved, Pending, Rejected)
- [x] Show offer statistics (Total, Approved, Pending)
- [x] Display engagement metrics
- [x] Platform summary section
- [x] Last update timestamp
- [x] Responsive grid layout

### ✅ Admin Menu
- [x] Admin Panel button appears in navbar when admin logged in
- [x] Works on desktop and mobile
- [x] Direct navigation to admin dashboard

---

## Important Notes

### Default Admin Account
The system needs at least one admin user. Create via:
```sql
-- Add admin user (ensure password is hashed in code)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@localoot.com', 'hashed_password', 'admin');
```

### Role Values
Make sure your user registration uses these role values:
- `user` - Regular users/customers
- `shopkeeper` - Shop owners
- `admin` - Administrators

### CORS Configuration
Verify CORS is enabled in backend `AdminController`:
```java
@CrossOrigin(origins = "*") // or specific URL
```

### Port Configuration
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- Ensure both are running simultaneously

---

## Deployment Checklist

### Before Production:

**Security:**
- [ ] Change `@CrossOrigin(origins = "*")` to specific domain
- [ ] Add role validation in backend for all admin endpoints
- [ ] Implement protected routes in frontend
- [ ] Add authentication tokens to requests
- [ ] Enable HTTPS
- [ ] Set up proper database backups

**Performance:**
- [ ] Implement pagination for large datasets
- [ ] Add loading states
- [ ] Optimize database queries
- [ ] Cache frequently accessed data
- [ ] Compress response data

**Monitoring:**
- [ ] Set up error logging
- [ ] Create audit trail for admin actions
- [ ] Monitor API response times
- [ ] Set up alerts for system issues

---

## Troubleshooting

### Issue: Admin Panel button not showing
**Solution:**
1. Verify `user.role === "admin"` in your auth store
2. Check browser console for JavaScript errors
3. Clear browser cache (Ctrl+Shift+Delete)
4. Verify user is logged in

### Issue: Data not loading in tabs
**Solution:**
1. Check backend is running on port 8080
2. Open browser DevTools → Network tab
3. Look for API calls: `/api/admin/shops`, `/api/admin/users`, `/api/admin/analytics`
4. Check for 404 or 500 errors
5. Verify endpoints are created correctly

### Issue: "Cannot read property 'role' of null"
**Solution:**
1. Ensure user is logged in before accessing admin panel
2. Check auth context is properly initialized
3. Verify user object is stored in localStorage

### Issue: CORS errors
**Solution:**
```java
@CrossOrigin(origins = "http://localhost:5173") // Add your frontend URL
```

### Issue: Styles not applying
**Solution:**
1. Verify Tailwind CSS is configured
2. Check className syntax is correct
3. Clear Tailwind cache: `npx tailwindcss -i ./src/styles/index.css -o ./dist/output.css`

---

## Quick Start Commands

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```bash
mysql -u root -p your_database < schema.sql
```

---

## Useful Links

- 📖 [React Documentation](https://react.dev)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com)
- 🔐 [Spring Security](https://spring.io/projects/spring-security)
- 🗄️ [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- 🚀 [Axios Documentation](https://axios-http.com)

---

## Support

For issues or questions:
1. Check error messages in browser console
2. Review network tab for API responses
3. Check backend logs for server errors
4. Refer to ADMIN_DASHBOARD_GUIDE.md for detailed documentation

---

## Success Criteria ✨

You'll know it's working when:
- ✨ Admin can login and see dashboard
- ✨ All 4 tabs are visible and clickable
- ✨ Data loads without errors
- ✨ Search and filters work properly
- ✨ Approve/reject actions complete successfully
- ✨ Statistics update in real-time
- ✨ Responsive design works on mobile
- ✨ No console errors

**Happy Admin Dashboard! 🎉**
