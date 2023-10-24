export function isURL(str: string) {
  const urlPattern =
    /^(https?|ftp):\/\/[^\s/$.?#][^\s]*\.[^\s/$.?#]{2,}(\/[^\s/$.?#]*)*$/;
  try {
    new URL(str);
    console.log(urlPattern.test(str));
    return urlPattern.test(str);
  } catch (e) {
    console.log("not url");
    return false;
  }
}
