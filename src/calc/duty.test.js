import { test } from "node:test";
import assert from "node:assert/strict";
import {
  safeParseFloat,
  CalculateDuty,
  calculateDepreciationValue,
  CalculateNPV,
  CalculateGrowth,
  formatNumberPDF,
} from "./duty.js";

// Fixtures below pin the behavior of the pre-Phase-2 implementation
// (verified via a side-by-side comparison against the Phase 1 git commit
// before this refactor landed, including calculateDepreciationValue's
// implicit-global-`P` fix -- confirmed byte-identical output).

test("safeParseFloat", () => {
  assert.equal(safeParseFloat("1,23,456"), 123456);
  assert.equal(safeParseFloat("0"), 0);
  assert.equal(safeParseFloat(""), 0);
  assert.equal(safeParseFloat("abc"), 0);
  assert.equal(safeParseFloat("-5.5"), -5.5);
  assert.equal(safeParseFloat(null), 0);
  assert.equal(safeParseFloat(undefined), 0);
  assert.equal(safeParseFloat(1234.5), 1234.5);
});

test("CalculateDuty sums its arguments via safeParseFloat", () => {
  assert.equal(CalculateDuty("100", "200", "300"), 600);
  assert.equal(CalculateDuty(), 0);
});

test("calculateDepreciationValue across quarterly breakpoints", () => {
  const cases = [
    [1, 840000],
    [2, 720000],
    [3, 600000],
    [5, 400000],
    [7, 240000],
    [10, 0],
    [0.25, 0],
    [0, 0],
  ];
  for (const [years, expected] of cases) {
    assert.equal(
      calculateDepreciationValue(1000000, years),
      expected,
      `years=${years}`
    );
  }
});

test("calculateDepreciationValue has no cross-call contamination", () => {
  // Guards against the old implicit-global `P` reappearing: two calls in a
  // row must each produce the value for their own inputs, not leak state.
  calculateDepreciationValue(500000, 3);
  assert.equal(calculateDepreciationValue(1000000, 5), 400000);
});

test("CalculateNPV", () => {
  assert.equal(CalculateNPV(1000000, 9, 5), 649931);
  assert.equal(CalculateNPV(0, 9, 5), 0);
  assert.equal(CalculateNPV(1000000, -1, 5), 0);
  assert.equal(CalculateNPV(1000000, 9, 0), 0);
});

test("CalculateGrowth", () => {
  assert.equal(CalculateGrowth(100000, 5, 10), 1257789.2535548827);
  assert.equal(CalculateGrowth(0, 5, 10), 0);
  assert.equal(CalculateGrowth(100000, 0, 1), 100000);
});

test("formatNumberPDF", () => {
  assert.equal(formatNumberPDF("N/A"), "N/A");
  assert.equal(formatNumberPDF("Nil"), "Nil");
  assert.equal(formatNumberPDF(1234567), "12");
  assert.equal(formatNumberPDF(-500000), "-5");
  assert.equal(formatNumberPDF("abc"), "Invalid Input");
  assert.equal(formatNumberPDF(null), "Invalid Input");
});
