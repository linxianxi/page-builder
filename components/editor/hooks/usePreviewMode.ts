import { createGlobalState } from "react-use";

export const usePreviewMode = createGlobalState<string>("desktop");
