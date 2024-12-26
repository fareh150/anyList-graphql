import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
    constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, { name: 'executeSeed', description: 'Execution of a seed' })
    async executeSeed(): Promise<boolean> {
        return this.seedService.executeSeed();
    }
}
