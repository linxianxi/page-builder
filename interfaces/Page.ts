import { FC } from "react";
import { NextPage } from "next";

export type Page = NextPage & {
  layout?: FC;
};
