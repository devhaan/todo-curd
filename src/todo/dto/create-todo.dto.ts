import { IsString, IsBoolean, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  details: string;

  @IsDateString()
  dueDate: Date;

}
