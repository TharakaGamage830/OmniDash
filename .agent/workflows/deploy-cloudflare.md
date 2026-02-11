---
description: How to deploy OmniDash frontends to Cloudflare Pages
---

# Deploying OmniDash to Cloudflare Pages

### Step 1: Deploy the Gift Shop (`frontend`)

1. Login to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **"Workers & Pages"** -> **"Create application"** -> **"Pages"** -> **"Connect to Git"**.
2. Select your `OmniDash` repository.
3. In the "Set up builds and deployments" screen:
   - **Project Name**: `omnidash-giftshop`.
   - **Framework Preset**: `Vite`.
   - **Root Directory**: `frontend`.
   - **Build Command**: `npm run build`.
   - **Build Output Directory**: `dist`.
4. Click **"Save and Deploy"**.

### Step 2: Deploy the Admin Portal (`admin-frontend`)

1. Repeat the steps above but change the following:
   - **Project Name**: `omnidash-admin`.
   - **Root Directory**: `admin-frontend`.
2. Click **"Save and Deploy"**.

### Troubleshooting the "Missing Entrypoint" Error
If you see an error about a "Missing entry-point to Worker script", it usually means you selected **"Workers"** instead of **"Pages"** or tried to run a custom deploy command.
- Make sure you are under the **"Pages"** tab when creating the application.
- Do not add any custom "Deploy Command" in the Cloudflare dashboard; the "Build Command" is enough.

### SPA Routing
I have added a `_redirects` file to both `frontend/public` and `admin-frontend/public`. This ensures that if you refresh the page on a sub-route (like `/products`), Cloudflare will correctly load the app instead of a 404.
