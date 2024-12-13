import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SignupInput } from './dto';

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
}
