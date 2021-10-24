import { Source } from "../core/models.ts";
import { BBVASource } from "./bbva.ts";

export const sources: Array<Source> = [
  new BBVASource(),
];
