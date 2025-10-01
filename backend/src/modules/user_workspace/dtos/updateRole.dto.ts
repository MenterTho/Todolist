import { IsInt, IsString, IsIn } from "class-validator";

export class UpdateMemberRoleDto {
  @IsInt()
  memberId!: number;

  @IsString()
  @IsIn(["management","member"], { message: "Vai trò phải là 'management' hoặc 'member'" })
  role!: string;
}