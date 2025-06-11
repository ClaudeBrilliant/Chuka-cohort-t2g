import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { JwtAuthGuard } from '../guards/jwt/jwt.guard';
import { PermissionGuard } from '../guards/permission/permission.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { Permission } from '../enums/permissions.enum';
import {
  CurrentUser,
  CurrentUserData,
} from '../decorators/current-user.decorator';
import { UserRole } from 'generated/prisma';
import { Action } from '../enums/actions.enum';
import { Resource } from '../enums/resources.enum';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('my-permissions')
  getMyPermissions(@CurrentUser() user: CurrentUserData) {
    const permissions = this.permissionService.getRolePermissions(
      user.role as UserRole,
    );
    return {
      role: user.role,
      permissions,
      permissionCount: permissions.length,
    };
  }

  @Get('role/:role')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  getRolePermissions(@Param('role') role: UserRole) {
    const permissions = this.permissionService.getRolePermissions(role);
    return {
      role,
      permissions,
      permissionCount: permissions.length,
    };
  }

  @Get('check/:permission')
  checkPermission(
    @Param('permission') permission: Permission,
    @CurrentUser() user: CurrentUserData,
  ) {
    const hasPermission = this.permissionService.hasPermission(
      user.role as UserRole,
      permission,
    );
    return {
      permission,
      hasPermission,
      role: user.role,
    };
  }

  @Get('check-action')
  checkAction(
    @Query('action') action: Action,
    @Query('resource') resource: Resource,
    @CurrentUser() user: CurrentUserData,
  ) {
    const canPerform = this.permissionService.canPerformAction(
      user.role as UserRole,
      action,
      resource,
    );
    return {
      action,
      resource,
      canPerform,
      role: user.role,
    };
  }

  @Get('all-permissions')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.MANAGE_PERMISSIONS)
  getAllPermissions() {
    return {
      permissions: Object.values(Permission),
      resources: Object.values(Resource),
      actions: Object.values(Action),
    };
  }
}
