import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SignUpInput } from 'src/auth/dto/inputs/signup.input';

import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private logger = new Logger('UsersService');

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.usersRepository.find();
    const query = this.usersRepository.createQueryBuilder();
    return query
      .where('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `email "${email}" not found`,
      });
    }
  }
  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with id: "${id}" not found`,
      });
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userBlocked = await this.findOneById(id);
    userBlocked.isActive = false;
    userBlocked.lastUpdateBy = adminUser;

    await this.usersRepository.save(userBlocked);
    return userBlocked;
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail);
    }
    if (error.code === '23505') {
      throw new BadRequestException(
        error.detail
          .replace('Key ', '')
          .replace('(email)=(gaston@gmaill.com)', 'User with this mail'),
      );
    }
    throw new InternalServerErrorException('Please check server logs');
  }
}
