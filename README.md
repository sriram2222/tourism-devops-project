# 🌿 Pollachi & Palani Tourism Website

Full-stack tourism website — Next.js 15 + Flask + MySQL

---

## 📁 Project Structure

```
tourism-app/
├── frontend/                   ← Next.js 15 (TypeScript + Tailwind)
│   ├── src/
│   │   ├── app/                ← Pages (Next.js App Router)
│   │   │   ├── page.tsx            ← Homepage
│   │   │   ├── layout.tsx          ← Root layout
│   │   │   ├── globals.css         ← Global styles
│   │   │   ├── pollachi/           ← Pollachi destination page
│   │   │   ├── palani/             ← Palani destination page
│   │   │   ├── gallery/            ← Photo gallery page
│   │   │   ├── place/[slug]/       ← Place detail page (dynamic)
│   │   │   └── admin/
│   │   │       ├── login/          ← Admin login
│   │   │       └── dashboard/      ← Full CRUD admin panel
│   │   ├── components/         ← All React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── PlaceCard.tsx
│   │   │   ├── RegionCards.tsx
│   │   │   ├── FeaturedPlaces.tsx
│   │   │   ├── GalleryPreview.tsx
│   │   │   ├── SearchSection.tsx
│   │   │   ├── WhyVisit.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   ├── MapEmbed.tsx
│   │   │   └── NearbyPlaces.tsx
│   │   ├── lib/
│   │   │   ├── api.ts          ← Axios API client
│   │   │   └── utils.ts        ← Helper functions
│   │   └── types/
│   │       └── index.ts        ← TypeScript interfaces
│   ├── public/images/          ← ⬅ PUT YOUR PHOTOS HERE
│   │   ├── hero/               ← slide1.jpg, slide2.jpg, slide3.jpg, slide4.jpg
│   │   ├── pollachi/           ← pollachi-banner.jpg
│   │   └── palani/             ← palani-banner.jpg
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local
│
├── backend/                    ← Python Flask REST API
│   ├── app/
│   │   ├── __init__.py         ← App factory + CORS + JWT
│   │   ├── config.py           ← All configuration
│   │   ├── models.py           ← SQLAlchemy models
│   │   └── routes/
│   │       ├── auth.py         ← Login, JWT, change password
│   │       ├── places.py       ← CRUD for places
│   │       ├── gallery.py      ← Gallery management
│   │       └── upload.py       ← Image upload/delete
│   ├── uploads/                ← Uploaded images (auto-created)
│   ├── run.py                  ← Entry point + DB seed
│   ├── requirements.txt
│   └── .env
│
├── mysql/
│   └── init.sql                ← Database creation script
├── start-backend.sh            ← One-command backend start
├── start-frontend.sh           ← One-command frontend start
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- WSL2 Ubuntu (or any Linux)
- Node.js 18+ (install via NVM)
- Python 3.10+
- MySQL 8.0

### Step 1 — Install & Start MySQL

```bash
sudo apt update && sudo apt install mysql-server -y
sudo service mysql start

# Set root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
EXIT;

# Create database
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS tourism_db;"
```

### Step 2 — Start the Backend

```bash
bash start-backend.sh
```

This will:
- Create Python virtual environment
- Install all pip packages
- Auto-create all database tables
- Seed 9 places (Pollachi + Palani) + admin user
- Start Flask on **http://localhost:5000**

Test: http://localhost:5000/api/health

### Step 3 — Start the Frontend (new terminal)

```bash
bash start-frontend.sh
```

This will:
- Install Node.js packages (first time: 2–3 mins)
- Start Next.js on **http://localhost:3000**

---

## 📸 Adding Your Images

### Banner / Hero Images (for the website design)

Place photos in `frontend/public/images/`:

```
frontend/public/images/
├── hero/
│   ├── slide1.jpg        ← Homepage hero — any Pollachi landscape
│   ├── slide2.jpg        ← Waterfall / Monkey Falls
│   ├── slide3.jpg        ← Palani temple
│   └── slide4.jpg        ← Valparai / hill station
├── pollachi/
│   └── pollachi-banner.jpg   ← Large card on homepage
└── palani/
    └── palani-banner.jpg     ← Large card on homepage
