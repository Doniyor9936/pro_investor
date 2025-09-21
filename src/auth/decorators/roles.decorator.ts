import { SetMetadata } from "@nestjs/common";

// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);