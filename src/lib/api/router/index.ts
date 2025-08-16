import { listItems, insertItem } from "@/lib/api/router/items";
import { listUsers } from "@/lib/api/router/users";

export const router = {
	users: {
		list: listUsers,
	},
	item: {
		list: listItems,
		add: insertItem,
	},
};
