import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/input';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return await this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'allItems' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => Item || [Item], { name: 'item' })
  findOne(@Args('nroreclamo', { type: () => Int }) nroreclamo: number) {
    return this.itemsService.findOne(nroreclamo);
  }

  @Query(() => [Item], { name: 'items' })
  findMany(@Args('term', { type: () => String }) term: string) {
    return this.itemsService.findMany(term);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @Args('nroreclamo', { type: () => Int }) nroreclamo: number,
  ): Promise<Item> {
    return this.itemsService.update(nroreclamo, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('nroreclamo', { type: () => Int }) nroreclamo: number) {
    return this.itemsService.remove(nroreclamo);
  }
}
