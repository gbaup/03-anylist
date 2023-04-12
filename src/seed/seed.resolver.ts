import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}
  @Mutation(() => Boolean, {
    name: 'seed',
    description:
      'Ejecuta la construcción de la base de datos. Opcionalmente, se pueden cargar items adicionales asignando "true" a la variable "loadAdditionalItems". ',
  })
  async executeSeed(
    @Args('loadAdditionalItems', { type: () => Boolean, defaultValue: false })
    loadAdditionalItems: boolean,
  ): Promise<boolean> {
    return this.seedService.executeSeed(loadAdditionalItems);
  }
}
