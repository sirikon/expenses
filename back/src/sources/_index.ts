import { Source } from "../core/models.ts";
import { BBVASource } from "./bbva/mod.ts";

export const sources: Array<Source> = [
  new BBVASource(),
];
