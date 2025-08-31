import { IsInt, IsString, IsIn } from "class-validator";

export class UpdateRoleDto {
  @IsInt()
  targetUserId!: number;

  @IsString()
  @IsIn(["admin", "member"], { message: "Role must be 'admin' or 'member'" })
  role!: string;
}