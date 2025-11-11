import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckInVisitorDto {
  @IsString()
  @IsNotEmpty()
  passNumber: string;

  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() icNumber?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() photoUrl?: string;
}
