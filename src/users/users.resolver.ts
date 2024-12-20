import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/roles.arg';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
    async findAll(
      @Args() validRoles:ValidRolesArgs,
      @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    ): Promise<User[]> {
        return await this.usersService.findAll(validRoles.roles);
    }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User> {
      throw new Error('Method not implemented.');
      // return this.usersService.findOne(id);
  }

  //@Mutation(() => User)
  //updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //    return this.usersService.update(updateUserInput.id, updateUserInput);
  //}

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User> {
      return this.usersService.block(id);
  }
}
