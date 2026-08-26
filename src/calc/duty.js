export function getSafeFloatInput(elementId, defaultValue) {
  const rawValue = document.getElementById(elementId).value.trim();
  const parsedValue = parseFloat(rawValue);

  if (rawValue === "" || parsedValue === 0 || isNaN(parsedValue)) {
    return defaultValue;
  }
  return parsedValue;
}

export function formatNumberPDF(valuePDF, useLakhFormat = true) {
  if (valuePDF === "N/A" || valuePDF === "Nil") {
    return valuePDF;
  }

  if (isNaN(valuePDF) || valuePDF === null || valuePDF === undefined) {
    return "Invalid Input";
  }

  valuePDF = parseFloat(valuePDF);
  let isNegative = valuePDF < 0;
  valuePDF = Math.abs(valuePDF);

  let lakhValue = valuePDF / 100000;
  let roundedValue = Math.round(lakhValue);

  let formattedValue = roundedValue.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  if (isNegative) {
    formattedValue = "-" + formattedValue;
  }

  return formattedValue;
}

export function processValues(values) {
  let lessThanOneLakhFound = values.some((val) => {
    let num = parseFloat(val);
    return !isNaN(num) && num > 0 && num < 100000;
  });

  let formattedValues = values.map((val) => formatNumberPDF(val, true));

  return {
    lessThanOneLakhFound,
    formattedValues,
  };
}

// 0) Parse Float Function
export function safeParseFloat(value) {
  if (typeof value !== "string") {
    value = String(value);
  }
  const cleaned = value.replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
}

// 1) Calculate Total Duty
export function CalculateDuty(
  value1 = 0,
  value2 = 0,
  value3 = 0,
  value4 = 0,
  value5 = 0,
  value6 = 0
) {
  return (
    safeParseFloat(value1) +
    safeParseFloat(value2) +
    safeParseFloat(value3) +
    safeParseFloat(value4) +
    safeParseFloat(value5) +
    safeParseFloat(value6)
  );
}

// 2) Calculate Depreciation of value
export function calculateDepreciationValue(value, grossIntendedPeriod) {
  let result = 0;
  let h = 100;
  // `P` was previously assigned with no declaration (`P = 4`), creating an
  // implicit global in non-strict scripts. Harmless there since it was always
  // assigned before read within the same call, but it throws a ReferenceError
  // in strict-mode ES modules -- declare it explicitly instead.
  let P;
  for (let Q = 1; Q <= grossIntendedPeriod * 4; Q++) {
    if (Q >= 1 && Q <= 4) {
      P = 4;
      h -= P;
      if (h == 84) {
        result = value * (h / 100);
      }
    }
    if (Q >= 5 && Q <= 12) {
      P = 3;
      h -= P;
      if (h == 72 || h == 60) {
        result = value * (h / 100);
      }
    }
    if (Q >= 13 && Q <= 20) {
      P = 2.5;
      h -= P;
      if (h == 50 || h == 40) {
        result = value * (h / 100);
      }
    }
    if (Q >= 21 && Q <= 40) {
      P = 2;
      h -= P;
      if (h == 32 || h == 24 || h == 16 || h == 8 || h == 0) {
        result = value * (h / 100);
      }
    }
  }
  return result;
}

// 3) Calculate NPV
export function CalculateNPV(value, rateOfInterest, years) {
  const rate = safeParseFloat(rateOfInterest);
  const time = safeParseFloat(years);
  const principal = safeParseFloat(value);

  if (rate < 0 || time <= 0 || principal === 0) return 0;

  let discountFactor = 1;
  for (let i = 0; i < time; i++) {
    discountFactor *= rate / 100 + 1;
  }

  if (discountFactor === 0 || !isFinite(discountFactor)) return 0;

  return Math.round(principal / discountFactor);
}

// 4) Calculate Growth for value till number of years
export function CalculateGrowth(value, growthRate, years) {
  let result = 0;
  for (let i = 0; i < years; i++) {
    if (i == 0) {
      value = value;
    } else {
      value = value * (1 + growthRate / 100);
    }
    result += value;
  }
  return result;
}
