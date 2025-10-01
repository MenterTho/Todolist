import { IsEmail, IsString, MinLength, IsOptional, Matches } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0\d{9}|\+?[1-9]\d{7,14})$/, { message: "Invalid phone number format" })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/[^\s$.?#].[^\s]*|data:image\/[a-zA-Z]+;base64,[^\s]*)$/, { message: "Invalid avatar URL or base64 format" })
  avatarUrl?: string;
}