import { IsString, MinLength, IsOptional, IsInt } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  workspaceId!: number;
}