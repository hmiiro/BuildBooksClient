import moment from 'moment';

export function numberWithCommas(x) {
    return x.toLocaleString('en');
}

export function removeCommas(x) {
    return x.toString().replace(/,/g, '');
}

export const isIterableArray = (array) => Array.isArray(array) && !!array.length;

export function dateDDMMYYY(date) {
    return moment.unix(date / 1000).format('DD/MM/YYYY');
}
