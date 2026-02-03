import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name!: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Debe ser único en el sistema',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @ApiProperty({
    example: 'secreto123',
    minLength: 6,
    description: 'Mínimo 6 caracteres',
  })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
