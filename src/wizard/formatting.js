// Indian lakh/crore comma grouping (e.g. "150000000" -> "15,00,00,000") for
// the wizard's amount inputs. Pure string transform, split out from the
// DOM-touching formatNumber() below so it's independently unit-testable.
export function formatIndianNumber(rawValue) {
  let value = rawValue.replace(/[^\d.]/g, "");
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
  return formattedValue;
}

// Must stay on `window` (see entry file) since it's called from inline
// oninput="formatNumber(...)" HTML attributes.
export function formatNumber(id) {
  const input = document.getElementById(id);
  input.value = formatIndianNumber(input.value);
}
