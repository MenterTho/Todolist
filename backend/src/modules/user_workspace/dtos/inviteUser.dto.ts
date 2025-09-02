import { IsEmail, IsString, IsIn } from "class-validator";

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsIn(["admin", "member"], { message: "Vai trò phải là 'admin' hoặc 'member'" })
  role!: string;
}