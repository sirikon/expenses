import { Application, RouteParams, Router, RouterContext } from "oak/mod.ts";

export type ExApp = Application<never>;
export type ExRouter = Router<RouteParams, never>;
export type ExContext = RouterContext<RouteParams, never>;
