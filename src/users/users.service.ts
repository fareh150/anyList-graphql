import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    private logger: Logger = new Logger('UsersService');

    constructor(
        @InjectRepository(User)
        private readonly  usersRepository: Repository<User>,
    ) {}

    async create(signupInput: SignupInput): Promise<User> {
        try {
            const newUser = this.usersRepository.create({
                ...signupInput,
                password: bcrypt.hashSync(signupInput.password, 10),
            });

            return await this.usersRepository.save(newUser);
        } catch (error) {
            this.handleDbError(error);
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


    private handleDbError(error: any): never {
        this.logger.error( error );
        if (error.code === '23505') {
            throw new BadRequestException(error.detail.replace('Key', ''));
        }
        throw new InternalServerErrorException('Database error, check the logs');
    }
}
