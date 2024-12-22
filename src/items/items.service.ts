import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

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

    async findAll(user: User): Promise<Item[]> {
        // Todo: filtrar, paginar, por usuario, por fecha, etc
        return await this.itemsRepository.find({
            where: {
                user,
            },
        });
    }

    async findOne(id: string, user: User): Promise<Item> {
        const item = await this.itemsRepository.findOneBy({
            id,
            user: {
                id: user.id,
            },
            // Mi forma para .findOne
            // where    : { id },
            // relations: ['user'],
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
