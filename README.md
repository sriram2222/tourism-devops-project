🌿 Pollachi & Palani Tourism

A full-stack tourism web application for Pollachi & Palani, Tamil Nadu — deployed on AWS with static IP, S3 image storage, and infrastructure managed via Terraform.

Live: http://35.154.144.183/

🛠 Tech Stack
LayerTechnologyFrontendNext.js 15 (TypeScript + Tailwind CSS)BackendPython Flask REST APIDatabaseMySQL 8.0Image StorageAWS S3HostingAWS EC2 (Ubuntu 22.04)Static IPAWS Elastic IP — 35.154.144.183InfrastructureTerraform (IaC)Process ManagerPM2 (Node) + Gunicorn (Flask)Reverse ProxyNginx

🏗 Architecture
User Browser
     │
     ▼
[ Elastic IP: 35.154.144.183 ]
     │
     ▼
[ Nginx — Reverse Proxy ]
  ├── /         → Next.js (port 3000)
  └── /api/*    → Flask via Gunicorn (port 5000)
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
         MySQL 8.0             AWS S3 Bucket
      (tourism_db)         (place + gallery images)

📁 Project Structure
tourism-app/
├── frontend/                   ← Next.js 15 (TypeScript + Tailwind)
│   ├── src/
│   │   ├── app/                ← Pages (Next.js App Router)
│   │   │   ├── page.tsx            ← Homepage
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   ├── pollachi/
│   │   │   ├── palani/
│   │   │   ├── gallery/
│   │   │   ├── place/[slug]/
│   │   │   └── admin/
│   │   │       ├── login/
│   │   │       └── dashboard/
│   │   ├── components/
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
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local
│
├── backend/                    ← Python Flask REST API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── models.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── places.py
│   │       ├── gallery.py
│   │       └── upload.py       ← Uploads to AWS S3
│   ├── run.py
│   ├── requirements.txt
│   └── .env
│
├── terraform/                  ← Infrastructure as Code
│   ├── main.tf                 ← EC2, S3, Security Groups, Elastic IP
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars
│
├── nginx/
│   └── tourism.conf            ← Nginx reverse proxy config
│
└── README.md

☁️ AWS Infrastructure (Terraform)
Infrastructure is fully managed via Terraform.
Resources Provisioned

EC2 Instance — t2.micro (Ubuntu 22.04 LTS) in ap-south-1 (Mumbai)
Elastic IP — Static public IP 35.154.144.183 attached to the EC2 instance
S3 Bucket — Private bucket for all uploaded images (place images + gallery)
Security Group — Ports 22 (SSH), 80 (HTTP), 443 (HTTPS) open
IAM Role — EC2 instance profile with S3 read/write access

Deploy Infrastructure
bashcd terraform

# Initialize Terraform
terraform init

# Preview what will be created
terraform plan

# Provision all AWS resources
terraform apply

# To destroy everything
terraform destroy
terraform/main.tf (overview)
hclprovider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "tourism_server" {
  ami           = "ami-0f58b397bc5c1f2e8"   # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  key_name      = var.key_name
  ...
}

resource "aws_eip" "tourism_eip" {
  instance = aws_instance.tourism_server.id
  domain   = "vpc"
  # Elastic IP: 35.154.144.183
}

resource "aws_s3_bucket" "tourism_images" {
  bucket = "pollachi-palani-tourism-images"
}

📸 Image Storage — AWS S3
All images (place photos and gallery uploads) are stored in an AWS S3 bucket, not on the server disk.
TypeStorageHero / banner imagess3://pollachi-palani-tourism-images/hero/Place imagess3://pollachi-palani-tourism-images/places/Gallery imagess3://pollachi-palani-tourism-images/gallery/
Images are served via S3 public URLs or optionally through CloudFront CDN.
Upload Flow (Admin Panel)

Admin selects image in Dashboard
Flask backend receives the file
File is uploaded directly to S3 using boto3
S3 URL is saved to MySQL
Frontend loads images directly from S3


🚀 Deployment on EC2
One-time Server Setup (after terraform apply)
bash# SSH into the EC2 instance
ssh -i your-key.pem ubuntu@35.154.144.183

# Install dependencies
sudo apt update && sudo apt install -y nginx mysql-server python3-pip nodejs npm

# Install PM2 globally
sudo npm install -g pm2

# Clone the repository
git clone https://github.com/YOUR_USERNAME/tourism-app.git
cd tourism-app
Backend Setup (Flask + Gunicorn)
bashcd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env   # Fill in DB credentials, AWS keys, S3 bucket name

# Seed database
python run.py --seed

# Start with Gunicorn (production)
gunicorn -w 4 -b 127.0.0.1:5000 "app:create_app()"
Frontend Setup (Next.js + PM2)
bashcd frontend
npm install
cp .env.local.example .env.local
nano .env.local   # Set NEXT_PUBLIC_API_URL=http://35.154.144.183/api

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "tourism-frontend" -- start
pm2 save
pm2 startup
Nginx Config
nginx# /etc/nginx/sites-available/tourism
server {
    listen 80;
    server_name 35.154.144.183;

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
bashsudo ln -s /etc/nginx/sites-available/tourism /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

⚙️ Configuration
Frontend — frontend/.env.local
envNEXT_PUBLIC_API_URL=http://35.154.144.183/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=        # Optional
Backend — backend/.env
envDB_HOST=localhost
DB_PORT=3306
DB_NAME=tourism_db
DB_USER=root
DB_PASSWORD=your_password

SECRET_KEY=change-this-in-production
JWT_SECRET_KEY=change-this-in-production

FRONTEND_URL=http://35.154.144.183

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=pollachi-palani-tourism-images

🌐 All Pages
URLDescription/Homepage — hero slider, stats, region cards, featured places, gallery/pollachiPollachi page — places, facts, map/palaniPalani page — temple info, places, map/galleryFull photo gallery with filters + lightbox/place/[slug]Individual place detail with image slider/admin/loginAdmin login (restricted)/admin/dashboardFull CRUD panel — places & gallery

🔒 Admin Panel
URLhttp://35.154.144.183/admin/loginAccessProject owner onlyFeaturesAdd / Edit / Delete places, Upload gallery images to S3AuthJWT token-based authentication

🛡️ API Reference
MethodEndpointAuthDescriptionGET/api/health—Health checkPOST/api/auth/login—Admin login → JWTGET/api/auth/me✅Current admin infoGET/api/places/—All places (filter by region, category, featured)GET/api/places/{slug}—Single place detailPOST/api/places/✅Create placePUT/api/places/{id}✅Update placeDELETE/api/places/{id}✅Delete placeGET/api/gallery/—Gallery imagesPOST/api/gallery/✅Upload image to S3DELETE/api/gallery/{id}✅Delete image from S3POST/api/upload/image✅Upload place image to S3DELETE/api/upload/image/{id}✅Delete place image from S3

🐛 Troubleshooting
EC2 instance not reachable?
bash# Check security group allows port 80
# Verify Nginx is running
sudo systemctl status nginx
Frontend not starting?
bashpm2 logs tourism-frontend
pm2 restart tourism-frontend
S3 upload failing?
bash# Confirm IAM role has S3 permissions
# Check AWS credentials in backend/.env
aws s3 ls s3://pollachi-palani-tourism-images/
MySQL connection error?
bashsudo systemctl status mysql
mysql -u root -p -e "SHOW DATABASES;"
Redeploy after code changes?
bashcd tourism-app && git pull
cd frontend && npm run build && pm2 restart tourism-frontend
cd ../backend && source venv/bin/activate && pm2 restart tourism-backend

📌 Live Details
ItemValueLive URLhttp://35.154.144.183/Elastic IP35.154.144.183AWS Regionap-south-1 (Mumbai)EC2 Typet2.microS3 Bucketpollachi-palani-tourism-images

Built with ❤️ — Pollachi & Palani Tourism · Tamil Nadu 🌿
