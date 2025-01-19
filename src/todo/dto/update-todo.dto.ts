import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

}
