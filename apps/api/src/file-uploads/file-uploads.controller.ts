import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FileUploadsService } from './file-uploads.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('file-uploads')
export class FileUploadsController {
  constructor(private readonly fileUploadsService: FileUploadsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.fileUploadsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileUploadsService.findOne(id);
  }
}


