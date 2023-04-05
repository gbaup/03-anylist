import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException('SEED is not executable on Prod');

    await this.deleteDatabase();

    const users = await this.loadUser();

    const user1 = users[1];
    const user2 = users[3];

    await this.loadItem(user1, user2);

    return true;
  }
  async deleteDatabase() {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUser(): Promise<User[]> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users;
  }
  ////////////
  async loadItem(user: User, user2: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      if (item.par % 2 === 0) {
        itemsPromises.push(await this.itemsService.create(item, user));
      } else {
        itemsPromises.push(await this.itemsService.create(item, user2));
      }
    }
    await Promise.all(itemsPromises);
    return itemsPromises[0];
  }
}
