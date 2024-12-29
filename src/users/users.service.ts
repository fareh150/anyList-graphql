import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

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

    async findAll(
        roles: ValidRoles[],
        paginationArgs: PaginationArgs,
        searchArgs: SearchArgs,
    ): Promise<User[]> {
        const { offset, limit } = paginationArgs;
        const { search } = searchArgs;

        const queryBuilder = this.usersRepository.createQueryBuilder('user');

        if (roles.length > 0) {
            queryBuilder
                .andWhere('ARRAY [roles] &&  ARRAY[:...roles]')
                .setParameter('roles', roles);
        }

        if (search) {
            queryBuilder.andWhere('LOWER(email) LIKE LOWER(:search) OR LOWER("fullName") LIKE LOWER(:search)', { search: `%${search.toLowerCase()}%` });
        }

        queryBuilder.skip(offset).take(limit);

        return queryBuilder.getMany();
    }


    async findOneByEmail(email: string): Promise<User> {
        try {
            return await this.usersRepository.findOneByOrFail({ email });
        } catch (error) {
            throw new NotFoundException(`${email} not found`);
            // this.handleDbError({
            //     code  : 'error-001',
            //     detail: `${email} not found`,
            // });
        }
    }

    async findOneById(id: string): Promise<User> {
        try {
            return await this.usersRepository.findOne({
                where    : { id },
                relations: ['lastUpdatedBy'],
            });
        } catch (error) {
            throw new NotFoundException(`${id} not found`);
        }
    }

    async update(
        id: string,
        updateUserInput: UpdateUserInput,
        updatedBy: User,
    ): Promise<User> {
        try {
            const user = await this.usersRepository.preload({
                id,
                ...updateUserInput,
            });
            user.lastUpdatedBy = updatedBy;

            return await this.usersRepository.save(user);
        } catch (error) {
            this.handleDbError(error);
        }
    }

    async block(id: string, adminUser: User): Promise<User> {
        const userToBlock = await this.findOneById(id);
        userToBlock.isActive = false;
        userToBlock.lastUpdatedBy = adminUser;
        return await this.usersRepository.save(userToBlock);
    }


    private handleDbError(error: any): never {
        if (error.code === '23505') {
            throw new BadRequestException(error.detail.replace('Key', ''));
        }

        // if (error.code === 'error-001') {
        //     throw new BadRequestException(error.detail.replace('Key', ''));
        // }
        this.logger.error( error );
        throw new InternalServerErrorException('Database error, check the logs');
    }
}
