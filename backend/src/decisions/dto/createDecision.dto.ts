import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class createDecision {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  context: string;

  @IsString()
  @IsNotEmpty()
  expectedOutcome: string;

  @IsArray()
  @IsOptional()
  tagName?: string[];
}
