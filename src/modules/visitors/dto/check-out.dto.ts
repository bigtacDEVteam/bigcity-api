import { IsNotEmpty, IsString } from 'class-validator';

export class CheckOutVisitorDto {
  @IsString()
  @IsNotEmpty()
  passNumber: string;
}
