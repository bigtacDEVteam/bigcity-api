import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { VisitorStatus } from 'src/enums/visitor-status.enum';

export class GetVisitorsQueryDto {
  @IsOptional()
  @IsIn([VisitorStatus.CHECKED_IN, VisitorStatus.CHECKED_OUT])
  status?: VisitorStatus;

  @IsOptional() @IsString() q?: string;     // pass/name/phone
  @IsOptional() @IsString() from?: string;  // YYYY-MM-DD (MYT)
  @IsOptional() @IsString() to?: string;    // YYYY-MM-DD (MYT)

  @IsOptional() @Transform(({ value }) => parseInt(value, 10)) @IsInt()
  page?: number = 1;

  @IsOptional() @Transform(({ value }) => parseInt(value, 10)) @IsInt()
  limit?: number = 20;

  @IsOptional() @IsString()
  sort?: string; // e.g. checkInAt:desc
}
