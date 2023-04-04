import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ImagesService } from './images.service';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':nroreclamo')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('nroreclamo') nroreclamo: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.upload(file, nroreclamo);
  }

  @Get(':nroreclamo')
  findOne(@Param('nroreclamo') nroreclamo: number) {
    return this.imagesService.findOne(nroreclamo);
  }
}
