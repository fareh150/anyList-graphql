import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
      id: string;

  @Column()
  @Field(() => String)
      fullName: string;

  @Column({ unique: true })
  @Field(() => String)
      email: string;

  @Column()
  // @Field(() => String)  para que no se muestre en el schema
      password: string;

  @Column({
      type   : 'text',
      array  : true,
      default: ['user'],
  })
  @Field(() => [String])
      roles: string[];

  @Column({
      type   : 'boolean',
      default: true,
  })
  @Field(() => Boolean)
      isActive: boolean;

  // Todo: relationships

    @ManyToOne(() => User, user => user.lastUpdatedBy, { nullable: true, lazy: true })
    @JoinColumn({ name: 'lastUpdatedBy' })
    @Field(() => User, { nullable: true })
        lastUpdatedBy?: User;

    @OneToMany(() => Item, item => item.user, { lazy: true })
    // @Field(() => [Item], { nullable: true })
        items?: Item[];

    @OneToMany(() => List, list => list.user)
    // @Field(() => [List], { nullable: true })
        lists?: List[];
}
