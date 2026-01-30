# Firebase Storage Setup Guide

## 🔥 Current Issue: Storage Upload Failing

You're experiencing Firebase Storage upload errors because the security rules need to be configured. This guide will walk you through fixing this.

## 📋 Prerequisites

- Firebase project: `ceylondeafadventures-25`
- Storage bucket: `ceylondeafadventures-25.firebasestorage.app`
- Admin access to Firebase Console

---

## ✅ Step 1: Configure Firebase Storage Security Rules

### Navigate to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ceylondeafadventures-25**
3. Click on **Storage** in the left sidebar
4. Click on the **Rules** tab

### Update Storage Rules

Replace the existing rules with the following:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read tour images (public access)
    match /tours/{imageId} {
      allow read: if true;

      // Allow authenticated users to write
      allow write: if request.auth != null;

      // Validate uploaded files
      allow create: if request.auth != null
                    && request.resource.size < 10 * 1024 * 1024 // Max 10MB
                    && request.resource.contentType.matches('image/.*'); // Images only
    }

    // Connection test path (for debugging)
    match /connection-test/{testId} {
      allow read, write: if request.auth != null || true; // Allow for testing
    }

    // Default deny all other paths
    match /{allPaths=**} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

### Alternative: Temporary Open Rules (FOR TESTING ONLY)

⚠️ **WARNING:** Only use this temporarily to test if the issue is with security rules.
**DO NOT use in production!**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

---

## ✅ Step 2: Verify Storage Bucket Exists

### Check Storage Bucket

1. In Firebase Console → **Storage**
2. Ensure you see: `gs://ceylondeafadventures-25.firebasestorage.app`
3. If the bucket doesn't exist:
   - Click "Get Started"
   - Choose a location (preferably close to your users)
   - Click "Done"

---

## ✅ Step 3: Configure Firestore Security Rules

While we're at it, let's ensure Firestore is also properly configured:

### Navigate to Firestore Rules

1. Firebase Console → **Firestore Database**
2. Click on **Rules** tab

### Update Firestore Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Tours collection - public read, authenticated write
    match /tours/{tourId} {
      // Anyone can read published tours
      allow read: if true;

      // Only authenticated users can create/update/delete
      allow create, update, delete: if request.auth != null;
    }

    // Bookings collection - authenticated access only
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    // Emergency requests - authenticated access
    match /emergency-requests/{requestId} {
      allow read, write: if request.auth != null;
    }

    // Connection test (for debugging)
    match /connection-test/{testId} {
      allow read, write: if true;
    }

    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ✅ Step 4: Enable Firebase Authentication (If Not Already Enabled)

### Check Authentication Status

1. Firebase Console → **Authentication**
2. If not enabled, click "Get Started"

### Enable Email/Password Authentication

1. Click on **Sign-in method** tab
2. Click on **Email/Password**
3. Enable it
4. Save

### Create Admin User (If Needed)

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter email and password
4. Click "Add user"

---

## ✅ Step 5: Test the Configuration

### Using the Admin Panel

1. Log into your application
2. Navigate to `/admin/tours/new`
3. Click the **"Test Firebase"** button
4. Check the console for test results

### Expected Output

You should see:
```
✅ Firebase Storage is configured correctly and working!
```

---

## 🔧 Troubleshooting

### Error: "storage/unauthorized"

**Solution:** Update Storage security rules (Step 1)

### Error: "storage/bucket-not-found"

**Solutions:**
1. Verify the storage bucket exists (Step 2)
2. Check `environment.ts` has correct `storageBucket` value
3. Ensure billing is enabled on your Firebase project

### Error: "storage/unknown"

**Possible causes:**
1. CORS issues - Firebase Storage needs CORS configuration
2. Network connectivity issues
3. Invalid Firebase configuration

**Solution for CORS:**
Create a file named `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

Then run:
```bash
gsutil cors set cors.json gs://ceylondeafadventures-25.firebasestorage.app
```

### Error: "storage/quota-exceeded"

**Solution:** Upgrade your Firebase plan or clean up old files

---

## 📊 Verifying Everything Works

### Test Upload Flow

1. Navigate to `/admin/tours/new`
2. Fill in the form
3. Select an image file (< 10MB)
4. Click "Create Tour"
5. Check console for upload progress
6. Verify tour appears in `/admin/tours`

### Check Storage in Firebase Console

1. Go to Firebase Console → **Storage**
2. You should see uploaded images under `tours/` folder
3. Click on an image to view details and get download URL

---

## 🔐 Production Security Best Practices

### For Production, use these rules:

#### Storage Rules (Production)

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Tour images
    match /tours/{imageId} {
      // Public read access
      allow read: if true;

      // Only admins can upload (add admin check via custom claims)
      allow create, update: if request.auth != null
                            && request.auth.token.admin == true
                            && request.resource.size < 10 * 1024 * 1024
                            && request.resource.contentType.matches('image/.*');

      // Only admins can delete
      allow delete: if request.auth != null
                    && request.auth.token.admin == true;
    }
  }
}
```

#### Firestore Rules (Production)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Tours - public read, admin write
    match /tours/{tourId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Bookings - users can read their own, admins can read all
    match /bookings/{bookingId} {
      allow read: if request.auth != null
                  && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // Emergency requests - authenticated users
    match /emergency-requests/{requestId} {
      allow create: if request.auth != null;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

---

## 📝 Notes

- The current setup allows **any authenticated user** to upload images
- For production, you should implement **admin role checks** using Firebase Custom Claims
- Always validate file types and sizes on both client and server side
- Monitor your Storage usage in Firebase Console to avoid quota issues
- Set up billing alerts to prevent unexpected charges

---

## 🆘 Still Having Issues?

1. Check browser console for detailed error messages
2. Check Firebase Console → **Storage** → **Usage** tab
3. Verify billing is enabled (required for production use)
4. Check network tab in browser dev tools to see the actual request/response
5. Try the temporary open rules to isolate if it's a permissions issue

---

## 📞 Support

If you continue to have issues, gather this information:
- Error message from browser console
- Error code (e.g., storage/unauthorized)
- Firebase project ID
- Storage bucket name
- Screenshots of Firebase Console settings

---

*Last Updated: 2025-11-20*
