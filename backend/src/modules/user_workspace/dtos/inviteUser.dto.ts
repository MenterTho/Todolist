import { IsEmail, IsString, IsIn } from "class-validator";

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsIn(["member"], { message: "Vai trò phải là 'member'" })
  role!: string;
}