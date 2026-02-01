/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { DecisionsService } from './decisions.service';
import { createDecision, updateDecision } from './dto';

@Controller('decisions')
export class DecisionsController {
  constructor(private decisionService: DecisionsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAllDecision(@Req() req) {
    return this.decisionService.getAllDecisions(req.user.userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getDecisionById(@Req() req, @Param('id') id: string) {
    return this.decisionService.getDecisionById(req.user.userId, id);
  }

  @UseGuards(JwtGuard)
  @Post()
  createDecision(@Req() req, @Body() createDto: createDecision) {
    return this.decisionService.createDecision(req.user.userId, createDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateDecision(
    @Req() req,
    @Body() updateDto: updateDecision,
    @Param('id') id: string,
  ) {
    return this.decisionService.updateDecision(req.user.userId, id, updateDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteDecision(@Req() req, @Param('id') id: string) {
    return this.decisionService.deleteDecision(req.user.userId, id);
  }
}
