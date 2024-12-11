import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
        id: string;

    @Column()
    @Field(() => String)
        name: string;

    @Column()
    @Field(() => Float)
        quantity: number;

    @Column({ nullable: true }) // avisa al db
    @Field(() => String, { nullable: true }) // avisa al graphql
        quantityUnits?: string; // avisa en typescript
}
