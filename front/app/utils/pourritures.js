
const isConvicted = (d) => d.conviction.id === 1 || d.conviction.id === 4;
const isRecent = (d) => d.year >= 1995;

export const isDisplayable = (d) => isConvicted(d) && isRecent(d);

export default isDisplayable
