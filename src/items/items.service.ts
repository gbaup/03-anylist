import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { EstadoItem } from './dto/args/estado.args';
import { CreateItemInput, UpdateItemInput } from './dto/input';
import { CsvData } from './entities/csv.entity';
import { Item } from './entities/item.entity';
import { ItemResponse } from './interfaces/item-response.interface';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(CsvData)
    private readonly csvRepository: Repository<CsvData>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const reclamo = new Item();
    const csvData = new CsvData();

    csvData.date = createItemInput.date;
    csvData.nrofactura = createItemInput.nrofactura;
    csvData.nroproducto = createItemInput.nroproducto;
    await this.csvRepository.save(csvData);

    reclamo.titulo = createItemInput.titulo.toLowerCase();
    reclamo.descripcion = createItemInput.descripcion.toLowerCase();
    reclamo.detalleCompraCSV = `${createItemInput.date}, ${createItemInput.nrofactura}, ${createItemInput.nroproducto}`;
    reclamo.nroreclamo = (await this.itemsRepository.maximum('nroreclamo')) + 1;
    reclamo.csv = csvData;
    reclamo.user = user;

    await this.itemsRepository.save(reclamo);

    return reclamo;
  }
  async getAllItems() {
    const allItems = await this.itemsRepository.find();
    const allItemsNew = allItems.map((item) => ({
      id: item.id,
      nroreclamo: item.nroreclamo,
      titulo: item.titulo,
      descripcion: item.descripcion,
      detalleCompraCSV: item.detalleCompraCSV,
      estado: item.pendiente ? 'pendiente' : 'resuelto',
      userId: item.user.id,
    }));

    return { allItemsNew };
  }
  async findAll(estadoItem: EstadoItem, user: User): Promise<ItemResponse[]> {
    const { estado } = estadoItem;
    const { allItemsNew } = await this.getAllItems();

    if (estado === 'todos') {
      if (user.roles.includes(ValidRoles.admin)) {
        return allItemsNew;
      }
      return allItemsNew.filter((item) => item.userId === user.id);
    }
    const response = allItemsNew.filter(
      (item) => item.estado === estado.toLowerCase().trim(),
    );
    if (response.length === 0)
      throw new NotFoundException(
        `No se encontraron reclamos. Revisar parámetro de búsqueda (todos o resuelto)`,
      );
    if (user.roles.includes(ValidRoles.admin)) {
      return response;
    }
    return response.filter((item) => item.userId === user.id);
  }

  async findOne(nroreclamo: number, user: User) {
    let reclamo = await this.itemsRepository.findOne({
      where: {
        nroreclamo: nroreclamo,
        user: {
          id: user.id,
        },
      },
    });
    if (user.roles.includes(ValidRoles.admin)) {
      reclamo = await this.itemsRepository.findOneBy({ nroreclamo });
    }
    if (!reclamo)
      throw new NotFoundException(
        `No se encontró el reclamo Nro.${nroreclamo}`,
      );
    return reclamo;
  }

  async findMany(term: string): Promise<ItemResponse[]> {
    const termLower = term.toLowerCase().trim();
    const { allItemsNew } = await this.getAllItems();
    if (termLower === '') {
      return allItemsNew.filter((item) => item.estado === 'pendiente');
    }
    const reclamos = await this.itemsRepository.find({
      where: { titulo: Like(`%${termLower}%`) },
    });

    if (reclamos.length === 0) {
      throw new NotFoundException(
        `No hay reclamos con la palabra clave: ${termLower}`,
      );
    }
    return reclamos.map((item) => ({
      id: item.id,
      nroreclamo: item.nroreclamo,
      titulo: item.titulo,
      descripcion: item.descripcion,
      detalleCompraCSV: item.detalleCompraCSV,
      estado: item.pendiente ? 'pendiente' : 'resuelto',
    }));
  }

  async update(
    nroreclamo: number,
    updateItemInput: UpdateItemInput,
    user: User,
  ) {
    const updatedItem: Item = await this.itemsRepository.findOne({
      where: {
        nroreclamo: nroreclamo,
        user: {
          id: user.id,
        },
      },
    });
    if (!updatedItem)
      throw new NotFoundException(`No se encontró reclamo Nro.${nroreclamo}`);
    if (updateItemInput.titulo) updatedItem.titulo = updateItemInput.titulo;
    if (updateItemInput.descripcion)
      updatedItem.descripcion = updateItemInput.descripcion;
    await this.itemsRepository.save(updatedItem);
    return updatedItem;
  }

  async virtualRemove(nroreclamo: number, user: User) {
    const deletedItem: Item = await this.findOne(nroreclamo, user);
    deletedItem.pendiente = false;
    await this.itemsRepository.save(deletedItem);

    return `Reclamo numero #${nroreclamo} resuelto.`;
  }
}
