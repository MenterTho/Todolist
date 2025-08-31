import { IsString, MinLength, IsOptional, Matches } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/[^\s$.?#].[^\s]*|data:image\/[a-zA-Z]+;base64,[^\s]*)$/, { message: "Invalid avatar URL or base64 format" })
  avatarUrl?: string;
}