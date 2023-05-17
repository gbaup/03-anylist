import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class List {
  id: string;

  name: string;
}
