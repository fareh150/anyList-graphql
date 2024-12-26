import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_USERS } from './seed-data';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {
        if (this.isProd) throw new  UnauthorizedException('You are not allowed to seed in production');

        // ! Clean db , delete all data
        await this.deleteDatabase();

        // ! create users
        const user = await this.loadUsers();

        // ! Create items
        return true;
    }

    async deleteDatabase(): Promise<boolean> {
        // borrar items
        await this.itemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar users
        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        return true;
    }

    async loadUsers(): Promise<User> {
        const users = await Promise.all(SEED_USERS.map(user => this.usersService.create(user)));
        return users[0];
    }
}
