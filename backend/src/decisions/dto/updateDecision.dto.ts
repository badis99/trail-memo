import { IsArray, IsString } from 'class-validator';

export class updateDecision {
  @IsString()
  title: string;

  @IsString()
  context: string;

  @IsString()
  expectedOutcome: string;

  @IsArray()
  tagsName?: string[];
}
