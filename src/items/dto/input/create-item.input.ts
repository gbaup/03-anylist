import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsDateCustom } from 'src/items/validator/date.validator';

@InputType()
export class CreateItemInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Field(() => String)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  @Field(() => String)
  description: string;
  @Field(() => String)
  @IsNotEmpty()
  @IsDateCustom()
  date: string;
  @Field(() => Int)
  @IsNotEmpty()
  nrofactura: number;
  @Field(() => Int)
  @IsNotEmpty()
  nroproducto: number;
}
