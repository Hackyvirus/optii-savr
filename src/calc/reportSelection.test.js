import { test } from "node:test";
import assert from "node:assert/strict";
import { getCombinations, findFinalFile, parseNumberWithCommas } from "./reportSelection.js";
import { REPORT_MANIFEST } from "./reportManifest.js";

const keysAll = ["AA", "BR", "MOOWR", "EOU", "SEZ", "AIR"];

test("getCombinations sizes and contents", () => {
  assert.deepEqual(getCombinations(["A", "B"], 0), [[]]);
  assert.deepEqual(getCombinations(["A", "B"], 1), [["A"], ["B"]]);
  assert.deepEqual(getCombinations(["A", "B"], 2), [["A", "B"]]);
  assert.deepEqual(getCombinations(["A", "B", "C"], 2), [
    ["A", "B"],
    ["A", "C"],
    ["B", "C"],
  ]);
  // no duplicates for a 3-choose-3
  assert.equal(getCombinations(["A", "B", "C"], 3).length, 1);
});

test("findFinalFile returns null when every candidate has a NaN value", () => {
  assert.equal(
    findFinalFile(
      { AA: NaN, BR: NaN, MOOWR: NaN, EOU: NaN, SEZ: NaN, AIR: NaN },
      keysAll
    ),
    null
  );
});

test("findFinalFile picks the single clear winner", () => {
  const result = findFinalFile(
    { AA: 10, BR: 5, MOOWR: 5, EOU: 5, SEZ: 5, AIR: 5 },
    keysAll
  );
  assert.equal(result.fileName, "AA.pdf");
  assert.equal(result.maxValue, 10);
  assert.deepEqual(result.keys, ["AA"]);
});

test("findFinalFile picks the largest tied group whose max also beats everything outside it", () => {
  const result = findFinalFile(
    { AA: 10, BR: 10, MOOWR: 5, EOU: 5, SEZ: 5, AIR: 5 },
    keysAll
  );
  assert.equal(result.fileName, "AA_BR.pdf");
});

test("findFinalFile respects the restricted 4-key set (EOU/SEZ excluded when X === N/A)", () => {
  const keys = ["AA", "BR", "MOOWR", "AIR"];
  const result = findFinalFile(
    { AA: 5, BR: 5, MOOWR: 5, EOU: 100, SEZ: 100, AIR: 5 },
    keys
  );
  // EOU/SEZ have the numerically highest values but aren't in `keys`, so
  // they must never appear in the result even though they'd "win" globally.
  assert.equal(result.fileName, "AA_AIR_BR_MOOWR.pdf");
});

test("every filename findFinalFile can return is a real file in the manifest", () => {
  // Exhaustive check: for every non-empty subset of the full key set, the
  // combo filename it would produce is present in REPORT_MANIFEST. This is
  // what makes the findFinalFile manifest guard a no-op today (all 63
  // combinations exist) while still protecting against reports/ ever being
  // incomplete in the future.
  for (let size = 1; size <= keysAll.length; size++) {
    for (const combo of getCombinations(keysAll, size)) {
      const fileName = combo.slice().sort().join("_") + ".pdf";
      assert.ok(
        REPORT_MANIFEST.has(fileName),
        `${fileName} missing from REPORT_MANIFEST`
      );
    }
  }
});

test("findFinalFile falls through to a smaller subset when the larger combo's file doesn't exist", () => {
  // "AA_ZZ.pdf" (size 2) isn't a real template, so the manifest guard skips
  // it and the search continues to size 1, where "AA.pdf" is real and wins.
  const fakeKeys = ["AA", "ZZ"]; // "ZZ" is not a real scheme / not in any template
  const result = findFinalFile({ AA: 10, ZZ: 10 }, fakeKeys);
  assert.equal(result.fileName, "AA.pdf");
});

test("findFinalFile returns null when no subset at any size has a real file", () => {
  const fakeKeys = ["YY", "ZZ"]; // neither key corresponds to any real template
  const result = findFinalFile({ YY: 10, ZZ: 10 }, fakeKeys);
  assert.equal(result, null);
});

test("parseNumberWithCommas", () => {
  assert.equal(parseNumberWithCommas("1,23,456"), 123456);
  assert.equal(Number.isNaN(parseNumberWithCommas("abc")), true);
  assert.equal(Number.isNaN(parseNumberWithCommas(123)), true);
});
