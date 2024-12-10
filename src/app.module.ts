import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver        : ApolloDriver,
            playground    : false,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            plugins       : [
                ApolloServerPluginLandingPageLocalDefault(),
            ],
        }),
        ItemsModule,
    ],
    controllers: [],
    providers  : [],
})
export class AppModule {}
