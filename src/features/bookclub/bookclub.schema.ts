// src/validators/bookclub.schema.ts
import { z } from "zod";

export const createBookclubSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
});

export const updateBookclubSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
});

// Infer the TS types from Zod (useful in controllers, DB inserts, etc)
export type CreateBookclubInput = z.infer<typeof createBookclubSchema>;
export type UpdateBookclubInput = z.infer<typeof updateBookclubSchema>;
