import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items';

@Module({
    providers: [SeedResolver, SeedService],
    imports  : [
        ConfigModule,
        UsersModule,
        ItemsModule,
    ],
})
export class SeedModule {}
