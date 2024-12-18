import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
    ( roles: ValidRoles[] = [], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const user: User = ctx.getContext().req.user;
        delete user.password;

        if (!user) {
            throw new InternalServerErrorException('No user inside the request - make sure that we are using the AuthGuard');
        }

        if (roles.length === 0) {
            return user;
        }

        for (const role of user.roles) {
            // Todo: eliminate the need to cast the role to ValidRoles
            if (roles.includes(role as ValidRoles)) {
                return user;
            }
        }

        throw new ForbiddenException(`User ${user.fullName} does not have the necessary roles to access this resource, required roles: ${roles}`);
    });