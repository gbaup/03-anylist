import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  offset?: number;
  @Field(() => Int, { nullable: true, defaultValue: 5 })
  @IsOptional()
  @Min(1)
  limit?: number;
}
