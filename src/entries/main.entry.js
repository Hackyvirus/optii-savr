// Bundled to scripts/main.js. Loaded dynamically (and removed again) by
// optii-savr-calculator.js when the user clicks Calculate.
//
// getAllInputValues must stay on `window`: optii-savr-calculator.js calls it
// as a bare global (`await getAllInputValues()`) after injecting this script,
// and esbuild's IIFE bundle does not leak top-level declarations onto
// `window` the way a classic <script> did.
import { getAllInputValues } from "../calc/pipeline.js";

window.getAllInputValues = getAllInputValues;
