# Microsoft Authentication Setup

This application provides authentication using Microsoft accounts only. Follow these steps to configure the Azure App Registration.

## Setup Instructions

### 1. Create Azure App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the registration form:
   - **Name**: Choose a name for your application (e.g., "My Login App")
   - **Supported account types**:
     - Choose "Accounts in any organizational directory and personal Microsoft accounts" for both work/school and personal accounts
     - Or choose "Accounts in this organizational directory only" for work/school accounts only
   - **Redirect URI**:
     - Platform: Web
     - URI: `http://localhost:3000` (for development)
     - For production, use your actual domain: `https://yourdomain.com`

### 2. Configure the Application

1. After creating the app registration, go to the **Overview** page
2. Copy the **Application (client) ID**
3. Update your `.env.local` file:
   ```
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-copied-client-id-here
   ```

### 3. Configure Authentication Settings (Optional)

1. In your app registration, go to **Authentication**
2. Under **Implicit grant and hybrid flows**, you can enable:
   - Access tokens (if you plan to call APIs)
   - ID tokens (for basic profile information)
3. Under **Advanced settings**:
   - Set **Allow public client flows** to "No" (recommended for web apps)

### 4. API Permissions (Optional)

The app is configured with basic `User.Read` permission by default, which allows reading basic profile information. If you need additional permissions:

1. Go to **API permissions**
2. Click **Add a permission**
3. Choose **Microsoft Graph**
4. Select the permissions you need
5. Click **Grant admin consent** (if you're an admin)

## Environment Variables

Make sure to set up your environment variables in `.env.local`:

```env
NEXT_PUBLIC_AZURE_CLIENT_ID=your-azure-client-id-here
```

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- ✅ Microsoft account authentication only
- ✅ Popup-based login flow
- ✅ User profile display after login
- ✅ Secure logout functionality
- ✅ Support for both personal and work/school Microsoft accounts
- ✅ Responsive design with dark mode support

## Security Notes

- The client ID is safe to expose in frontend code (it's public by design)
- Never commit actual client IDs to version control in production
- For production, make sure to update the redirect URI to your actual domain
- Consider implementing proper error handling for production use

## Troubleshooting

### Common Issues:

1. **"AADB2C90006: The redirect URI is not registered"**
   - Make sure the redirect URI in Azure matches exactly with your application URL
   - Check for trailing slashes or protocol mismatches

2. **Login popup is blocked**
   - Ensure popups are allowed for your domain
   - Some browsers block popups by default

3. **"Invalid client ID"**
   - Verify the client ID is correct in your `.env.local` file
   - Make sure the environment variable name matches exactly

4. **Authentication not working**
   - Check browser console for errors
   - Verify the Azure app registration is properly configured
   - Ensure you're using the correct tenant if using organizational accounts only
