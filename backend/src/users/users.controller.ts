import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
interface RequestWithUser extends Request {
  user: {
    id: string | number;
    role?: string;
    email?: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    if (user.role !== 'admin' && String(user.id) !== String(id)) {
      throw new ForbiddenException(
        'No tienes permiso para editar este usuario',
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = req.user;
    const isAdmin = user.role === 'admin';
    const isOwner = String(user.id) === String(id);

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este usuario.',
      );
    }

    return this.usersService.remove(id);
  }
}
