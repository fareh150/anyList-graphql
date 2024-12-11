import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
    ) {}

    async create(createItemInput: CreateItemInput): Promise<Item> {
        const newItem = this.itemsRepository.create(createItemInput);
        return await this.itemsRepository.save(newItem);
    }

    async findAll(): Promise<Item[]> {
        // Todo: filtrar, paginar, por usuario, por fecha, etc
        return await this.itemsRepository.find();
    }

    async findOne(id: string): Promise<Item> {
        const item = await this.itemsRepository.findOneBy({ id });

        if (!item) {
            throw new NotFoundException(`Item with id #${id} not found`);
        }

        return item;
    }

    async update(
        id: string,
        updateItemInput: UpdateItemInput,
    ): Promise<Item> {
        const item = await this.itemsRepository.preload( updateItemInput );

        if (!item) {
            throw new NotFoundException(`Item with id #${id} not found`);
        }

        return await this.itemsRepository.save(item);
    }

    async remove(id: string): Promise<Item> {
        // Todo: soft delete
        const item = await this.findOne(id);
        await this.itemsRepository.delete(item.id);

        return item;
    }
}
