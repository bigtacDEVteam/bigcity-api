import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { QueryOperatorDto } from './dto/query-operator.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { User as UserDeco } from 'src/decorators/user.decorator';
import { Roles } from 'src/enums/roles.enum';

@UseGuards(AccessTokenGuard)
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  // SUPERADMIN only — gate with your role check
  @Post()
  async create(@UserDeco() user: any, @Body() dto: CreateOperatorDto) {
    if (user.role !== Roles.SUPERADMIN) {
      // you can throw new ForbiddenException() if you have it imported
      throw new Error('Forbidden');
    }
    return this.operatorsService.create(dto);
  }

  // SUPERADMIN: list all; Admin: could list just own (optional)
  @Get()
  async list(@UserDeco() user: any, @Query() query: QueryOperatorDto) {
    // if you want Admin to see only their operator, do:
    // if (user.role !== Roles.SUPERADMIN) return this.operatorsService.findOne(user.operatorId);
    return this.operatorsService.list(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.operatorsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @UserDeco() user: any,
    @Param('id') id: number,
    @Body() dto: UpdateOperatorDto,
  ) {
    if (user.role !== Roles.SUPERADMIN) throw new Error('Forbidden');
    return this.operatorsService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@UserDeco() user: any, @Param('id') id: number) {
    if (user.role !== Roles.SUPERADMIN) throw new Error('Forbidden');
    return this.operatorsService.remove(+id);
  }
}
