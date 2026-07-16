import { api, getApiData, type ApiRequestConfig } from "@/lib";
import { ApiSuccessResponse } from "@/common/types/api.type";
import type { Menu, StoreMenuPayload } from "./menus.type";

export async function getListMenus(config?: ApiRequestConfig) {
  const response = await api.get<ApiSuccessResponse<Menu[]>>("/menus", config);
  return getApiData(response);
}

export async function storeMenu(payload: StoreMenuPayload, config?: ApiRequestConfig) {
  const response = await api.post<ApiSuccessResponse<Menu>>("/menus/store", payload, config);
  return getApiData(response);
}

export async function deleteMenu(id: number, config?: ApiRequestConfig) {
  const response = await api.delete<ApiSuccessResponse<boolean>>(`/menus/${id}`, config);
  return getApiData(response);
}
