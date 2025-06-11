// src/auth/services/permission.service.ts
import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { Permission } from '../enums/permissions.enum';
import { Resource } from '../enums/resources.enum';
import { Action } from '../enums/actions.enum';
import {
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
} from '../../config/permissions.config';

@Injectable()
export class PermissionService {
  hasPermission(role: UserRole, permission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
  }

  canPerformAction(
    role: UserRole,
    action: Action,
    resource: Resource,
  ): boolean {
    const permission = this.getPermissionForAction(action, resource);
    return permission ? this.hasPermission(role, permission) : false;
  }

  getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  canAccessOwnResource(
    role: UserRole,
    action: Action,
    resource: Resource,
    ownerId: number,
    requesterId: number,
  ): boolean {
    if (([UserRole.ADMIN, UserRole.MANAGER] as UserRole[]).includes(role)) {
      return this.canPerformAction(role, action, resource);
    }

    if (ownerId === requesterId) {
      return this.canPerformAction(role, action, resource);
    }

    if (
      role === UserRole.STAFF &&
      resource === Resource.USER &&
      action === Action.READ
    ) {
      return true;
    }

    return false;
  }

  checkHierarchicalPermission(role: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];
  }

  private getPermissionForAction(
    action: Action,
    resource: Resource,
  ): Permission | null {
    const permissionKey =
      `${action.toUpperCase()}_${resource.toUpperCase()}` as keyof typeof Permission;
    return Permission[permissionKey] || null;
  }

  hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some((permission) =>
      this.hasPermission(role, permission),
    );
  }

  hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every((permission) =>
      this.hasPermission(role, permission),
    );
  }
}
