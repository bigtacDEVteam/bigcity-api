import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Roles } from 'src/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: Roles })
  @IsEnum(Roles)
  role: Roles;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsString()
  @IsOptional()
  phoneNo?: string;

  @ApiPropertyOptional({ example: 'Unit 101' })
  @IsString()
  @IsOptional()
  unitNumber?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Apt 2' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: 1, description: 'Operator ID' })
  @IsNumber()
  operator: number;
}
