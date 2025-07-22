# API Keys Setup Guide

This guide will help you collect all the necessary API keys and environment variables for Aid Rocket.

## 1. Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: aidrocket
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

### Get Supabase Keys
Once your project is created:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Settings** → **Database**
4. Copy **Connection string** → `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your database password

## 2. Clerk Authentication

### Create Clerk Application
1. Go to [clerk.com](https://clerk.com)
2. Sign up/Login
3. Click "Add application"
4. Enter application name: "Aid Rocket"
5. Choose sign-in methods:
   - ✅ Email
   - ✅ Google (recommended)
   - ✅ GitHub (optional)
6. Click "Create application"

### Get Clerk Keys
1. In your Clerk dashboard, go to **API Keys**
2. Copy these values:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

## 3. OpenAI API

### Create OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/Login
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Name it "Aid Rocket"
6. Copy the key → `OPENAI_API_KEY`

**Important**: Add billing information and set usage limits to avoid unexpected charges.

## 4. Vercel Blob Storage

### Setup Vercel Blob
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Create new project or use existing
4. Go to project **Settings** → **Storage**
5. Click "Create Database" → **Blob**
6. Name it "aidrocket-storage"
7. Click "Create"

### Get Blob Token
1. In Storage settings, click your blob store
2. Copy **BLOB_READ_WRITE_TOKEN** value

## 5. Resend Email

### Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email
4. Go to **API Keys**
5. Click "Create API Key"
6. Name it "Aid Rocket"
7. Copy the key → `RESEND_API_KEY`

### Domain Setup (Optional for MVP)
For production, you'll want to add your custom domain:
1. Go to **Domains**
2. Add your domain
3. Follow DNS verification steps

## 6. Environment Variables File

Create a `.env.local` file in your project root with these values:

```env
# Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Resend
RESEND_API_KEY="re_..."
```

## 7. Deployment Environment Variables

When deploying to Vercel:
1. Go to your project settings
2. Click **Environment Variables**
3. Add all the above variables
4. Make sure to set them for **Production**, **Preview**, and **Development**

## Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use strong, unique passwords
- ✅ Regularly rotate API keys
- ✅ Set usage limits on OpenAI
- ✅ Monitor API usage regularly

## Costs Estimate

- **Supabase**: Free tier (500MB database, 50MB file storage)
- **Clerk**: Free tier (10,000 MAU)
- **OpenAI**: ~$0.01-0.03 per analysis (GPT-4o)
- **Vercel**: Free tier (100GB bandwidth)
- **Resend**: Free tier (3,000 emails/month)

**Total estimated monthly cost for MVP**: $10-30 depending on usage.