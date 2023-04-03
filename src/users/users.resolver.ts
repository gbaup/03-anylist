import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {
    name: 'allUsers',
    description: 'Exclusivo para admin. Trae todos los usuarios registrados.',
  })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User[]> {
    console.log({ user });
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, {
    name: 'userById',
    description: 'Exclusivo para admin. Busca usuario por su id',
  })
  findOneId(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Query(() => User, {
    name: 'userByEmail',
    description: 'Exclusivo para admin. Busca usuario por email.',
  })
  findOneEmail(
    @Args('email', { type: () => String }) email: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Mutation(() => User, {
    name: 'blockUser',
    description: 'Exclusivo para admin. Marca como "inactivo" un usuario',
  })
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id);
  }
}
