/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('/signup')
  signup(@Body() dto: SignUpDto) {
    return this.authservice.singup(dto);
  }

  @Post('/signin')
  singin(@Body() dto: SignInDto) {
    return this.authservice.singin(dto);
  }
}
