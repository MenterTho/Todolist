import { IsInt, IsString, IsIn } from "class-validator";

export class UpdateRoleDto {

  @IsString()
  @IsIn(["admin", "member"], { message: "Role must be 'admin' or 'member'" })
  role!: string;
}