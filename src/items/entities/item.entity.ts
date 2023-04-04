import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CsvData } from './csv.entity';

@Entity({ name: 'reclamos' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => Int)
  nroreclamo: number;

  @Column()
  @Field(() => String)
  titulo: string;

  @Column()
  @Field(() => String)
  descripcion: string;

  @Column({ nullable: true })
  @Field(() => String)
  detalleCompraCSV: string;

  @Field(() => Boolean)
  @Column({ default: true })
  pendiente: boolean;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, eager: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;

  @OneToOne(() => CsvData, (csv) => csv.items, {
    eager: true,
  })
  csv: CsvData;
}
