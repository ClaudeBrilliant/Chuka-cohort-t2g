export enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  READ_ALL_USERS = 'read_all_users',
  CHANGE_USER_PASSWORD = 'change_user_password',

  // Room Management
  CREATE_ROOM = 'create_room',
  READ_ROOM = 'read_room',
  UPDATE_ROOM = 'update_room',
  DELETE_ROOM = 'delete_room',
  READ_ALL_ROOMS = 'read_all_rooms',
  MANAGE_ROOM_AVAILABILITY = 'manage_room_availability',
  CLEAN_ROOM = 'clean_room',

  // Room Type Management
  CREATE_ROOM_TYPE = 'create_room_type',
  READ_ROOM_TYPE = 'read_room_type',
  UPDATE_ROOM_TYPE = 'update_room_type',
  DELETE_ROOM_TYPE = 'delete_room_type',
  READ_ALL_ROOM_TYPES = 'read_all_room_types',

  // Booking Management
  CREATE_BOOKING = 'create_booking',
  READ_BOOKING = 'read_booking',
  UPDATE_BOOKING = 'update_booking',
  DELETE_BOOKING = 'delete_booking',
  READ_ALL_BOOKINGS = 'read_all_bookings',
  CONFIRM_BOOKING = 'confirm_booking',
  CANCEL_BOOKING = 'cancel_booking',

  // Reports and Analytics
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
  VIEW_ANALYTICS = 'view_analytics',

  // System Administration
  MANAGE_SYSTEM = 'manage_system',
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  MANAGE_PERMISSIONS = 'manage_permissions',
}
