import api from "@/lib/axios.lib";
import {
  NotificationsResponse,
  DeleteNotificationResponse,
} from "@/types/notification.type";
import { AxiosError } from "axios";
import { handleApiError, ApiErrorResponse } from "@/utils/apiErrorHandler.util";

export const getNotifications = async () => {
  try {
    const { data } = await api.get<NotificationsResponse>("/notification/list");
    return data.data;
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  try {
    await api.put(`/notification/${id}/read`);
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
};

export const deleteNotification = async (id: number): Promise<void> => {
  try {
    await api.delete(`/notification/${id}`);
  } catch (error) {
    throw handleApiError(error as AxiosError<ApiErrorResponse>);
  }
};