import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';
import { tagdto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsservice: TagsService) {}

  @Get()
  getAllTags() {
    return this.tagsservice.getAllTags();
  }

  @Post()
  addTag(@Body() tag: tagdto) {
    return this.tagsservice.addTag(tag);
  }
}
