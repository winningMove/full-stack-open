function formatWithCommas(number) {
  let [whole, dec] = String(number).split(".");
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${whole}${dec ? "." + dec : ""}`;
}

export default formatWithCommas;
