## Localoot Setup

1. Create MySQL database `localoot` and a user with access.
2. Create `server/.env` with:

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=localoot
DB_USER=root
DB_PASS=your_mysql_password
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
```

3. Install dependencies

```
cd server && npm i
cd ../client && npm i
```

4. Seed and run backend

```
cd server
npm run seed
npm run dev
```

5. Run frontend

```
cd ../client
npm run dev
```


