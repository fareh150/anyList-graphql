import { ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto';


@Resolver(() => Item)
export class ItemsResolver {
    constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
    async createItem(
        @Args('createItemInput') createItemInput: CreateItemInput,
    ): Promise<Item> {
        return await this.itemsService.create(createItemInput);
    }

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
      return await this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'itemBy' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Item> {
      return await this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ) {
      return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => Int }) id: number) {
      return this.itemsService.remove(id);
  }
}
