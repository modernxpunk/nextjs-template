import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/en";
import "dayjs/locale/uk";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const humanize = (...rest: any[]) => {
	// @ts-ignore
	return dayjs.duration(rest).humanize();
};

const formatDate = (template: string = "") => {
	return dayjs().format(template);
};

export { formatDate, humanize };
