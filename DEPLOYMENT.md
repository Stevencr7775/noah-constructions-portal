# Noah Constructions Portal - Deployment Guide

This guide details the steps required to deploy the Noah Constructions Portal to a production environment (such as Vercel, AWS, or a VPS).

## 1. Prerequisites
- Node.js 18.17 or later
- A production SQL database (PostgreSQL is recommended for production over SQLite). 
- AWS S3 or a similar object storage provider for media/image uploads.

## 2. Environment Variables
Create a `.env` file in the root of your project or configure these variables in your hosting provider's dashboard:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@host:5432/noah_db"

# The public URL of the deployed application (used for SEO, Sitemap, and QR Codes)
NEXT_PUBLIC_SITE_URL="https://noahconstructions.com"

# Secret key for encrypting sessions/cookies (Must be at least 32 characters)
SESSION_SECRET="your-super-secure-random-string-at-least-32-chars"
```

## 3. Database Migration
If moving to PostgreSQL for production, you must update the `provider` in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"`.

Then, run the following commands to migrate your database:
```bash
npx prisma generate
npx prisma db push --accept-data-loss 
# OR use migrations if maintaining state: npx prisma migrate deploy
```

## 4. Building for Production
Next.js will statically optimize pages during the build process.

```bash
npm install
npm run build
```

Verify that there are no TypeScript or ESLint errors during the build. The build output will show which routes are static (○) and which are dynamic (ƒ).

## 5. Starting the Server
If you are deploying on a VPS (like EC2 or DigitalOcean):
```bash
npm run start
```
For process management, it is recommended to use **PM2**:
```bash
npm install -g pm2
pm2 start npm --name "noah-portal" -- run start
```

## 6. Hosting Providers
### Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variables.
4. Vercel will automatically detect Next.js and deploy the application.

### AWS / VPS
- Set up a reverse proxy (Nginx or Apache) pointing to the port where Next.js is running (default `3000`).
- Ensure SSL (HTTPS) is configured for security, as many features (like Secure Cookies) require HTTPS.

## 7. Post-Deployment Checklist
- [ ] Create the Super Admin account via the database or seed script.
- [ ] Navigate to `/admin/system` and verify the Database Status is "Online".
- [ ] Verify that the `sitemap.xml` and `robots.txt` are accessible.
- [ ] Test the Contact Forms to ensure lead data is writing to the database correctly.
- [ ] Verify Image Optimization is working (images are being served in WebP/AVIF format).
