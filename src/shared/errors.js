// Single choke point for surfacing calc/PDF pipeline failures to the viewer tab
// and the developer console, instead of letting them fail silently.
export function reportFatal(code, err) {
  const message = (err && err.message) || String(err);
  try {
    localStorage.setItem(
      "sharedPDF_error",
      JSON.stringify({ code, message, ts: Date.now() })
    );
  } catch (storageErr) {
    console.error("[optii-savr] failed to write sharedPDF_error", storageErr);
  }
  console.error(`[optii-savr:${code}]`, err);
}
