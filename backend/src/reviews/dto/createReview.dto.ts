import { IsNotEmpty, IsString } from 'class-validator';

export class createReview {
  @IsString()
  @IsNotEmpty()
  actualOutcome: string;

  @IsString()
  @IsNotEmpty()
  lessonsLearned: string;

  @IsString()
  wouldDoDiff?: string;
}
