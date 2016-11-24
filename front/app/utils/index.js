
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

export const pluralize = (array, singular, plural) =>
    array.length > 1 ? plural : singular;

export default {slugify, distinct, pluralize};
