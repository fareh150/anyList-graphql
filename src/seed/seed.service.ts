import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './seed-data';
import { ItemsService } from 'src/items';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
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
        await this.loadItems(user);
        return true;
    }

    async deleteDatabase(): Promise<boolean> {
        // listItems
        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // lists
        await this.listRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

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
        const users = await Promise.all(
            SEED_USERS.map(
                user => this.usersService.create(user),
            ),
        );
        return users[0];
    }

    async loadItems(
        user: User,
    ): Promise<boolean> {
        await Promise.all(
            SEED_ITEMS.map(
                item => this.itemsService.create(item, user),
            ),
        );

        return true;
    }
}
