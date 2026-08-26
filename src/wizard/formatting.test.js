import { test } from "node:test";
import assert from "node:assert/strict";
import { formatIndianNumber } from "./formatting.js";

test("formatIndianNumber groups digits in the Indian lakh/crore style", () => {
  assert.equal(formatIndianNumber("150000000"), "15,00,00,000");
  assert.equal(formatIndianNumber("1000"), "1,000");
  assert.equal(formatIndianNumber("100"), "100");
  assert.equal(formatIndianNumber("0"), "0");
});

test("formatIndianNumber strips non-digit, non-dot characters", () => {
  assert.equal(formatIndianNumber("1,50,00,000"), "1,50,00,000");
  assert.equal(formatIndianNumber("abc123def"), "123");
});

test("formatIndianNumber drops every decimal point when there's more than one", () => {
  // Note: the strip-extra-dots regex only spares a dot at index 0, and none
  // of these inputs start with one, so all dots are removed here -- this
  // pins the actual (surprising) current behavior, not an idealized one.
  assert.equal(formatIndianNumber("12.34.56"), "1,23,456");
  assert.equal(formatIndianNumber("1234.5"), "1,234.5");
});
