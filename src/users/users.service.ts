import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly  usersRepository: Repository<User>,
    ) {}

    async create(signupInput: SignupInput): Promise<User> {
        try {
            const newUser = this.usersRepository.create(signupInput);

            return await this.usersRepository.save(newUser);
        } catch (error) {
            throw new BadRequestException('algo salio mal', error.message);
        }
    }

    async findAll(): Promise<User[]> {
        return [];
    }

    findOne(id: string): Promise<User> {
        throw new Error('Method not implemented.');
    }

    update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    block(id: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
}
