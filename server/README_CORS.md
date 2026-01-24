# CORS Configuration for Production

## Environment Variables Required in Vercel

Make sure to set the following environment variable in your Vercel project settings:

```
CORS_ORIGIN_PROD=https://admin.fishplanetlondon.co.uk
```

Or if you need multiple origins (comma-separated):

```
CORS_ORIGIN_PROD=https://admin.fishplanetlondon.co.uk,https://another-domain.com
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the variable:
   - **Name**: `CORS_ORIGIN_PROD`
   - **Value**: `https://admin.fishplanetlondon.co.uk`
   - **Environment**: Production (and Preview if needed)
4. Redeploy your application

## Current CORS Configuration

The server is configured to:
- Allow requests from `https://admin.fishplanetlondon.co.uk` (or the value in `CORS_ORIGIN_PROD`)
- Support credentials (cookies, authorization headers)
- Handle preflight OPTIONS requests
- Allow methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Allow headers: Content-Type, Authorization, X-Requested-With, Accept

## Troubleshooting

If you still see CORS errors:

1. **Check environment variables**: Ensure `CORS_ORIGIN_PROD` is set in Vercel
2. **Check logs**: The server logs which origins are allowed and which requests are being made
3. **Verify origin**: Make sure the frontend is making requests from exactly `https://admin.fishplanetlondon.co.uk` (no trailing slash, correct protocol)
4. **Clear browser cache**: Sometimes browsers cache CORS responses
5. **Check Vercel headers**: The `vercel.json` file also sets CORS headers at the platform level

## Testing CORS

You can test CORS with curl:

```bash
curl -X OPTIONS https://crm-three-green.vercel.app/login \
  -H "Origin: https://admin.fishplanetlondon.co.uk" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

You should see `Access-Control-Allow-Origin: https://admin.fishplanetlondon.co.uk` in the response headers.
