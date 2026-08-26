import { REPORT_MANIFEST } from "./reportManifest.js";

export function getCombinations(arr, size) {
  const result = [];

  function backtrack(start = 0, combo = []) {
    if (combo.length === size) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }

  backtrack();

  return result;
}

// Picks which pre-built report PDF (reports/<combo>.pdf) matches the given
// scheme values: the largest group of keys that are all tied at the max
// value, where that max is also >= every value outside the group. Returns
// null if no combination qualifies (e.g. all-NaN input).
export function findFinalFile(values, keys) {
  for (let size = keys.length; size >= 1; size--) {
    const combos = getCombinations(keys, size);

    for (const combo of combos) {
      const valList = combo.map((k) => values[k]);

      // Skip combo if any value is not a valid number
      if (valList.some((v) => typeof v !== "number" || isNaN(v))) {
        continue;
      }

      const maxVal = Math.max(...valList);
      const allSameMax = valList.every((v) => v === maxVal);

      const otherKeys = keys.filter((k) => !combo.includes(k));
      const maxOutside = otherKeys.length
        ? Math.max(...otherKeys.map((k) => values[k]))
        : -Infinity;

      const isTrulyMax = maxVal >= maxOutside;

      if (allSameMax && isTrulyMax) {
        const fileName = combo.slice().sort().join("_") + ".pdf";
        // A qualifying combo whose filename isn't one of the real report
        // templates would previously reach fetch() and fail unpredictably
        // (404 -> corrupt-PDF parse error). Skip it here instead so
        // selection keeps searching smaller combos, falling through to a
        // clean `null` (surfaced as PIPELINE_NO_MATCHING_SCHEME_COMBINATION)
        // if nothing else qualifies.
        if (!REPORT_MANIFEST.has(fileName)) {
          continue;
        }
        return {
          fileName,
          maxValue: maxVal,
          keys: combo,
        };
      }
    }
  }
  return null;
}

export function parseNumberWithCommas(val) {
  if (typeof val !== "string") return NaN;
  const cleaned = val.replace(/,/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? NaN : num;
}
