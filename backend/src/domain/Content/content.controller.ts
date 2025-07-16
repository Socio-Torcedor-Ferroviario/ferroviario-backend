import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import {
  CreateContentDto,
  ResponseContentDto,
  UpdateContentDto,
} from './content.schema';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { Role } from '../User/role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiAuth(Role.Admin)
  async create(
    @GetUser() user: AuthJwtDto,
    @Body() createContentDto: CreateContentDto,
  ): Promise<ResponseContentDto> {
    const content = await this.contentService.create(
      +user.id,
      createContentDto,
    );
    return content;
  }

  @Get()
  @ApiAuth(Role.Socio, Role.Admin)
  async findAll(): Promise<ResponseContentDto[]> {
    const contents = await this.contentService.findAll();
    return contents;
  }

  @Put(':id')
  @ApiAuth(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<ResponseContentDto> {
    const content = await this.contentService.update(+id, updateContentDto);
    return content;
  }
}
