import { Injectable } from '@nestjs/common';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
    ) {}

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);
        //Todo crear token
        const token = 'ABC12345667';


        return { token, user };
    }

}
