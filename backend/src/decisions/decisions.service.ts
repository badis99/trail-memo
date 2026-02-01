import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDecision } from './dto/createDecision.dto';
import { updateDecision } from './dto';

@Injectable()
export class DecisionsService {
  constructor(private prisma: PrismaService) {}
  async getAllDecisions(userId: string) {
    const decisions = await this.prisma.decision.findMany({
      where: {
        userId: userId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return decisions;
  }

  async getDecisionById(userId: string, id: string) {
    const decision = await this.prisma.decision.findUnique({
      where: {
        id: id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        review: true,
      },
    });

    if (!decision) throw new NotFoundException('Decision not Found');

    if (decision.userId !== userId) {
      throw new ForbiddenException('Access to this resource denied');
    }

    return decision;
  }

  async createDecision(userId: string, createDto: createDecision) {
    const decision = await this.prisma.decision.create({
      data: {
        userId: userId,
        title: createDto.title,
        context: createDto.context,
        expectedOutcome: createDto.expectedOutcome,
        tags: createDto.tagName
          ? {
              create: createDto.tagName.map((tagName) => ({
                tag: {
                  connect: { name: tagName },
                },
              })),
            }
          : undefined,
      },
    });

    return decision;
  }

  async updateDecision(userId: string, id: string, updateDto: updateDecision) {
    const decision = await this.getDecisionById(userId, id);

    if (decision.status === 'REVIEWED') {
      throw new ForbiddenException('Cannot update a reviewed decision');
    }

    if (updateDto.tagsName && updateDto.tagsName.length > 0) {
      const existingTags = await this.prisma.tag.findMany({
        where: { name: { in: updateDto.tagsName } },
      });

      if (existingTags.length !== updateDto.tagsName.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    const { tagsName, ...decisionData } = updateDto;

    return this.prisma.decision.update({
      where: { id },
      data: {
        ...decisionData,
        ...(tagsName !== undefined && {
          tags: {
            deleteMany: {},
            create: tagsName.map((tagName) => ({
              tag: { connect: { name: tagName } },
            })),
          },
        }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        review: true,
      },
    });
  }

  async deleteDecision(userId: string, id: string) {
    await this.getDecisionById(userId, id);

    const decision = await this.prisma.decision.delete({
      where: {
        id: id,
      },
    });

    return decision;
  }
}
