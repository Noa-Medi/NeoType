
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

export const toLocalDate = (utcDate) => {
    if (!utcDate) return null;
    return dayjs(utcDate).utc().tz('Europe/Berlin').toISOString();
};

export const toFormattedDate = (date) => {
    if (!date) return null;
    return dayjs(date).format('dddd, D.MMMM');
}