function info(...args) {
  if (process.env.NODE_ENV !== "test") console.log(...args);
}
function error(...args) {
  if (process.env.NODE_ENV !== "test") console.error(...args);
}

export { info, error };
