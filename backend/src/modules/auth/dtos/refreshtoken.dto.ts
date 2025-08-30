import { IsString, Min, MinLength } from "class-validator";
export class RefreshTokenDto{
  @IsString()
  @MinLength(6)
  refreshToken!: string
}
