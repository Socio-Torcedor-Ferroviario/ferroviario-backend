import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    status: 201,
    description: 'Content created successfully.',
    model: ResponseContentDto,
  })
  @ApiOperation({
    summary: 'Create new content',
    description: 'Creates new content with the provided details.',
  })
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
  @ApiStandardResponse({
    status: 200,
    description: 'List of all content.',
    isArray: true,
    model: ResponseContentDto,
  })
  @ApiOperation({
    summary: 'Get all content',
    description: 'Retrieves a list of all content available in the system.',
  })
  async findAll(): Promise<ResponseContentDto[]> {
    const contents = await this.contentService.findAll();
    return contents;
  }

  @Put(':id')
  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    status: 200,
    description: 'Content updated successfully.',
    model: ResponseContentDto,
  })
  @ApiOperation({
    summary: 'Update content by ID',
    description: 'Updates the content with the provided ID and details.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<ResponseContentDto> {
    const content = await this.contentService.update(+id, updateContentDto);
    return content;
  }
}
