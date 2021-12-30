import { createUseQuery } from "../factory/createUseQuery";

export const useProducts = createUseQuery({
  buildUrl: () => "/api/admin/products/52",
});
