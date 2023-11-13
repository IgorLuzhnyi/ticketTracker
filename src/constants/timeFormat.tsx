export const kyivTime = () =>
  new Date().toLocaleString("en-US", {
    timeZone: "Europe/Kiev",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
