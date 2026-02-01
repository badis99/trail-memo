import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createReview } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, id: string, createReview: createReview) {
    const decision = await this.prisma.decision.findUnique({
      where: {
        id: id,
      },
      include: { review: true },
    });

    if (!decision) throw new NotFoundException('Decision Not Found');

    if (decision.userId !== userId) {
      throw new ForbiddenException('Access Denied');
    }

    if (decision.status === 'REVIEWED' || decision.review) {
      throw new BadRequestException('Decision already reviewed');
    }

    const daysSinceCreation = this.getDaysBetween(
      decision.createdAt,
      new Date(),
    );
    if (daysSinceCreation < 1) {
      throw new BadRequestException('Wait at least 1 day before reviewing');
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          decisionId: id,
          actualOutcome: createReview.actualOutcome,
          lessonsLearned: createReview.lessonsLearned,
          wouldDoDiff: createReview.wouldDoDiff
            ? createReview.wouldDoDiff
            : undefined,
        },
      });

      await tx.decision.update({
        where: { id: id },
        data: { status: 'REVIEWED' },
      });

      return tx.decision.findUnique({
        where: { id: id },
        include: {
          review: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });
  }

  private getDaysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
