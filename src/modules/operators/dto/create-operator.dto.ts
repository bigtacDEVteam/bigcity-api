import { IsOptional, IsString } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  name: string;

  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phoneNo?: string;
  @IsOptional() @IsString() imageMeta?: string;
}
