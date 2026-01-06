import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dtos';
import { ValoraValidationPipe } from './pipes/valora-validation.pipe';

@Controller('users')
@UsePipes(new ValoraValidationPipe())
export class UsersController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      data: createUserDto,
      timestamp: new Date().toISOString(),
    };
  }
}
