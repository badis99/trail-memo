import { IsNotEmpty, IsString } from 'class-validator';

export class tagdto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
