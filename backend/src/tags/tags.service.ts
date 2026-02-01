import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tagdto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getAllTags() {
    const tags = await this.prisma.tag.findMany();

    return tags;
  }

  async addTag(tag: tagdto) {
    const newTag = await this.prisma.tag.create({
      data: {
        name: tag.name,
      },
    });

    return newTag;
  }
}
