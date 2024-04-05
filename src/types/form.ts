import type { schemaAddCat } from "@/utils/config";
import type { z } from "zod";

export type AddCat = z.infer<typeof schemaAddCat>;
