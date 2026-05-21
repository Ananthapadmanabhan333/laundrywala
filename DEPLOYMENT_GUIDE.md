# Deployment Guide - Laundrywala

This guide covers deployment on Vercel, Railway, and Docker.

## Prerequisites

- GitHub account
- Vercel account
- Railway account (optional)
- Docker installed locally (for Docker deployment)
- All environment variables configured

## Option 1: Deploy to Vercel (Recommended for Frontend)

Vercel is the easiest deployment option for Next.js applications.

### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/laundrywala.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub
- Click "New Project"
- Select the repository
- Import the project

3. **Configure Environment Variables**
- In Vercel Dashboard, go to Settings → Environment Variables
- Add all variables from `.env.local`:
  - MONGODB_URI
  - NEXT_PUBLIC_FIREBASE_* variables
  - NEXT_PUBLIC_RAZORPAY_KEY_ID
  - JWT_SECRET
  - All other required variables

4. **Deploy**
- Click "Deploy"
- Wait for the build to complete
- Your app is now live!

### Production URL
```
https://yourdomain.vercel.app
```

## Option 2: Deploy to Railway

Railway is excellent for full-stack deployment with database.

### Steps:

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Railway Project**
```bash
railway init
```

4. **Configure Services**
- MongoDB: Add MongoDB plugin from Railway dashboard
- Node.js: Railway will detect from package.json

5. **Set Environment Variables**
```bash
railway variables set MONGODB_URI=...
railway variables set JWT_SECRET=...
# Set all other variables
```

6. **Deploy**
```bash
railway up
```

Your app will be live at: `https://yourdomain.up.railway.app`

## Option 3: Docker Deployment

### Local Docker Testing

1. **Build Docker Image**
```bash
docker build -t laundrywala:latest .
```

2. **Run Container**
```bash
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e NEXT_PUBLIC_FIREBASE_API_KEY="your_key" \
  laundrywala:latest
```

3. **Access Application**
- Open http://localhost:3000

### Docker Compose (Development)

```bash
# Create .env file with all variables
cp .env.example .env.local

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Deploy to Docker Hub

1. **Create Docker Hub Account**
- Sign up at [hub.docker.com](https://hub.docker.com)

2. **Push Image**
```bash
docker login
docker tag laundrywala:latest yourusername/laundrywala:latest
docker push yourusername/laundrywala:latest
```

## Option 4: AWS Deployment

### Using Elastic Container Service (ECS)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name laundrywala
```

2. **Push Image**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag laundrywala:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/laundrywala:latest

docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/laundrywala:latest
```

3. **Create ECS Task Definition**
- Go to ECS → Task Definitions → Create new task definition
- Configure containers with the ECR image
- Set environment variables

4. **Create ECS Service**
- Go to ECS → Services → Create service
- Select the task definition
- Configure load balancer
- Deploy

## Option 5: Google Cloud Run

1. **Authenticate with Google Cloud**
```bash
gcloud auth login
gcloud config set project PROJECT_ID
```

2. **Build and Push Image**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/laundrywala
```

3. **Deploy to Cloud Run**
```bash
gcloud run deploy laundrywala \
  --image gcr.io/PROJECT_ID/laundrywala \
  --platform managed \
  --region us-central1 \
  --set-env-vars MONGODB_URI="your_uri",JWT_SECRET="your_secret"
```

## Monitoring & Maintenance

### Vercel
- Monitor in Vercel Dashboard
- Check Functions usage
- Review analytics

### Railway
- Check metrics in Railway Dashboard
- Monitor logs
- Scale resources as needed

### Docker Environments
- Use monitoring tools (Prometheus, Grafana)
- Set up log aggregation (ELK Stack)
- Configure auto-scaling policies

## SSL/HTTPS Certificate

### Vercel
- Automatically provides SSL certificate
- Renews automatically

### Railway
- Provides automatic SSL
- Custom domain support

### Self-hosted
```bash
# Using Let's Encrypt
certbot certonly --standalone -d yourdomain.com
```

## Database Backup

### MongoDB Atlas
1. Go to Atlas Dashboard
2. Click "Backup" → "Automated Backup"
3. Configure backup frequency
4. Enable point-in-time recovery

### Manual Backup
```bash
mongodump --uri "mongodb+srv://user:pass@cluster/database"
```

## Performance Optimization

1. **Enable Caching**
- Set appropriate cache headers
- Use CDN for static assets (Vercel CDN included)

2. **Database Optimization**
- Create indexes
- Monitor slow queries
- Use connection pooling

3. **API Optimization**
- Implement rate limiting
- Use pagination
- Compress responses

## Troubleshooting

### Build Fails
```bash
# Check build logs
# Verify Node.js version
node --version

# Clear cache and rebuild
npm clean-cache
npm run build
```

### Connection Errors
- Verify MongoDB URI
- Check network access
- Ensure firewall rules allow connection

### Performance Issues
- Monitor database queries
- Check API response times
- Review server logs
- Optimize queries and add indexes

## Security Checklist

- [ ] All environment variables set
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] SSL certificate valid
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Regular backups scheduled
- [ ] Monitoring alerts set up

## Scaling

### Horizontal Scaling
- Add load balancer (Railway/AWS ALB)
- Deploy multiple instances
- Use auto-scaling policies

### Vertical Scaling
- Increase server resources
- Upgrade database tier
- Optimize code and queries

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Docker Docs: https://docs.docker.com
- Next.js Docs: https://nextjs.org/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

For questions or issues, open an issue on GitHub or contact support@laundrywala.com