```

Recommended size: **1920×1080px JPG** for hero, **1400×800px** for banners

The site uses a beautiful color gradient as fallback if images are not present.

### Place Images (via Admin Panel)

1. Go to http://localhost:3000/admin/login
2. Login: `admin` / `Admin@123`
3. Click "All Places" → "Edit" on any place
4. Upload an image using the upload box
5. The image appears instantly on the site

### Gallery Images

1. In Admin Panel, click "Gallery"
2. Choose a file, add title and tag
3. Click "Upload Image"

---

## 🔐 Admin Panel Features

| Feature | Description |
|---------|-------------|
| Dashboard | Stats overview + quick actions |
| All Places | Table with Edit/Delete buttons |
| Add Place | Form with image upload |
| Edit Place | Pre-filled form, update any field |
| Gallery Manager | Upload/delete gallery images |
| Dark Mode | Toggle in navbar |

URL: http://localhost:3000/admin/login
Credentials: **admin** / **Admin@123**

⚠️ **Change the password after first login!** (Change Password in admin settings)

---

## 🌐 All Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage with hero slider, stats, region cards, featured places, gallery |
| `/pollachi` | Pollachi page — facts, places grid, map, nearby |
| `/palani` | Palani page — temple info, places grid, map, nearby |
| `/gallery` | Full photo gallery with filters + lightbox |
| `/place/[slug]` | Individual place detail with image slider |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Full CRUD management panel |

---

## 🔧 Configuration

### Frontend `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=    # Optional: add for interactive maps
```

### Backend `backend/.env`
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tourism_db
DB_USER=root
DB_PASSWORD=root

SECRET_KEY=change-this-in-production
JWT_SECRET_KEY=change-this-in-production

FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/auth/me` | ✅ | Get current admin |
| GET | `/api/places/` | — | All places (supports `?region=pollachi`, `?featured=true`, `?category=nature`) |
| GET | `/api/places/{slug}` | — | Single place |
| POST | `/api/places/` | ✅ | Create place |
| PUT | `/api/places/{id}` | ✅ | Update place |
| DELETE | `/api/places/{id}` | ✅ | Delete place |
| GET | `/api/gallery/` | — | Gallery images |
| POST | `/api/gallery/` | ✅ | Upload gallery image |
| DELETE | `/api/gallery/{id}` | ✅ | Delete gallery image |
| POST | `/api/upload/image` | ✅ | Upload place image |
| DELETE | `/api/upload/image/{id}` | ✅ | Delete place image |

---

## 🐛 Troubleshooting

**MySQL won't connect:**
```bash
sudo service mysql start
mysql -u root -proot -e "SHOW DATABASES;"
```

**Port already in use:**
```bash
# Kill port 3000
npx kill-port 3000

# Kill port 5000  
kill $(lsof -t -i:5000)
```

**Images not showing:**
- For hero/banner images: make sure they are in `frontend/public/images/` with exact filenames
- For place images: upload via Admin Panel (stored in `backend/uploads/`)

**CORS errors:**
- Ensure backend is running on port 5000
- Ensure `FRONTEND_URL=http://localhost:3000` in `backend/.env`

---

## 🚀 Next Steps (Future Improvements)

- [ ] Docker + docker-compose setup
- [ ] CI/CD with GitHub Actions
- [ ] AWS deployment (EC2 + RDS + S3 + CloudFront)
- [ ] Nginx reverse proxy config
- [ ] SSL with Let's Encrypt
- [ ] SEO optimization + sitemap.xml
- [ ] Multi-image upload per place
- [ ] Image compression/resize on upload
- [ ] User reviews and ratings
- [ ] Contact form with email

---

*Built with ❤️ — Pollachi & Palani Tourism · Tamil Nadu*
