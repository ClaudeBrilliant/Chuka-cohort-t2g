// src/auth/config/permissions.config.ts
import { UserRole } from 'generated/prisma';
import { Permission } from '../auth/enums/permissions.enum';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [...Object.values(Permission)],

  [UserRole.MANAGER]: [
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.READ_ALL_USERS,
    Permission.CHANGE_USER_PASSWORD,
    Permission.CREATE_ROOM,
    Permission.READ_ROOM,
    Permission.UPDATE_ROOM,
    Permission.DELETE_ROOM,
    Permission.READ_ALL_ROOMS,
    Permission.MANAGE_ROOM_AVAILABILITY,
    Permission.CLEAN_ROOM,
    Permission.CREATE_ROOM_TYPE,
    Permission.READ_ROOM_TYPE,
    Permission.UPDATE_ROOM_TYPE,
    Permission.DELETE_ROOM_TYPE,
    Permission.READ_ALL_ROOM_TYPES,
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.DELETE_BOOKING,
    Permission.READ_ALL_BOOKINGS,
    Permission.CONFIRM_BOOKING,
    Permission.CANCEL_BOOKING,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.VIEW_ANALYTICS,
  ],

  [UserRole.STAFF]: [
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.READ_ROOM,
    Permission.UPDATE_ROOM,
    Permission.READ_ALL_ROOMS,
    Permission.MANAGE_ROOM_AVAILABILITY,
    Permission.CLEAN_ROOM,
    Permission.READ_ROOM_TYPE,
    Permission.READ_ALL_ROOM_TYPES,
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.READ_ALL_BOOKINGS,
    Permission.CONFIRM_BOOKING,
    Permission.CANCEL_BOOKING,
    Permission.VIEW_REPORTS,
  ],

  [UserRole.GUEST]: [
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.READ_ROOM,
    Permission.READ_ROOM_TYPE,
    Permission.READ_ALL_ROOM_TYPES,
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.CANCEL_BOOKING,
  ],
};

export const ROLE_HIERARCHY = {
  [UserRole.ADMIN]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.STAFF]: 2,
  [UserRole.GUEST]: 1,
};
