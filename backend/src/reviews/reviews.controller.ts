import { Controller, Param, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { createReview } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('decisions')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':id/review')
  createReview(
    @Req() req,
    @Param('id') id: string,
    @Body() createReview: createReview,
  ) {
    return this.reviewsService.createReview(req.user.userId, id, createReview);
  }
}
