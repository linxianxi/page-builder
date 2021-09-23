import createGlobalState from "react-use/lib/factory/createGlobalState";

export const useIsScrolling = createGlobalState<boolean>(false);
