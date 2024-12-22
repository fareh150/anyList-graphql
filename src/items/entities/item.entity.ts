import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
        id: string;

    @Column()
    @Field(() => String)
        name: string;

    // @Column()
    // @Field(() => Float)
    //     quantity: number;

    @Column({ nullable: true }) // avisa al db
    @Field(() => String, { nullable: true }) // avisa al graphql
        quantityUnit?: string; // avisa en typescript


    @ManyToOne(() => User, user => user.items, { nullable: false })
    @Index('userId-index')
    @Field(() => User)
        user: User;
}
