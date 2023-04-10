import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class EstadoItem {
  @Field(() => String, { nullable: true, defaultValue: 'pendiente' })
  @IsOptional()
  @IsString()
  estado?: string;
}
