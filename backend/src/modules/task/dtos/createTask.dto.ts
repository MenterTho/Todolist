import { IsString, MinLength, IsOptional, IsInt, IsIn, IsDateString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(["To Do", "In Progress", "Done"], { message: "Trạng thái phải là 'To Do', 'In Progress' hoặc 'Done'" })
  status?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @IsIn(["Low", "Medium", "High"], { message: "Ưu tiên phải là 'Low', 'Medium' hoặc 'High'" })
  priority?: string;

  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @IsInt()
  projectId!: number;
}