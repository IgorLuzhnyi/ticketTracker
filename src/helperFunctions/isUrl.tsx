export function isURL(str: string) {
  const urlPattern =
    /^(https?|ftp):\/\/[^\s/$.?#][^\s]*\.[^\s/$.?#]{2,}(\/[^\s/$.?#]*)*$/;
  try {
    new URL(str);
    return urlPattern.test(str);
  } catch (e) {
    return false;
  }
}
