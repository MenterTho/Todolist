import { IsString, IsNotEmpty } from "class-validator";

export class UpdateFcmTokenDto {
  @IsString({ message: "fcmToken phải là chuỗi" })
  @IsNotEmpty({ message: "fcmToken không được để trống" })
  fcmToken!: string;
}