import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItemResponse {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  nroreclamo: number;

  @Field(() => String)
  titulo: string;

  @Field(() => String)
  descripcion: string;

  @Field(() => String)
  detalleCompraCSV: string;

  @Field(() => String)
  estado: string;

  @Field(() => String, { nullable: true })
  image?: string;
}
