import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

export const slugify = (name) =>
    name.toLowerCase()
        .replace(/[àáâãäåÀÁÂÃÄÅ]/g,"a") // replace special a
        .replace(/[èéêëēėÈÉÊË]/g, "e") // replace special e
        .replace(/[îïíīįì]/g, "i") // replace special c
        .replace(/[çćč]/g, "c") // replace special i
        .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
        .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
        .replace(/^-+|-+$/g, ''); // remove leading, trailing -

export const distinct = (value, index, self) =>
    self.indexOf(value) === index;

export const pluralize = (arrayOrCount, singular, plural) =>
    isArray(arrayOrCount) ?
        (arrayOrCount.length > 1 ? plural : singular) :
        (arrayOrCount > 1 ? plural : singular);


export const capitalize = (string) => {
    if (isString(string)) return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {slugify, distinct, pluralize, capitalize};
