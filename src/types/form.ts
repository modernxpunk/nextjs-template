import { schemaAddCat } from "@/utils/config";
import { z } from "zod";

export type AddCat = z.infer<typeof schemaAddCat>;
