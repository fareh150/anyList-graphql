import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginInput, SignupInput } from './dto';

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

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);

        if (bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const token = 'ABC12345667';


        return { token, user };
    }
}