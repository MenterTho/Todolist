import { IsEnum, IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { NotificationType } from "../models/notification.model";

export class CreateNotificationDto {
  @IsNotEmpty({ message: "Nội dung không được để trống" })
  @IsString({ message: "Nội dung phải là chuỗi" })
  @Length(1, 255, { message: "Nội dung phải từ 1 đến 255 ký tự" })
  message!: string;

  @IsInt({ message: "ID người nhận phải là số nguyên" })
  recipientId!: number;

  @IsEnum(NotificationType, { message: "Loại thông báo không hợp lệ" })
  type!: NotificationType;

  @IsInt({ message: "ID liên quan phải là số nguyên" })
  relatedId!: number;
}