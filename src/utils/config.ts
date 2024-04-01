import Modal1 from "@/components/modal/modal1";
import Modal2 from "@/components/modal/modal2";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const modals = [
	{ id: "1", Modal: Modal1 },
	{ id: "2", Modal: Modal2 },
];

export const resolver = zodResolver;

const catsEnum = z.enum(["Cat1", "Cat2", "Cat3"]);

export const schemaAddCat = z.object({
	name: z.string().min(10).max(255),
	cat: catsEnum,
});
