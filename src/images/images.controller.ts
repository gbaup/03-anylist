import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { ImagesService } from './images.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':nroreclamo')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @CurrentUser() user: User,
    @Param('nroreclamo') nroreclamo: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.upload(file, nroreclamo, user);
  }
}
