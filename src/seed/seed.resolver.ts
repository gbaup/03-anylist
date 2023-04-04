import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}
  @Mutation(() => Boolean, {
    name: 'seed',
    description: 'Ejecuta la construcción de la base de datos.',
  })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
}
