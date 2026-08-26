// Indian lakh/crore comma grouping for the wizard's amount inputs. Must stay
// on `window` (see entry file) since it's called from inline
// oninput="formatNumber(...)" HTML attributes.
export function formatNumber(id) {
  const input = document.getElementById(id);
  let value = input.value.replace(/[^\d.]/g, "");
  if ((value.match(/\./g) || []).length > 1) {
    value = value.replace(/(?!^)\./g, "");
  }
  let [integerPart, decimalPart] = value.split(".");
  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let formattedValue =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  if (decimalPart !== undefined) {
    formattedValue += "." + decimalPart;
  }
  input.value = formattedValue;
}
