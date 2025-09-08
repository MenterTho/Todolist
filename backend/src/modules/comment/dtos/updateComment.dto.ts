import { IsString, MinLength } from "class-validator";

export class UpdateCommentDto {
  @IsString()
  @MinLength(1, { message: "Nội dung bình luận không được để trống" })
  content!: string;
}