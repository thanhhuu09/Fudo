import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * A decorator that assigns roles to a route handler or controller.
 *
 * This decorator uses the `SetMetadata` function to attach the specified roles
 * to the metadata of the target. The roles can then be used by guards or other
 * mechanisms to enforce access control.
 *
 * @param roles - A list of roles to be assigned.
 * @returns A decorator function that sets the roles metadata.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
