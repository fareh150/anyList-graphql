import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // ? async configuration of GraphQL to secure the playground
        GraphQLModule.forRootAsync({
            driver    : ApolloDriver,
            imports   : [AuthModule],
            inject    : [JwtService],
            useFactory: async (jwtService: JwtService) => ({
                playground    : false,
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                plugins       : [
                    ApolloServerPluginLandingPageLocalDefault(),
                ],
                context({ req }) {
                    // to block graphql playground if u dont have a token
                    // const token = req.headers.authorization?.replace('Bearer ', '');
                    // if (!token) throw new Error('No token provided');

                    // const payload = jwtService.decode(token);
                    // if (!payload) throw new Error('Invalid token');


                },
            }),
        }),
        // ? Basic configuration of GraphQL
        // GraphQLModule.forRoot<ApolloDriverConfig>({
        //     driver        : ApolloDriver,
        //     playground    : false,
        //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        //     plugins       : [
        //         ApolloServerPluginLandingPageLocalDefault(),
        //     ],
        // }),
        TypeOrmModule.forRoot({
            type            : 'postgres',
            host            : process.env.DB_HOST,
            port            : +process.env.DB_PORT,
            username        : process.env.DB_USERNAME,
            password        : process.env.DB_PASSWORD,
            database        : process.env.DB_NAME,
            synchronize     : true, // DO NOT USE IN PRODUCTION
            autoLoadEntities: true,
        }),
        ItemsModule,
        UsersModule,
        AuthModule,
        SeedModule,
        CommonModule,
    ],
    controllers: [],
    providers  : [],
})
export class AppModule {}
