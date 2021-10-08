import React from "react";
import { Editor } from "../components/editor";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../lib/client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Editor />
    </QueryClientProvider>
  );
}
