import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {
        if (this.isProd) throw new  UnauthorizedException('You are not allowed to seed in production');

        // ! Clean db , delete all data
        await this.deleteDatabase();

        // ! create users

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
}
