import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SignupInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse, { name: 'signup' })
    signup(
      @Args('signupInput') signupInput: SignupInput,
    ): Promise<AuthResponse> {
        return this.authService.signup(signupInput);
    }

    @Mutation(() => AuthResponse, { name: 'login' })
    async login(
      @Args('loginInput') loginInput: LoginInput,
    ): Promise<AuthResponse> {
        return this.authService.login(loginInput);
    }

    @Query(() => AuthResponse, { name: 'revalidate' })
    @UseGuards(JwtAuthGuard)
    revalidateToken(
    @CurrentUser() user: User,
    ): AuthResponse {
        //return this.authService.revalidateToken(token);
        console.log('revalidateToken  user: ',user);

        throw new Error('Not implemented');
    }
}
