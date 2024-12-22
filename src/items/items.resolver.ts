import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Resolver(() => Item)
@UseGuards(JwtAuthGuard) // to get the auth user
export class ItemsResolver {
    constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
    async createItem(
        @Args('createItemInput') createItemInput: CreateItemInput,
        @CurrentUser() user: User,
    ): Promise<Item> {
        return await this.itemsService.create(createItemInput, user);
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
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
      return await this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Item> {
      return this.itemsService.remove(id);
  }
}
