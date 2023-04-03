import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/input';
import { ItemResponse } from './interfaces/item-response.interface';
import { EstadoItem } from './dto/args/estado.args';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'crearReclamo' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<Item> {
    return await this.itemsService.create(createItemInput, user);
  }

  @Query(() => [ItemResponse], {
    name: 'allReclamos',
    description:
      'Permite traer los reclamos asociados al usuario loggeado. En caso de ser admin, devuelve todos los reclamos.',
  })
  findAll(
    @Args() estadoItem: EstadoItem,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<ItemResponse[]> {
    return this.itemsService.findAll(estadoItem, user);
  }

  @Query(() => Item || [Item], {
    name: 'oneReclamo',
    description:
      'Busca reclamos por "nroreclamo" asociados a ese usuario. En caso de ser admin, busca entre todos los reclamos.',
  })
  findOne(
    @Args('nroreclamo', { type: () => Int }) nroreclamo: number,
    @CurrentUser([ValidRoles.user]) user: User,
  ) {
    return this.itemsService.findOne(nroreclamo, user);
  }

  @Query(() => [ItemResponse], {
    name: 'manyReclamos',
    description:
      'Exclusivo para admin. Busca entre todos los reclamos por palabra que contenga el titulo.',
  })
  findMany(
    @Args('term', { type: () => String }) term: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.itemsService.findMany(term);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @Args('nroreclamo', { type: () => Int }) nroreclamo: number,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<Item> {
    return this.itemsService.update(nroreclamo, updateItemInput, user);
  }

  @Mutation(() => String, {
    name: 'removeReclamo',
    description:
      'Exclusivo para admin. Permite marcar un reclamo como "resuelto" ingresando el nroreclamo',
  })
  removeItem(
    @Args('nroreclamo', { type: () => Int }) nroreclamo: number,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.itemsService.virtualRemove(nroreclamo, user);
  }
}
