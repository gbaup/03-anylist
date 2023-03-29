import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsString()
  fullName: string;
  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;
  @Field(() => String)
  @IsString()
  password: string;
}
