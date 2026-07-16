import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getListMenus, storeMenu, deleteMenu } from "./menus.service";
import type { StoreMenuPayload } from "./menus.type";
import type { ApiRequestConfig } from "@/lib";

export const MENU_QUERY_KEY = ["menus"] as const;

export function useGetListMenus(config?: ApiRequestConfig) {
  return useQuery({
    queryKey: MENU_QUERY_KEY,
    queryFn: () => getListMenus(config),
  });
}

export function useStoreMenu(config?: ApiRequestConfig) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StoreMenuPayload) => storeMenu(payload, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    },
  });
}

export function useDeleteMenu(config?: ApiRequestConfig) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMenu(id, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    },
  });
}
