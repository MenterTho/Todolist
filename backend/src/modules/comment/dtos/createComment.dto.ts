import { IsString, MinLength, IsOptional, IsInt } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: "Nội dung bình luận không được để trống" })
  content!: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}