# 🎬 CineVault – Movie Database Platform

A full-stack movie database application built with HTML, JavaScript, Node.js, Express.js, MongoDB, and Tailwind CSS.

---

## 📁 FILE STRUCTURE & WHERE TO SAVE FILES

```
cinevault/
│
├── backend/                         ← Save all backend files here
│   ├── server.js                    ← Entry point – starts Express server
│   ├── package.json                 ← NPM dependencies
│   ├── .env                         ← Environment variables (MongoDB URI, JWT secret)
│   ├── seed.js                      ← Run once to populate sample movies + admin user
│   │
│   ├── models/                      ← Mongoose database schemas
│   │   ├── Movie.js                 ← Movie schema (title, genre, rating, etc.)
│   │   ├── User.js                  ← User schema (name, email, hashed password)
│   │   └── Watchlist.js             ← Watchlist schema (user ↔ movie with status)
│   │
│   ├── controllers/                 ← Business logic for each resource
│   │   ├── movieController.js       ← CRUD + search + rating logic
│   │   ├── userController.js        ← Register, login, profile logic
│   │   └── watchlistController.js   ← Add/update/remove watchlist entries
│   │
│   ├── routes/                      ← Express route definitions
│   │   ├── movieRoutes.js           ← /api/movies routes
│   │   ├── userRoutes.js            ← /api/users routes
│   │   └── watchlistRoutes.js       ← /api/watchlist routes
│   │
│   └── middleware/
│       └── authMiddleware.js        ← JWT auth guard + admin role guard
│
└── frontend/                        ← Save all frontend files here
    ├── index.html                   ← Home page (hero + genre filter + movie grids)
    │
    ├── css/
    │   └── style.css                ← All custom CSS styles
    │
    ├── js/
    │   ├── api.js                   ← All API calls (MovieAPI, UserAPI, WatchlistAPI)
    │   ├── main.js                  ← Shared utilities (toast, navbar, movie card builder)
    │   └── movies.js                ← Movies listing page logic (filter, pagination, admin)
    │
    └── pages/
        ├── movies.html              ← Movie listing page with filters, search, pagination
        ├── movie-detail.html        ← Single movie page with ratings + watchlist action
        ├── watchlist.html           ← User's personal watchlist manager
        ├── login.html               ← Login page
        └── register.html            ← Registration page
```

---

## 🚀 SETUP & RUNNING THE PROJECT

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas cloud)
- A code editor (VS Code recommended)

---

### Step 1 – Set up the Backend

```bash
# Navigate to backend folder
cd cinevault/backend

# Install dependencies
npm install

# Edit .env file with your MongoDB URI
# If using local MongoDB: MONGODB_URI=mongodb://localhost:27017/cinevault
# If using Atlas: MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cinevault

# Seed the database with sample movies and admin user
node seed.js

# Start the backend server
npm run dev        # development (with auto-reload via nodemon)
# OR
npm start          # production
```

Backend will run at: **http://localhost:5000**

---

### Step 2 – Open the Frontend

Since the frontend is plain HTML/CSS/JS, you can open it using:

**Option A – VS Code Live Server (recommended)**
1. Install the "Live Server" VS Code extension
2. Right-click `frontend/index.html` → "Open with Live Server"
3. Runs at: http://127.0.0.1:5500

**Option B – Simple HTTP Server**
```bash
cd cinevault/frontend
npx serve .
# OR
python -m http.server 3000
```

**Option C – Just open index.html directly**
- Double-click `frontend/index.html` in your file explorer
- Note: API calls may need CORS adjustments

---

### Step 3 – Test the App

| Feature | URL |
|---|---|
| Home page | http://127.0.0.1:5500/index.html |
| All movies | http://127.0.0.1:5500/pages/movies.html |
| Login | http://127.0.0.1:5500/pages/login.html |
| Register | http://127.0.0.1:5500/pages/register.html |
| Watchlist | http://127.0.0.1:5500/pages/watchlist.html |

**Admin credentials (after seeding):**
- Email: `admin@cinevault.com`
- Password: `admin123`

---

## 📡 API ENDPOINTS

### Movies
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/movies` | No | Get all movies (search, filter, sort, paginate) |
| GET | `/api/movies/:id` | No | Get single movie |
| GET | `/api/movies/genres/list` | No | Get all genres |
| POST | `/api/movies/:id/rate` | User | Rate a movie |
| POST | `/api/movies` | Admin | Add new movie |
| PUT | `/api/movies/:id` | Admin | Update movie |
| DELETE | `/api/movies/:id` | Admin | Delete movie |

### Users
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Create account |
| POST | `/api/users/login` | Login |
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |

### Watchlist (requires login)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/watchlist` | Get user's watchlist |
| POST | `/api/watchlist` | Add movie to watchlist |
| PUT | `/api/watchlist/:id` | Update status/notes |
| DELETE | `/api/watchlist/:id` | Remove from watchlist |

---

## ⚙️ Query Parameters for GET /api/movies

| Param | Example | Description |
|---|---|---|
| `search` | `?search=inception` | Full-text search |
| `genre` | `?genre=Action,Sci-Fi` | Filter by genre |
| `year` | `?year=2010` | Filter by release year |
| `minRating` | `?minRating=8` | Filter by minimum rating |
| `sortBy` | `?sortBy=rating` | Sort field |
| `order` | `?order=desc` | Sort direction |
| `page` | `?page=2` | Page number |
| `limit` | `?limit=12` | Results per page |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS |
| Styling | Custom CSS + Tailwind CDN + Font Awesome |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Dev Tools | nodemon, dotenv |
