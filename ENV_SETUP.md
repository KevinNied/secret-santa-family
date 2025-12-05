# Environment Variables Setup

Copy this content to create your `.env.local` file in the root of the project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Resend
RESEND_API_KEY="re_your_api_key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## How to get these values:

### Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Project Settings** → **API**
3. Copy the **URL** and **anon public** key
4. Copy the **service_role** key (keep this secret!)

### Resend
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to **API Keys**
3. Create a new API key
4. Copy it (it will look like `re_xxxxxxxxxxxxx`)

