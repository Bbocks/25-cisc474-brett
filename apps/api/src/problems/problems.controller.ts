import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemsService.findOne(id);
  }
}


