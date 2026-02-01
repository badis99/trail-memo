/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
