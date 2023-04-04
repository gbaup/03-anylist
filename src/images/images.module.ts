import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ItemsModule } from 'src/items/items.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [ItemsModule, ConfigModule],
})
export class ImagesModule {}
