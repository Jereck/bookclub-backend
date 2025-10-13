import "hono";
import type { z } from "zod";

declare module "hono" {
  interface Context {
    req: Request & {
      valid: <T extends "json" | "param" | "query" | "form">(key: T) => any;
    };
  }
}