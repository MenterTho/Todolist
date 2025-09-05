import { IsInt, IsString, IsIn } from "class-validator";

export class UpdateMemberRoleDto {
  @IsInt()
  memberId!: number;

  @IsString()
  @IsIn(["owner", "management", "member"], { message: "Vai trò phải là 'owner' hoặc 'member'" })
  role!: string;
}