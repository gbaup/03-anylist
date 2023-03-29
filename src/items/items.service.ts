import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/input';
import { CsvData } from './entities/csv.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(CsvData)
    private readonly csvRepository: Repository<CsvData>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const reclamo = new Item();
    const csvData = new CsvData();
    csvData.date = createItemInput.date;
    csvData.nrofactura = createItemInput.nrofactura;
    csvData.nroproducto = createItemInput.nroproducto;
    await this.csvRepository.save(csvData);

    reclamo.title = createItemInput.title.toLowerCase();
    reclamo.description = createItemInput.description.toLowerCase();
    reclamo.detalleCompraCSV = `${createItemInput.date}, ${createItemInput.nrofactura}, ${createItemInput.nroproducto}`;
    reclamo.nroreclamo = (await this.itemsRepository.maximum('nroreclamo')) + 1;
    reclamo.csv = csvData;

    await this.itemsRepository.save(reclamo);

    // csvData.itemData = reclamo;
    // await this.csvRepository.save(csvData);

    return reclamo;
  }

  async findAll() {
    return await this.itemsRepository.find();
  }

  async findOne(nroreclamo: number) {
    const reclamo = await this.itemsRepository.findOneBy({ nroreclamo });
    if (!reclamo)
      throw new NotFoundException(
        `No se encontró el reclamo Nro.${nroreclamo}`,
      );
    return reclamo;
  }

  async findMany(term: string): Promise<Item[]> {
    const termLower = term.toLowerCase();
    const reclamos = await this.itemsRepository.find({
      where: { title: Like(`%${termLower}%`) },
    });

    if (reclamos.length === 0) {
      throw new NotFoundException(
        `No hay reclamos con la palabra clave: ${termLower}`,
      );
    }
    return reclamos;
  }

  async update(nroreclamo: number, updateItemInput: UpdateItemInput) {
    const updatedItem: Item = await this.itemsRepository.findOneBy({
      nroreclamo,
    });
    if (!updatedItem)
      throw new NotFoundException(`No se encontró reclamo Nro.${nroreclamo}`);
    if (updateItemInput.title) updatedItem.title = updateItemInput.title;
    if (updateItemInput.description)
      updatedItem.description = updateItemInput.description;
    await this.itemsRepository.save(updatedItem);
    return updatedItem;
  }

  async remove(nroreclamo: number) {
    const deletedItem: Item = await this.findOne(nroreclamo);

    await this.itemsRepository.remove(deletedItem);
    // await this.csvRepository.delete(csvData.id);

    return `Reclamo numero ${nroreclamo} eliminado`;
  }
}
