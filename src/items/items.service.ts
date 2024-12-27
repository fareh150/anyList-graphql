import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
    ) {}

    async create(
        createItemInput: CreateItemInput,
        currentUser: User,
    ): Promise<Item> {
        const newItem = this.itemsRepository.create({ ...createItemInput, user: currentUser });
        // newItem.user = currentUser;  --- forma correcta arriba
        return await this.itemsRepository.save(newItem);
    }

    async findAll(
        user: User,
        paginationArgs: PaginationArgs,
        searchArgs: SearchArgs,
    ): Promise<Item[]> {
        const { offset, limit } = paginationArgs;
        const { search } = searchArgs;

        const queryBuilder = this.itemsRepository.createQueryBuilder()
            .take(limit)
            .skip(offset)
            .where('"userId" = :userId', { userId: user.id });

        if (search) {
            queryBuilder.andWhere('LOWER(name) LIKE :name', { name: `%${search.toLowerCase()}%` });
        }

        return await queryBuilder.getMany();
    }

    async findOne(id: string, user: User): Promise<Item> {
        const item = await this.itemsRepository.findOneBy({
            id,
            user: {
                id: user.id,
            },
        });
        // if (item.user.id !== user.id) {
        //     throw new BadRequestException(`Item with id #${id} not found`);
        // }

        if (!item) {
            throw new NotFoundException(`Item with id #${id} not found`);
        }

        return item;
    }

    async update(
        id: string,
        updateItemInput: UpdateItemInput,
        user: User,
    ): Promise<Item> {
        await this.findOne(id, user);
        // ? const item = await this.itemsRepository.preload( { ...updateItemInput, user} );
        const item = await this.itemsRepository.preload( updateItemInput );

        if (!item) {
            throw new NotFoundException(`Item with id #${id} not found`);
        }

        return await this.itemsRepository.save(item);
    }

    async remove(
        id: string,
        user: User,
    ): Promise<Item> {
        // Todo: soft delete
        const item = await this.findOne(id,user);
        await this.itemsRepository.delete(item.id);

        return item;
    }

    async itemCountByUser(user: User): Promise<number> {
        return await this.itemsRepository.count({
            where: {
                user: {
                    id: user.id,
                },
            },
        });
    }
}
