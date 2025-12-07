# Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. Clerk account with API keys
3. Backend API running and accessible

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

### Step 1: Prepare Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Ensure all environment variables are documented

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Set Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL`

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Performance Optimizations

### Already Implemented

- ✅ Code splitting with Next.js App Router
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ Optimized bundle size
- ✅ Efficient re-renders

### Additional Recommendations

1. **Enable Vercel Analytics**: Monitor performance in production
2. **CDN Caching**: Configure caching headers for static assets
3. **Database Connection Pooling**: Optimize API calls
4. **Rate Limiting**: Implement on API endpoints

## Accessibility Checklist

- ✅ Semantic HTML elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader compatibility
- ✅ Color contrast ratios

## SEO Setup

- ✅ Metadata configuration in `app/layout.tsx`
- ✅ Open Graph tags
- ✅ Structured data ready
- ✅ Sitemap generation (can be added)

## Troubleshooting

### Build Errors

1. Check Node.js version (requires 18+)
2. Verify all dependencies are installed
3. Check TypeScript errors: `npm run build`

### Authentication Issues

1. Verify Clerk keys are correct
2. Check middleware configuration
3. Ensure public routes are configured

### API Connection Issues

1. Verify `NEXT_PUBLIC_API_URL` is set
2. Check CORS settings on backend
3. Verify API is accessible from frontend domain

## Monitoring

### Recommended Tools

- Vercel Analytics
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics (optional)

## Security Checklist

- ✅ Environment variables not exposed
- ✅ Authentication middleware configured
- ✅ Protected routes enforced
- ✅ API keys secured
- ✅ HTTPS enforced (Vercel default)

## Support

For issues or questions, check:
- Next.js Documentation: https://nextjs.org/docs
- Clerk Documentation: https://clerk.com/docs
- ShadCN UI: https://ui.shadcn.com

