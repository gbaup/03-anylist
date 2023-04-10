import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { ItemsService } from 'src/items/items.service';
import { S3 } from 'aws-sdk';

import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  private readonly s3: S3;
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly itemsService: ItemsService,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }
  async upload(image: Express.Multer.File, nroreclamo: number, user: User) {
    const item = await this.itemsRepository.findOne({
      where: {
        nroreclamo: nroreclamo,
        user: {
          id: user.id,
        },
      },
    });

    if (!item)
      throw new NotFoundException(
        `Reclamo #${nroreclamo} no existe o no tiene autorización para acceder`,
      );
    const bucketName = await this.configService.get<string>('AWS_BUCKET_NAME');

    const key = `${Date.now().toString()}_${image.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: image.buffer,
      ContentType: image.mimetype,
    };
    const imageUrl = await this.s3.upload(params).promise();
    item.image = imageUrl.Location;
    await this.itemsRepository.save(item);

    return imageUrl.Location;
  }
}
