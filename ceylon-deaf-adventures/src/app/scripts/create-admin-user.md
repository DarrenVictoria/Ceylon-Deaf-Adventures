# Ceylon Deaf Adventures - User Management System

The system now supports a comprehensive role-based access control with two main roles:

- **Admin**: Full system access including user management
- **Manager**: Limited access based on assigned permissions

## User Roles and Permissions

### Admin Role
- **Full Access**: Can access all features including user management
- **User Management**: Can create, edit, and delete manager accounts
- **Permission Control**: Can assign/revoke permissions for managers
- **All Modules**: Automatic access to tours, blogs, bookings, and users

### Manager Role
- **Limited Access**: Only to assigned modules
- **Granular Permissions**: Admin controls which modules they can access:
  - Tours Management
  - Blogs Management 
  - Bookings Management
- **No User Management**: Cannot create or manage other users

## 1. Create Admin Account (Manual Setup)

### Firebase Authentication:
1. Go to Firebase Console
2. Navigate to Authentication > Users
3. Click "Add user"
4. Create user with:
   - Email: `admin@ceylondeafadventures.com`
   - Password: `admin123` (or your preferred secure password)

### Firestore Document:
After creating the Firebase Auth user, add a document to the `users` collection:

```json
{
  "uid": "[FIREBASE_AUTH_UID_FROM_STEP_ABOVE]",
  "email": "admin@ceylondeafadventures.com",
  "displayName": "System Administrator",
  "role": "admin",
  "isActive": true,
  "permissions": {
    "tours": true,
    "blogs": true,
    "bookings": true,
    "users": true
  },
  "createdAt": "[FIRESTORE_TIMESTAMP]",
  "department": "Administration",
  "notes": "Primary system administrator"
}
```

## 2. Create Manager Accounts (Through Admin Interface)

Once you have an admin account:

1. Login as admin at `/admin/login`
2. Navigate to "Manage Users" tab
3. Click "Add New Manager"
4. Fill in the form with manager details
5. Select specific permissions for each manager

### Sample Manager Configurations:

**Tours Manager:**
- Permissions: Tours Management only
- Department: Operations
- Use case: Manages tour packages and itineraries

**Content Manager:**  
- Permissions: Blogs Management only
- Department: Marketing
- Use case: Creates and publishes blog content

**Bookings Manager:**
- Permissions: Bookings Management only  
- Department: Customer Service
- Use case: Handles customer inquiries and bookings

**Operations Manager:**
- Permissions: Tours + Bookings Management
- Department: Operations
- Use case: Manages both tour content and customer bookings

## 3. Testing the System

### Admin User Testing:
1. Navigate to `/admin` → should redirect to `/admin/login`
2. Login with admin credentials
3. Verify all 4 tabs are visible: Tours, Blogs, Bookings, Users
4. Test user management functions:
   - Create new managers
   - Edit existing users 
   - Modify permissions
   - Activate/deactivate users

### Manager User Testing:
1. Create a manager with limited permissions (e.g., only Tours)
2. Logout from admin account
3. Login with manager credentials
4. Verify only permitted tabs are accessible
5. Try accessing restricted areas - should be blocked

### Permission Validation:
- Manager with Tours permission → can access `/admin/tours`
- Manager without Tours permission → cannot access `/admin/tours`
- Only admins can access `/admin/users`

## 4. Key Features

### Granular Permission Control
- Admins can enable/disable individual modules for each manager
- Permissions are checked both in UI (hiding navigation) and backend (API access)
- Real-time permission updates without requiring re-login

### User Management Interface
- Professional table view showing all users
- Status indicators (Active/Inactive, permissions, last login)
- Quick actions menu for each user
- Bulk permission management

### Security Features
- Role-based authentication with Firebase Auth
- Permission validation at multiple levels
- Admins cannot delete their own account
- Automatic logout for unauthorized access attempts

## 5. Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - readable by authenticated users, writable by admins
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Other collections with permission-based access
    match /tours/{tourId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.tours == true);
    }
    
    match /blogs/{blogId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.blogs == true);
    }
    
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.bookings == true);
    }
  }
}
```

## 6. Next Steps

1. **Create your first admin account** using the manual setup above
2. **Login and test** the admin interface
3. **Create manager accounts** through the UI
4. **Test permission combinations** to ensure security
5. **Update Firestore security rules** for production use

The system is now ready for production with comprehensive role-based access control!
