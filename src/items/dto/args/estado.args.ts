import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class EstadoItem {
  @Field(() => String, { nullable: true, defaultValue: 'pendiente' })
  @IsOptional()
  estado?: string;
}
