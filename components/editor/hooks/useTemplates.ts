import createGlobalState from "react-use/lib/factory/createGlobalState";

export const useTemplates = createGlobalState(() => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("templates")) || {};
  }
  return {};
});
