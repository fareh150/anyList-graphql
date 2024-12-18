import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
    ( roles = [], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        delete user.password;

        if (!user) {
            throw new InternalServerErrorException('No user inside the request - make sure that we are using the AuthGuard');
        }

        return user;
    });