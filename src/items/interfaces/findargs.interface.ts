import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { EstadoItem } from '../dto/args/estado.args';

export interface FindArgs {
  estadoItem: EstadoItem;
  paginationArgs: PaginationArgs;
}
