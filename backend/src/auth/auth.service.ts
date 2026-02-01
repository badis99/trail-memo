/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async singup(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async singin(dto: SignInDto) {
    const usersignedIn = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!usersignedIn) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(usersignedIn.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    const token = this.jwt.sign({
      sub: usersignedIn.id,
      email: usersignedIn.email,
    });

    return { accessToken: token };
  }
}
