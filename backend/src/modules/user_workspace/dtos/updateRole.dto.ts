import { IsInt, IsString, IsIn } from "class-validator";

export class UpdateMemberRoleDto {
  @IsInt()
  memberId!: number;

  @IsString()
  @IsIn(["admin", "member"], { message: "Vai trò phải là 'admin' hoặc 'member'" })
  role!: string;
}