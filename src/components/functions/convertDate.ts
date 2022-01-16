export const convertDate = (pDate: string): string => {
  const postDate = new Date(pDate);
  const p = (pre: number) => `0${pre}`.slice(-2);
  const year = postDate.getFullYear();
  const month = p(postDate.getMonth() + 1);
  const date = p(postDate.getDate());
  const hour = p(postDate.getHours());
  const minute = p(postDate.getMinutes());
  const second = p(postDate.getSeconds());
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};
