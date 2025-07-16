import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './content.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Plans } from '../Plans/plans.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    TypeOrmModule.forFeature([Plans]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
