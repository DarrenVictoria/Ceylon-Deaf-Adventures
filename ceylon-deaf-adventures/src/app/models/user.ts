/**
 * User roles in the system
 */
export type UserRole = 'admin' | 'manager';

/**
 * Permission keys for different system modules
 */
export type PermissionKey = 'tours' | 'blogs' | 'bookings' | 'users';

/**
 * User permissions interface
 */
export interface UserPermissions {
  tours: boolean;
  blogs: boolean;
  bookings: boolean;
  users: boolean; // Only admins can manage users
}

/**
 * User model for admin authentication
 */
export interface User {
  id?: string;
  uid: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  role: UserRole;
  isActive: boolean;
  permissions: UserPermissions;
  
  // Timestamps
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  lastLoginAt?: any; // Firestore Timestamp
  
  // User management info
  createdBy?: string; // UID of admin who created this user
  
  // Optional profile info
  profilePicture?: string;
  phone?: string;
  department?: string;
  notes?: string; // Admin notes about this user
}

/**
 * Create default permissions for admin users
 */
export function createAdminPermissions(): UserPermissions {
  return {
    tours: true,
    blogs: true,
    bookings: true,
    users: true // Admins can manage everything including users
  };
}

/**
 * Create default permissions for manager users
 */
export function createManagerPermissions(): UserPermissions {
  return {
    tours: false,
    blogs: false,
    bookings: false,
    users: false // Managers get no permissions by default - admin sets them
  };
}

/**
 * Create permissions based on role
 */
export function createDefaultPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'admin':
      return createAdminPermissions();
    case 'manager':
      return createManagerPermissions();
    default:
      return createManagerPermissions();
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: User | null, permission: PermissionKey): boolean {
  if (!user || !user.isActive) return false;
  
  // Admin role has all permissions
  if (user.role === 'admin') {
    return true;
  }
  
  // For managers, check specific permissions
  return user.permissions[permission] ?? false;
}

/**
 * Check if user is admin (full access)
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.isActive) return false;
  return user.role === 'admin';
}

/**
 * Check if user is manager (limited access based on permissions)
 */
export function isManager(user: User | null): boolean {
  if (!user || !user.isActive) return false;
  return user.role === 'manager';
}

/**
 * Check if user is authorized to access admin area (admin or manager)
 */
export function isAuthorizedUser(user: User | null): boolean {
  if (!user || !user.isActive) return false;
  return user.role === 'admin' || user.role === 'manager';
}

/**
 * Check if user can manage other users (only admins)
 */
export function canManageUsers(user: User | null): boolean {
  return isAdmin(user);
}

/**
 * Get user's display name or fallback to email
 */
export function getUserDisplayName(user: User): string {
  return user.displayName || user.email;
}

/**
 * Get user's role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Manager';
    default:
      return 'Unknown';
  }
}

// Keep for backward compatibility
export function isAdminUser(user: User | null): boolean {
  return isAuthorizedUser(user);
}
