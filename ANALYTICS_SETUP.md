# Google Analytics Setup Guide

This project includes comprehensive Google Analytics 4 (GA4) tracking.

## Setup Instructions

### 1. Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Go to **Admin** → **Data Streams**
4. Click on your web stream
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add to your `.env.local` file:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Deploy Configuration

For production (e.g., Vercel):
1. Go to your project settings
2. Add environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
3. Set the value to your Measurement ID
4. Redeploy

## What's Being Tracked

### Automatic Tracking
- ✅ **Page Views**: Every page navigation
- ✅ **User Sessions**: Automatic session tracking
- ✅ **Traffic Sources**: Where users come from
- ✅ **Device Info**: Desktop, mobile, tablet
- ✅ **Geographic Data**: Country, city

### E-commerce Events
- ✅ **Product Views**: When users view product details
- ✅ **Add to Cart**: When products are added to cart
- ✅ **Remove from Cart**: When products are removed
- ✅ **Purchase**: Completed transactions (when implemented)

### Custom Events
- ✅ **Search**: Search queries and result counts
- ✅ **Share**: Product sharing via social media
- ✅ **Custom Actions**: Button clicks, form submissions

## Usage Examples

### Track Custom Events

```typescript
import { trackEvent } from '@/lib/analytics';

// Track a button click
trackEvent('click', 'Button', 'CTA Button', 1);

// Track form submission
trackEvent('submit', 'Form', 'Contact Form');
```

### Track E-commerce

```typescript
import { trackProductView, trackAddToCart } from '@/lib/analytics';

// Track product view
trackProductView({
    id: 'product-123',
    name: 'Blue Lippan Art',
    category: 'Lippan Art',
    price: 359
});

// Track add to cart
trackAddToCart({
    id: 'product-123',
    name: 'Blue Lippan Art',
    category: 'Lippan Art',
    price: 359,
    quantity: 1
});
```

## Viewing Analytics Data

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. View reports:
   - **Realtime**: See current visitors
   - **Acquisition**: Traffic sources
   - **Engagement**: Page views, events
   - **Monetization**: E-commerce data

## Privacy & GDPR Compliance

- Analytics only tracks when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- No tracking in development (unless env var is set)
- Consider adding a cookie consent banner for GDPR compliance
- Users can opt-out via browser settings

## Troubleshooting

### Analytics Not Working?

1. **Check Environment Variable**
   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. **Verify in Browser Console**
   - Open DevTools → Network tab
   - Filter by "google-analytics" or "gtag"
   - Should see requests to `www.google-analytics.com`

3. **Check Realtime Reports**
   - Visit your site
   - Open GA4 → Realtime
   - Should see your session

### Common Issues

- **No data showing**: Wait 24-48 hours for initial data
- **Wrong Measurement ID**: Double-check the format `G-XXXXXXXXXX`
- **Ad blockers**: May block analytics (expected behavior)

## Best Practices

1. **Test in Production**: Analytics works best in production environment
2. **Monitor Regularly**: Check reports weekly
3. **Set Up Goals**: Define conversion goals in GA4
4. **Create Audiences**: Segment users for better insights
5. **Link Google Ads**: If running ads, link accounts

## Support

For issues or questions:
- [Google Analytics Help](https://support.google.com/analytics)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
