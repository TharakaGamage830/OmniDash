---
description: How to deploy OmniDash frontends (Gift Shop and Admin) to Vercel
---

# Deploying OmniDash to Vercel

Since your project is a monorepo (multiple apps in one folder), you need to deploy the **Gift Shop** and the **Admin Portal** as two separate Vercel projects.

### Step 1: Deploy the Gift Shop (`frontend`)

1. Login to [Vercel](https://vercel.com) and click **"Add New"** -> **"Project"**.
2. Connect your GitHub and select the **`OmniDash`** repository.
3. In the "Configure Project" screen:
   - **Project Name**: `omnidash-giftshop` (or your choice).
   - **Framework Preset**: `Vite`.
   - **Root Directory**: Click "Edit" and select the `frontend` folder.
4. **Build & Output Settings**:
   - The default settings (`npm run build` and `dist`) are correct.
5. **Environment Variables**:
   - Add `VITE_API_URL` if you want to override the backend URL (optional, as it's currently hardcoded to Render).
6. Click **Deploy**.

---

### Step 2: Deploy the Admin Portal (`admin-frontend`)

1. Go back to your Vercel Dashboard and click **"Add New"** -> **"Project"**.
2. Select the **same `OmniDash` repository** again.
3. In the "Configure Project" screen:
   - **Project Name**: `omnidash-admin` (or your choice).
   - **Framework Preset**: `Vite`.
   - **Root Directory**: Click "Edit" and select the `admin-frontend` folder.
4. **Build & Output Settings**:
   - The default settings are correct.
5. Click **Deploy**.

---

### Why this works:
- **`vercel.json`**: I've added this file to both folders. It tells Vercel: "If the user refreshes a page like `/products`, just stay on `index.html`." This fixes the common 404 error.
- **Root Directory**: By setting this to `frontend` or `admin-frontend`, Vercel knows exactly which sub-folder to build.
- **`dist` folder**: Vercel will create its own `dist` folder during deployment, so you don't need to push your local `dist` folder anymore (which we cleaned up earlier).

### Troubleshooting
If the build fails:
1. Ensure your backend is running on Render (as the frontends connect to it).
2. Check the Vercel logs for any "Module not found" errors (though our local `npm run build` test passed, so this is unlikely).
