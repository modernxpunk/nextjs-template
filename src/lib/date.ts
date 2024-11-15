import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/en";
import "dayjs/locale/uk";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const humanize = (...rest: [number, string?] | [object]) => {
	// @ts-ignore
	return dayjs.duration(...rest).humanize();
};

const formatDate = (date: Date = new Date(), template = "") => {
	return dayjs(date).format(template);
};

export { formatDate, humanize };
