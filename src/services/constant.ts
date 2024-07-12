export const apiWhite: string[] = ['omsapi/inquiry/editDetail'];
export const isApiWhite = (url: string): boolean => {
  let isFind = false;
  apiWhite.forEach((item: string) => {
    if (url.indexOf(item) > -1) isFind = true;
  });
  return isFind;
};
