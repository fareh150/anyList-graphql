import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    // Todo: relationships and more fields
}
