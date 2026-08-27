(() => {
  // src/shared/errors.js
  function reportFatal(code, err) {
    const message = err && err.message || String(err);
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

  // src/calc/duty.js
  function getSafeFloatInput(elementId, defaultValue) {
    const rawValue = document.getElementById(elementId).value.trim();
    const parsedValue = parseFloat(rawValue);
    if (rawValue === "" || parsedValue === 0 || isNaN(parsedValue)) {
      return defaultValue;
    }
    return parsedValue;
  }
  function formatNumberPDF(valuePDF, useLakhFormat = true) {
    if (valuePDF === "N/A" || valuePDF === "Nil") {
      return valuePDF;
    }
    if (isNaN(valuePDF) || valuePDF === null || valuePDF === void 0) {
      return "Invalid Input";
    }
    valuePDF = parseFloat(valuePDF);
    let isNegative = valuePDF < 0;
    valuePDF = Math.abs(valuePDF);
    let lakhValue = valuePDF / 1e5;
    let roundedValue = Math.round(lakhValue);
    let formattedValue = roundedValue.toLocaleString("en-IN", {
      maximumFractionDigits: 0
    });
    if (isNegative) {
      formattedValue = "-" + formattedValue;
    }
    return formattedValue;
  }
  function processValues(values) {
    let lessThanOneLakhFound = values.some((val) => {
      let num = parseFloat(val);
      return !isNaN(num) && num > 0 && num < 1e5;
    });
    let formattedValues = values.map((val) => formatNumberPDF(val, true));
    return {
      lessThanOneLakhFound,
      formattedValues
    };
  }
  function safeParseFloat(value) {
    if (typeof value !== "string") {
      value = String(value);
    }
    const cleaned = value.replace(/,/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
  }
  function CalculateDuty(value1 = 0, value2 = 0, value3 = 0, value4 = 0, value5 = 0, value6 = 0) {
    return safeParseFloat(value1) + safeParseFloat(value2) + safeParseFloat(value3) + safeParseFloat(value4) + safeParseFloat(value5) + safeParseFloat(value6);
  }
  function calculateDepreciationValue(value, grossIntendedPeriod2) {
    let result = 0;
    let h = 100;
    let P;
    for (let Q = 1; Q <= grossIntendedPeriod2 * 4; Q++) {
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
  function CalculateNPV(value, rateOfInterest2, years) {
    const rate = safeParseFloat(rateOfInterest2);
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
  function CalculateGrowth(value, growthRate, years) {
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

  // src/calc/reportManifest.js
  var REPORT_MANIFEST = /* @__PURE__ */ new Set([
    "AA.pdf",
    "AA_AIR.pdf",
    "AA_AIR_BR.pdf",
    "AA_AIR_BR_EOU.pdf",
    "AA_AIR_BR_EOU_MOOWR.pdf",
    "AA_AIR_BR_EOU_MOOWR_SEZ.pdf",
    "AA_AIR_BR_EOU_SEZ.pdf",
    "AA_AIR_BR_MOOWR.pdf",
    "AA_AIR_BR_MOOWR_SEZ.pdf",
    "AA_AIR_BR_SEZ.pdf",
    "AA_AIR_EOU.pdf",
    "AA_AIR_EOU_MOOWR.pdf",
    "AA_AIR_EOU_MOOWR_SEZ.pdf",
    "AA_AIR_EOU_SEZ.pdf",
    "AA_AIR_MOOWR.pdf",
    "AA_AIR_MOOWR_SEZ.pdf",
    "AA_AIR_SEZ.pdf",
    "AA_BR.pdf",
    "AA_BR_EOU.pdf",
    "AA_BR_EOU_MOOWR.pdf",
    "AA_BR_EOU_MOOWR_SEZ.pdf",
    "AA_BR_EOU_SEZ.pdf",
    "AA_BR_MOOWR.pdf",
    "AA_BR_MOOWR_SEZ.pdf",
    "AA_BR_SEZ.pdf",
    "AA_EOU.pdf",
    "AA_EOU_MOOWR.pdf",
    "AA_EOU_MOOWR_SEZ.pdf",
    "AA_EOU_SEZ.pdf",
    "AA_MOOWR.pdf",
    "AA_MOOWR_SEZ.pdf",
    "AA_SEZ.pdf",
    "AIR.pdf",
    "AIR_BR.pdf",
    "AIR_BR_EOU.pdf",
    "AIR_BR_EOU_MOOWR.pdf",
    "AIR_BR_EOU_MOOWR_SEZ.pdf",
    "AIR_BR_EOU_SEZ.pdf",
    "AIR_BR_MOOWR.pdf",
    "AIR_BR_MOOWR_SEZ.pdf",
    "AIR_BR_SEZ.pdf",
    "AIR_EOU.pdf",
    "AIR_EOU_MOOWR.pdf",
    "AIR_EOU_MOOWR_SEZ.pdf",
    "AIR_EOU_SEZ.pdf",
    "AIR_MOOWR.pdf",
    "AIR_MOOWR_SEZ.pdf",
    "AIR_SEZ.pdf",
    "BR.pdf",
    "BR_EOU.pdf",
    "BR_EOU_MOOWR.pdf",
    "BR_EOU_MOOWR_SEZ.pdf",
    "BR_EOU_SEZ.pdf",
    "BR_MOOWR.pdf",
    "BR_MOOWR_SEZ.pdf",
    "BR_SEZ.pdf",
    "EOU.pdf",
    "EOU_MOOWR.pdf",
    "EOU_MOOWR_SEZ.pdf",
    "EOU_SEZ.pdf",
    "MOOWR.pdf",
    "MOOWR_SEZ.pdf",
    "SEZ.pdf"
  ]);

  // src/calc/reportSelection.js
  function getCombinations(arr, size) {
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
  function findFinalFile(values, keys) {
    for (let size = keys.length; size >= 1; size--) {
      const combos = getCombinations(keys, size);
      for (const combo of combos) {
        const valList = combo.map((k) => values[k]);
        if (valList.some((v) => typeof v !== "number" || isNaN(v))) {
          continue;
        }
        const maxVal = Math.max(...valList);
        const allSameMax = valList.every((v) => v === maxVal);
        const otherKeys = keys.filter((k) => !combo.includes(k));
        const maxOutside = otherKeys.length ? Math.max(...otherKeys.map((k) => values[k])) : -Infinity;
        const isTrulyMax = maxVal >= maxOutside;
        if (allSameMax && isTrulyMax) {
          const fileName = combo.slice().sort().join("_") + ".pdf";
          if (!REPORT_MANIFEST.has(fileName)) {
            continue;
          }
          return {
            fileName,
            maxValue: maxVal,
            keys: combo
          };
        }
      }
    }
    return null;
  }
  function parseNumberWithCommas(val) {
    if (typeof val !== "string") return NaN;
    const cleaned = val.replace(/,/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? NaN : num;
  }

  // src/calc/pipeline.js
  var grossCIF;
  var grossBCD;
  var grossSGD;
  var grossCWD;
  var grossAIDC;
  var grossADD;
  var grossIGST;
  var grossDisposal;
  var grossIntendedPeriod;
  var GrossSWS;
  var grossCIF2;
  var grossBCD2;
  var grossSGD2;
  var grossCWD2;
  var grossAIDC2;
  var grossADD2;
  var GrossSWS2;
  var domesticCapitalGoods;
  var GrossRawCIF;
  var GrossRawBCD;
  var GrossRawSWS;
  var GrossRawAIDC;
  var GrossRawADD;
  var GrossRawSGD;
  var GrossRawCWD;
  var GrossRawIGST;
  var GrossRawCIF2;
  var GrossRawBCD2;
  var GrossRawAIDC2;
  var GrossRawADD2;
  var GrossRawSGD2;
  var GrossRawCWD2;
  var GrossRawSWS2;
  var GrossRawIGST2;
  var DomesticRawMaterialValueSEZ;
  var DomesticRawMaterialValueDomesticSale;
  var GrossRawDomesticCIF;
  var GrossRawDomesticBCD;
  var GrossRawDomesticSWS;
  var GrossRawDomesticAIDC;
  var GrossRawDomesticADD;
  var GrossRawDomesticSGD;
  var GrossRawDomesticCWD;
  var ExpectedAnnualGrowth;
  var rateOfInterest;
  var timeGap;
  var annualValueofRoDTEP;
  var GrossAnnualValue;
  var conversionOfRaw;
  var exportSales;
  var domesticSales;
  var deemedExport;
  async function getAllInputValues() {
    grossCIF = safeParseFloat(document.getElementById("first-left-input").value);
    grossBCD = safeParseFloat(document.getElementById("first-right-input").value);
    grossSGD = safeParseFloat(document.getElementById("sgd").value);
    grossCWD = safeParseFloat(document.getElementById("cwd").value);
    grossAIDC = safeParseFloat(
      document.getElementById("second-left-input").value
    );
    grossADD = safeParseFloat(
      document.getElementById("second-right-input").value
    );
    grossIGST = safeParseFloat(document.getElementById("third-left-input").value);
    grossIntendedPeriod = getSafeFloatInput("fourth-left-input", 10);
    grossDisposal = document.getElementById("third-right-input").value;
    if (grossDisposal == "Choose") {
      grossDisposal = "Sale in DTA";
    }
    GrossSWS = safeParseFloat(safeParseFloat(grossBCD) * 0.1);
    grossCIF2 = safeParseFloat(
      document.getElementById("Dfirst-left-input").value
    );
    grossBCD2 = safeParseFloat(
      document.getElementById("Dfirst-right-input").value
    );
    grossSGD2 = safeParseFloat(document.getElementById("Dsgd").value);
    grossCWD2 = safeParseFloat(document.getElementById("Dcwd").value);
    grossAIDC2 = safeParseFloat(
      document.getElementById("Dsecond-left-input").value
    );
    grossADD2 = safeParseFloat(
      document.getElementById("Dsecond-right-input").value
    );
    GrossSWS2 = parseFloat(safeParseFloat(grossBCD2) * 10 / 100);
    domesticCapitalGoods = safeParseFloat(
      document.getElementById("domesticCapitalGoods").value
    );
    GrossRawCIF = safeParseFloat(
      document.getElementById("first-left-input2").value
    );
    GrossRawBCD = safeParseFloat(
      document.getElementById("first-right-input2").value
    );
    GrossRawSWS = parseFloat(safeParseFloat(GrossRawBCD) * 10 / 100);
    GrossRawAIDC = safeParseFloat(
      document.getElementById("second-left-input2").value
    );
    GrossRawADD = safeParseFloat(
      document.getElementById("second-right-input2").value
    );
    GrossRawSGD = safeParseFloat(document.getElementById("sgd2").value);
    GrossRawCWD = safeParseFloat(document.getElementById("cwd2").value);
    GrossRawIGST = safeParseFloat(
      document.getElementById("third-left-input2").value
    );
    GrossRawCIF2 = safeParseFloat(
      document.getElementById("first-left-input22").value
    );
    GrossRawBCD2 = safeParseFloat(
      document.getElementById("first-right-input22").value
    );
    GrossRawAIDC2 = safeParseFloat(
      document.getElementById("second-left-input22").value
    );
    GrossRawADD2 = safeParseFloat(
      document.getElementById("second-right-input22").value
    );
    GrossRawSGD2 = safeParseFloat(document.getElementById("sgd22").value);
    GrossRawCWD2 = safeParseFloat(document.getElementById("cwd22").value);
    GrossRawIGST2 = safeParseFloat(
      document.getElementById("third-left-input22").value
    );
    GrossRawSWS2 = parseFloat(safeParseFloat(GrossRawBCD2) * 10 / 100);
    GrossRawDomesticCIF = safeParseFloat(
      document.getElementById("GrossRawDomesticCIF").value
    );
    GrossRawDomesticBCD = safeParseFloat(
      document.getElementById("GrossRawDomesticBCD").value
    );
    GrossRawDomesticSWS = parseFloat(
      safeParseFloat(GrossRawDomesticBCD) * 10 / 100
    );
    GrossRawDomesticAIDC = safeParseFloat(
      document.getElementById("GrossRawDomesticAIDC").value
    );
    GrossRawDomesticADD = safeParseFloat(
      document.getElementById("GrossRawDomesticADD").value
    );
    GrossRawDomesticSGD = safeParseFloat(
      document.getElementById("GrossRawDomesticSGD").value
    );
    GrossRawDomesticCWD = safeParseFloat(
      document.getElementById("GrossRawDomesticCWD").value
    );
    DomesticRawMaterialValueDomesticSale = safeParseFloat(
      document.getElementById("DomesticRawMaterialValueDomesticSale").value
    );
    DomesticRawMaterialValueSEZ = safeParseFloat(
      document.getElementById("DomesticRawMaterialValueSEZ").value
    );
    ExpectedAnnualGrowth = getSafeFloatInput("first-right-input3", 5);
    domesticSales = safeParseFloat(
      document.getElementById("domestic-sales").value
    );
    exportSales = safeParseFloat(document.getElementById("export-sales").value);
    rateOfInterest = getSafeFloatInput("second-left-input3", 9);
    timeGap = getSafeFloatInput("second-right-input3", 35);
    annualValueofRoDTEP = safeParseFloat(
      document.getElementById("third-left-input3").value
    );
    GrossAnnualValue = safeParseFloat(
      document.getElementById("third-right-input3").value
    );
    conversionOfRaw = getSafeFloatInput("fourth-right-input3", 60);
    deemedExport = safeParseFloat(
      document.getElementById("fifth-left-input5").value
    );
    gstOnConstruction = safeParseFloat(
      document.getElementById("gstOnConstruction").value
    );
    constOfDuty = safeParseFloat(document.getElementById("constOfDuty").value);
    SEZsale = safeParseFloat(document.getElementById("SEZsale").value);
    igstOnprcuredvalue = safeParseFloat(
      document.getElementById("igstOnprcuredvalue").value
    );
    igstOnImportServices = safeParseFloat(
      document.getElementById("igstOnImportServices").value
    );
    let totalDuty = CalculateDuty(
      safeParseFloat(GrossSWS),
      safeParseFloat(grossBCD),
      safeParseFloat(grossADD),
      safeParseFloat(grossAIDC),
      safeParseFloat(grossSGD),
      safeParseFloat(grossCWD)
    );
    let totalDutyandIGST = CalculateDuty(totalDuty, grossIGST);
    let EPCGValue = "Nil";
    let TotalImportedRawMaterialsForNYears1 = CalculateGrowth(
      GrossRawCIF,
      5,
      grossIntendedPeriod
    );
    let TotalImportedRawMaterialsForNYears2 = CalculateGrowth(
      GrossRawCIF2,
      5,
      grossIntendedPeriod
    );
    let TotalExport = CalculateGrowth(exportSales, 5, grossIntendedPeriod) + CalculateGrowth(SEZsale, 5, grossIntendedPeriod) + CalculateGrowth(deemedExport, 5, grossIntendedPeriod);
    let TotalImport = grossCIF + TotalImportedRawMaterialsForNYears1 + TotalImportedRawMaterialsForNYears2;
    let ExportObligationForEPCG = totalDutyandIGST * 6;
    let TotalExportForSixYears = CalculateGrowth(
      exportSales + SEZsale + deemedExport,
      5,
      6
    );
    if (ExportObligationForEPCG < TotalExportForSixYears) {
      EPCGValue = "Nil";
    }
    if (ExportObligationForEPCG > TotalExportForSixYears) {
      let unfulfilledEO = ExportObligationForEPCG - TotalExportForSixYears;
      let ratioOfUnfulfilledEO = unfulfilledEO / ExportObligationForEPCG * 100;
      let unfulfilledEOUnderEPCG = totalDuty * ratioOfUnfulfilledEO / 100;
      let IGSTPayableatSeventhYear = grossIGST * ratioOfUnfulfilledEO / 100;
      let EPCGInterest = (unfulfilledEOUnderEPCG + IGSTPayableatSeventhYear) * 15 / 100 * 7;
      let totalCostOfRedemption = unfulfilledEOUnderEPCG + EPCGInterest;
      let NPVOFcostofRedemption = CalculateNPV(
        totalCostOfRedemption,
        rateOfInterest,
        7
      );
      EPCGValue = NPVOFcostofRedemption * -1;
    }
    let RowTwoThirdCell = 0;
    if (grossDisposal === "Sale in DTA") {
      RowTwoThirdCell = CalculateNPV(totalDuty, rateOfInterest, grossIntendedPeriod) * -1;
    } else if (grossDisposal === "Destroy") {
      RowTwoThirdCell = 0;
    } else if (grossDisposal === "Export") {
      RowTwoThirdCell = 0;
    } else {
      RowTwoThirdCell = 0;
    }
    RowTwoThirdCell = safeParseFloat(RowTwoThirdCell);
    let EOUValue = "N/A";
    let NFE = TotalExport - TotalImport;
    if (NFE < 0) {
      EOUValue = "N/A";
    } else if (NFE > 0 && grossIntendedPeriod < 10) {
      let totalDutyDepre = calculateDepreciationValue(
        totalDuty,
        grossIntendedPeriod
      );
      EOUValue = CalculateNPV(totalDutyDepre, rateOfInterest, grossIntendedPeriod) * -1;
    } else if (NFE > 0 && grossIntendedPeriod >= 10) {
      EOUValue = 0;
    } else {
      EOUValue = "N/A";
    }
    let totalSavings = safeParseFloat(grossIGST) * (safeParseFloat(rateOfInterest) / 100) * (safeParseFloat(timeGap) / 365);
    const AIRAccuredOnDTA = domesticCapitalGoods * 1.5 / 100;
    let DutySavedOnDomesticalyProcuredCPNetAIR;
    const DutySavedOnDomesticalyProcuredCP = grossBCD2 + GrossSWS2 + grossAIDC2 + grossADD2 + grossSGD2 + grossCWD2;
    DutySavedOnDomesticalyProcuredCPNetAIR = DutySavedOnDomesticalyProcuredCP - AIRAccuredOnDTA;
    let DCGValue = 0;
    let DCG = domesticCapitalGoods;
    let BCDISWS = domesticCapitalGoods * (11 / 100);
    let DCGANDBCDISWSIGST = (DCG + BCDISWS) * (18 / 100);
    let TOTALDUTYINCLUDINGIGST = BCDISWS + DCGANDBCDISWSIGST;
    let EOFORDCG = TOTALDUTYINCLUDINGIGST * 6;
    if (EOFORDCG > TotalExportForSixYears) {
      let unfulfilledEOFORDCG = EOFORDCG - TotalExportForSixYears;
      let ratioOfUnfulfilledFORDCG = unfulfilledEOFORDCG / EOFORDCG * 100;
      let DOCOTIGSTPAEO7Y = BCDISWS * (ratioOfUnfulfilledFORDCG / 100);
      let IGSTPayableatSeventhYear = DCGANDBCDISWSIGST * ratioOfUnfulfilledFORDCG / 100;
      let DCGInterest = (DOCOTIGSTPAEO7Y + IGSTPayableatSeventhYear) * 15 / 100 * 7;
      let totalCostOfRedemption = DOCOTIGSTPAEO7Y + DCGInterest;
      let NPVOFcostofRedemption = CalculateNPV(
        totalCostOfRedemption,
        rateOfInterest,
        7
      );
      DCGValue = NPVOFcostofRedemption;
    }
    let RawTotalDuty = CalculateDuty(
      safeParseFloat(GrossRawBCD),
      safeParseFloat(GrossRawSWS),
      safeParseFloat(GrossRawAIDC),
      safeParseFloat(GrossRawADD),
      safeParseFloat(GrossRawSGD),
      safeParseFloat(GrossRawCWD)
    );
    let E = 0;
    let totalBenifit = 0;
    let lastNPV = 0;
    let npv;
    let tempRaw = RawTotalDuty;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalBenifit = tempRaw * (parseFloat(safeParseFloat(conversionOfRaw)) / 365) * (parseFloat(safeParseFloat(rateOfInterest)) / 100);
      if (E == 0) {
        E = safeParseFloat(rateOfInterest) / 100 + 1;
      } else {
        E = E * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npv = totalBenifit / E;
      lastNPV += npv;
      tempRaw = tempRaw * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    let Digst = 0;
    let totalBenifitigst = 0;
    let lastNPVigst = 0;
    let npvigst;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalBenifitigst = safeParseFloat(GrossRawIGST) * (parseFloat(safeParseFloat(timeGap)) / 365) * (parseFloat(safeParseFloat(rateOfInterest)) / 100);
      if (Digst == 0) {
        Digst = safeParseFloat(rateOfInterest) / 100 + 1;
      } else {
        Digst = Digst * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npvigst = totalBenifitigst / Digst;
      lastNPVigst += npvigst;
      GrossRawIGST = GrossRawIGST * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    let RawTotalDuty2 = safeParseFloat(GrossRawBCD2) + safeParseFloat(GrossRawSWS2) + safeParseFloat(GrossRawAIDC2) + safeParseFloat(GrossRawADD2) + safeParseFloat(GrossRawSGD2) + safeParseFloat(GrossRawCWD2);
    const totalDutyOnRMGE = GrossRawBCD + GrossRawSWS + GrossRawSGD + GrossRawAIDC + GrossRawADD + GrossRawCWD;
    let DF = 0;
    let finishedGoods = 0;
    let lastNPVF = 0;
    let npvF;
    finishedGoods = exportSales / (domesticSales + exportSales) * totalDutyOnRMGE;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      if (DF == 0) {
        DF = 1 + safeParseFloat(rateOfInterest) / 100;
      } else {
        DF = DF * (rateOfInterest / 100 + 1);
      }
      npvF = finishedGoods / DF;
      lastNPVF += npvF;
      finishedGoods = finishedGoods * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    lastNPVF = safeParseFloat(lastNPVF);
    let E2 = 0;
    let totalBenifit2 = 0;
    let lastNPV2 = 0;
    let npv2;
    let tempRaw2 = RawTotalDuty2;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalBenifit2 = tempRaw2 * (parseFloat(safeParseFloat(conversionOfRaw)) / 365) * (parseFloat(safeParseFloat(rateOfInterest)) / 100);
      if (E2 == 0) {
        E2 = safeParseFloat(rateOfInterest) / 100 + 1;
      } else {
        E2 = E2 * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npv2 = totalBenifit2 / E2;
      lastNPV2 += npv2;
      tempRaw2 = tempRaw2 * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    let Digst2 = 0;
    let totalBenifitigst2 = 0;
    let lastNPVigst2 = 0;
    let npvigst2;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalBenifitigst2 = safeParseFloat(GrossRawIGST2) * (parseFloat(safeParseFloat(timeGap)) / 365) * (parseFloat(safeParseFloat(rateOfInterest)) / 100);
      if (Digst2 == 0) {
        Digst2 = safeParseFloat(rateOfInterest) / 100 + 1;
      } else {
        Digst2 = Digst2 * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npvigst2 = totalBenifitigst2 / Digst2;
      lastNPVigst2 += npvigst2;
      GrossRawIGST2 = GrossRawIGST2 * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    let RawTotalDuty3 = safeParseFloat(GrossRawDomesticBCD) + safeParseFloat(GrossRawDomesticSWS) + safeParseFloat(GrossRawDomesticAIDC) + safeParseFloat(GrossRawDomesticADD) + safeParseFloat(GrossRawDomesticSGD) + safeParseFloat(GrossRawDomesticCWD);
    const AIRAccuredOnDTARawMaterial = DomesticRawMaterialValueSEZ * 1.5 / 100;
    const AIRAccuredOnDTARawMaterial2 = DomesticRawMaterialValueDomesticSale * 1.5 / 100;
    let AIRAccuredOnTARawMaterial = CalculateDuty(
      AIRAccuredOnDTARawMaterial,
      AIRAccuredOnDTARawMaterial2
    );
    let DRM = 0;
    let lastNPVDRM = 0;
    let npvDRM;
    let tempAIRAccuredOnTARawMaterial = AIRAccuredOnTARawMaterial;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      if (DRM == 0) {
        DRM = safeParseFloat(rateOfInterest) / 100 + 1;
      } else {
        DRM = DRM * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npvDRM = tempAIRAccuredOnTARawMaterial / DRM;
      lastNPVDRM += npvDRM;
      tempAIRAccuredOnTARawMaterial = tempAIRAccuredOnTARawMaterial * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    let DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR;
    const DutySavedOnDomesticalyProcuredCPRawMaterial = GrossRawDomesticBCD + GrossRawDomesticSWS + GrossRawDomesticAIDC + GrossRawDomesticADD + GrossRawDomesticSGD + GrossRawDomesticCWD;
    let E3 = 0;
    let lastNPV3 = 0;
    let npv3;
    let tempRaw3 = DutySavedOnDomesticalyProcuredCPRawMaterial;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      if (E3 == 0) {
        E3 = 1 + safeParseFloat(rateOfInterest) / 100;
      } else {
        E3 = E3 * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npv3 = tempRaw3 / E3;
      lastNPV3 += npv3;
      tempRaw3 = tempRaw3 * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR = lastNPV3 - lastNPVDRM;
    if (lastNPV3 > lastNPVDRM) {
      DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR = DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR;
    } else if (lastNPV3 < lastNPVDRM) {
      DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR = "N/A";
    }
    let igst = 0;
    let totalIgst = 0;
    let lastNpvIGST = 0;
    let NpvIgst;
    let CurrentIGST = (DomesticRawMaterialValueSEZ + DomesticRawMaterialValueDomesticSale) * 18 / 100;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalIgst = safeParseFloat(CurrentIGST) * (parseFloat(safeParseFloat(timeGap)) / 365) * (parseFloat(safeParseFloat(rateOfInterest)) / 100);
      if (igst == 0) {
        igst = 1 + safeParseFloat(rateOfInterest) / 100;
      } else {
        igst = igst * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      NpvIgst = totalIgst / igst;
      lastNpvIGST += NpvIgst;
      CurrentIGST = CurrentIGST * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    let Drodtep = 0;
    let npv4, npv5, npv6;
    let lastNPVrodtep = 0;
    let lastNPVtotalBenifit = 0;
    let totalBenifitrodtep = annualValueofRoDTEP;
    let lastNPVradtepAndAir = GrossAnnualValue;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      if (Drodtep == 0) {
        Drodtep = 1 + safeParseFloat(rateOfInterest) / 100;
      } else {
        Drodtep = Drodtep * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npv4 = totalBenifitrodtep / Drodtep;
      npv5 = lastNPVradtepAndAir / Drodtep;
      lastNPVrodtep += npv4;
      lastNPVtotalBenifit += npv5;
      totalBenifitrodtep = totalBenifitrodtep * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
      lastNPVradtepAndAir = lastNPVradtepAndAir * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    lastNPVrodtep = lastNPVrodtep;
    lastNPVtotalBenifit = lastNPVtotalBenifit;
    let WCSOIGSTOISIAD = igstOnprcuredvalue + igstOnImportServices;
    let Digst1 = 0;
    let totalBenifitigst1 = 0;
    let lastNPVigst1 = 0;
    let npvigst1;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalBenifitigst1 = safeParseFloat(WCSOIGSTOISIAD) * (parseFloat(safeParseFloat(timeGap)) / 365) * (parseFloat(safeParseFloat(rateOfInterest)) / 100);
      if (Digst1 == 0) {
        Digst1 = safeParseFloat(rateOfInterest) / 100 + 1;
      } else {
        Digst1 = Digst1 * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npvigst1 = totalBenifitigst1 / Digst1;
      lastNPVigst1 += npvigst1;
      WCSOIGSTOISIAD = WCSOIGSTOISIAD * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    lastNPVigst1 = lastNPVigst1;
    let ACDPODSBSEZU = domesticSales - GrossRawCIF2;
    let Digst5 = 0;
    let totalBenifitigst5 = 0;
    let lastNPVigst5 = 0;
    let npvigst5;
    for (let i = 0; i < parseFloat(safeParseFloat(grossIntendedPeriod)); i++) {
      totalBenifitigst5 = safeParseFloat(ACDPODSBSEZU) * (parseFloat(safeParseFloat(10)) / 100);
      if (Digst5 == 0) {
        Digst5 = 1 + safeParseFloat(rateOfInterest) / 100;
      } else {
        Digst5 = Digst5 * (safeParseFloat(rateOfInterest) / 100 + 1);
      }
      npvigst5 = totalBenifitigst5 / Digst5;
      lastNPVigst5 += npvigst5 * -1;
      ACDPODSBSEZU = ACDPODSBSEZU * (safeParseFloat(ExpectedAnnualGrowth) / 100 + 1);
    }
    function normalizeValue(value) {
      if (value === "Nil" || value === "N/A" || value === null || value === void 0) {
        return 0;
      }
      return value;
    }
    function checkForValueLessthanZero(value) {
      if (value == -0) {
        return 0;
      }
      return value;
    }
    let NetBeniftForAA = normalizeValue(totalDuty) + normalizeValue(EPCGValue) + normalizeValue(totalSavings) + normalizeValue(DutySavedOnDomesticalyProcuredCP) + normalizeValue(DCGValue) + normalizeValue(lastNPV) + normalizeValue(lastNPVigst) + normalizeValue(lastNPVF) + normalizeValue(lastNPV3) + normalizeValue(lastNPVrodtep * 40 / 100);
    NetBeniftForAA = checkForValueLessthanZero(NetBeniftForAA);
    let NetBeniftForBR = normalizeValue(totalDuty) + normalizeValue(EPCGValue) + normalizeValue(totalSavings) + normalizeValue(DutySavedOnDomesticalyProcuredCP) + normalizeValue(DCGValue) + normalizeValue(lastNPVF) + normalizeValue(lastNPV3) + normalizeValue(lastNPVrodtep);
    NetBeniftForBR = checkForValueLessthanZero(NetBeniftForBR);
    let NetBeniftForMOOWR = normalizeValue(totalDuty) + normalizeValue(RowTwoThirdCell) + normalizeValue(totalSavings) + normalizeValue(lastNPV) + normalizeValue(lastNPVigst) + normalizeValue(lastNPVF) + normalizeValue(lastNPV2) + normalizeValue(lastNPVigst2);
    NetBeniftForMOOWR = checkForValueLessthanZero(NetBeniftForMOOWR);
    let NetBeniftForEOU = normalizeValue(EOUValue == "N/A" ? 0 : totalDuty) + normalizeValue(EOUValue == "N/A" ? 0 : EOUValue) + normalizeValue(EOUValue == "N/A" ? 0 : totalSavings) + normalizeValue(EOUValue == "N/A" ? 0 : DutySavedOnDomesticalyProcuredCP) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPV) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVigst) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVF) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVigst2) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPV3) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVrodtep * 40 / 100);
    NetBeniftForEOU = checkForValueLessthanZero(NetBeniftForEOU);
    let NetBeniftForSEZ = normalizeValue(EOUValue == "N/A" ? 0 : totalDuty) + normalizeValue(EOUValue == "N/A" ? 0 : EOUValue) + normalizeValue(EOUValue == "N/A" ? 0 : totalSavings) + normalizeValue(EOUValue == "N/A" ? 0 : AIRAccuredOnDTA) + normalizeValue(
      EOUValue == "N/A" ? 0 : DutySavedOnDomesticalyProcuredCPNetAIR
    ) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPV) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVigst) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVF) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPV2) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVigst2) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVDRM) + normalizeValue(
      EOUValue == "N/A" ? 0 : DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR
    ) + normalizeValue(EOUValue == "N/A" ? 0 : lastNpvIGST) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVrodtep * 40 / 100) + normalizeValue(EOUValue == "N/A" ? 0 : gstOnConstruction) + normalizeValue(EOUValue == "N/A" ? 0 : constOfDuty) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVigst1) + normalizeValue(EOUValue == "N/A" ? 0 : lastNPVigst5);
    NetBeniftForSEZ = checkForValueLessthanZero(NetBeniftForSEZ);
    let NetBeniftForAIR = normalizeValue(totalDuty) + normalizeValue(EPCGValue) + normalizeValue(totalSavings) + normalizeValue(DutySavedOnDomesticalyProcuredCP) + normalizeValue(DCGValue) + normalizeValue(lastNPVrodtep) + normalizeValue(lastNPVtotalBenifit);
    NetBeniftForAIR = checkForValueLessthanZero(NetBeniftForAIR);
    updatePDFAndDownload(
      // first row
      totalDuty,
      // second row
      EPCGValue,
      RowTwoThirdCell,
      EOUValue,
      // third row
      totalSavings,
      // fourth row
      AIRAccuredOnDTA,
      // fifth row
      DutySavedOnDomesticalyProcuredCP,
      DutySavedOnDomesticalyProcuredCPNetAIR,
      // sixth row
      DCGValue,
      // Seventh row
      lastNPV,
      // eighth row
      lastNPVigst,
      // Ninth row
      // lastNPVRawDuty,
      lastNPVF,
      // Tenth row
      lastNPV2,
      // eleventh row
      lastNPVigst2,
      // twelveth row
      lastNPVDRM,
      // thirteenth row
      lastNPV3,
      DutySavedOnDomesticalyProcuredCPRawMaterialNetAIR,
      // fourteen row
      lastNpvIGST,
      // Fifteen row
      lastNPVrodtep,
      // sixteenth row
      lastNPVtotalBenifit,
      // seventeenth row
      gstOnConstruction,
      // eighteenth row
      constOfDuty,
      // nineteenth row
      lastNPVigst1,
      // Twnenty row
      lastNPVigst5,
      // twenty first row
      NetBeniftForAA,
      NetBeniftForBR,
      NetBeniftForMOOWR,
      NetBeniftForEOU,
      NetBeniftForSEZ,
      NetBeniftForAIR
    ).catch((err) => reportFatal("pdf-generation", err));
  }
  async function updatePDFAndDownload(...args) {
    try {
      await updatePDFAndDownloadImpl(...args);
    } catch (err) {
      reportFatal("pdf-generation", err);
    }
  }
  async function updatePDFAndDownloadImpl(value0, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value13, value14, value15, value16, value17, value18, value19, value20, value21, value22, value23, value24, value25, value26, value27, value28, value29) {
    const allValues = [
      value0,
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
      value7,
      value8,
      value9,
      value10,
      value11,
      value12,
      value13,
      value14,
      value15,
      value16,
      value17,
      value18,
      value19,
      value20,
      value21,
      value22,
      value23,
      value24,
      value25,
      value26,
      value27,
      value28,
      value29
    ];
    function getSafeFormatted(index, fallbackCheckIndex) {
      return allValues[fallbackCheckIndex] === "N/A" ? "N/A" : formattedValues[index];
    }
    const { lessThanOneLakhFound, formattedValues } = processValues(allValues);
    const baseValues = {
      AA: formattedValues[24],
      BR: formattedValues[25],
      MOOWR: formattedValues[26],
      EOU: formattedValues[27],
      SEZ: formattedValues[28],
      AIR: formattedValues[29]
    };
    const X = value3;
    const keysAll = ["AA", "BR", "MOOWR", "EOU", "SEZ", "AIR"];
    const keys = X === "N/A" ? ["AA", "BR", "MOOWR", "AIR"] : keysAll;
    const baseValuesNum = {};
    for (const key of Object.keys(baseValues)) {
      baseValuesNum[key] = parseNumberWithCommas(baseValues[key]);
    }
    const result = findFinalFile(baseValuesNum, keys);
    if (!result) {
      throw new Error(
        "PIPELINE_NO_MATCHING_SCHEME_COMBINATION: no report template matches the given inputs"
      );
    }
    const REPORTS_BASE_BY_HOST = {
      "hackyvirus.github.io": "reports/"
    };
    let url = (REPORTS_BASE_BY_HOST[window.location.hostname] || "https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/reports/") + result.fileName;
    const existingPdfBytes = await fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(
          `PIPELINE_REPORT_FETCH_FAILED: ${res.status} ${res.statusText} for ${url}`
        );
      }
      return res.arrayBuffer();
    });
    isNaN(value2) ? value2 = 0 : value2 = value2;
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const today = /* @__PURE__ */ new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const reportTitle = `Report ${month} - ${year}`;
    const firstPage = pdfDoc.getPages()[0];
    const secondPage = pdfDoc.getPages()[3];
    const thirdPage = pdfDoc.getPages()[4];
    const helveticaBoldFont = await pdfDoc.embedFont(
      PDFLib.StandardFonts.HelveticaBold
    );
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    firstPage.drawText(reportTitle, {
      x: 45,
      y: 315,
      size: 24,
      font: helveticaBoldFont,
      color: PDFLib.rgb(1, 0, 0)
    });
    if (lessThanOneLakhFound) {
      secondPage.drawText(
        "where value is less than Rs.1 lakh then the result is shown as zero (0)",
        {
          x: 36,
          y: 474,
          size: 14,
          font: helveticaBoldFont,
          color: PDFLib.rgb(1, 0, 0)
        }
      );
    }
    secondPage.drawText(formattedValues[0].toString(), {
      x: 435,
      y: 410,
      size: 10,
      length: 20,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[0].toString(), {
      x: 500,
      y: 410,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[0].toString(), {
      x: 565,
      y: 410,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(0, 3).toString(), {
      x: 635,
      y: 410,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(0, 3).toString(), {
      x: 695,
      y: 410,
      size: 10,
      font,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[0].toString(), {
      x: 760,
      y: 410,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[1].toString(), {
      x: 435,
      y: 392,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[1].toString(), {
      x: 500,
      y: 392,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[2].toString(), {
      x: 565,
      y: 392,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(3, 3).toString(), {
      x: 635,
      y: 392,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(3, 3).toString(), {
      x: 695,
      y: 392,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[1].toString(), {
      x: 760,
      y: 392,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[4].toString(), {
      x: 435,
      y: 373,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[4].toString(), {
      x: 500,
      y: 373,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[4].toString(), {
      x: 565,
      y: 373,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(4, 3).toString(), {
      x: 635,
      y: 373,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(4, 3).toString(), {
      x: 695,
      y: 373,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[4].toString(), {
      x: 760,
      y: 373,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 335,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 335,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 335,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 335,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(5, 3).toString(), {
      x: 695,
      y: 335,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 335,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[6].toString(), {
      x: 435,
      y: 317,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[6].toString(), {
      x: 500,
      y: 317,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 317,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText("*".toString(), {
      x: 582,
      y: 313,
      size: 20,
      color: PDFLib.rgb(1, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(6, 3).toString(), {
      x: 635,
      y: 317,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(7, 3).toString(), {
      x: 695,
      y: 317,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[6].toString(), {
      x: 760,
      y: 317,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[8].toString(), {
      x: 435,
      y: 297,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[8].toString(), {
      x: 500,
      y: 297,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 297,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 297,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 695,
      y: 297,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[8].toString(), {
      x: 760,
      y: 297,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[9].toString(), {
      x: 435,
      y: 256,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 256,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[9].toString(), {
      x: 565,
      y: 256,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(9, 3).toString(), {
      x: 635,
      y: 256,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(9, 3).toString(), {
      x: 695,
      y: 256,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 256,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[10].toString(), {
      x: 435,
      y: 232,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 232,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[10].toString(), {
      x: 565,
      y: 232,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(10, 3).toString(), {
      x: 635,
      y: 232,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(10, 3).toString(), {
      x: 695,
      y: 232,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 232,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[11].toString(), {
      x: 435,
      y: 213,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[11].toString(), {
      x: 500,
      y: 213,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[11].toString(), {
      x: 565,
      y: 213,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(11, 3).toString(), {
      x: 635,
      y: 213,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(11, 3).toString(), {
      x: 695,
      y: 213,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 213,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 172,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 172,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[12].toString(), {
      x: 565,
      y: 172,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 172,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(12, 3).toString(), {
      x: 695,
      y: 172,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 172,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 148,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 148,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[13].toString(), {
      x: 565,
      y: 148,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(13, 3).toString(), {
      x: 635,
      y: 148,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(13, 3).toString(), {
      x: 695,
      y: 148,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 148,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 111,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 111,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 111,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 111,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(14, 3).toString(), {
      x: 695,
      y: 111,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 111,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[15].toString(), {
      x: 435,
      y: 92,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formattedValues[15].toString(), {
      x: 500,
      y: 92,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText("N/A".toString(), {
      x: 565,
      y: 92,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText("*".toString(), {
      x: 582,
      y: 89,
      size: 20,
      color: PDFLib.rgb(1, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(15, 3).toString(), {
      x: 635,
      y: 92,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(getSafeFormatted(16, 3).toString(), {
      x: 695,
      y: 92,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    secondPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 92,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 472,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 472,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 472,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 472,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(17, 3).toString(), {
      x: 695,
      y: 472,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 472,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    const safeValue = getSafeFormatted(18, 3);
    let percentageText = "N/A";
    if (safeValue !== "N/A") {
      const numericValue = parseFloat(safeValue);
      if (!isNaN(numericValue)) {
        percentageText = (numericValue / 40 * 100).toFixed(2);
      }
    }
    thirdPage.drawText((formattedValues[18] * 40 / 100).toString(), {
      x: 435,
      y: 435,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[18].toString(), {
      x: 500,
      y: 435,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 435,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(percentageText.toString(), {
      x: 635,
      y: 435,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(percentageText.toString(), {
      x: 695,
      y: 435,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[18].toString(), {
      x: 760,
      y: 435,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 416,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 416,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 416,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 416,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 695,
      y: 416,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[19].toString(), {
      x: 760,
      y: 416,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 379,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 379,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 379,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 379,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(20, 3).toString(), {
      x: 695,
      y: 379,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 379,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 360,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 360,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 360,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 360,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(21, 3).toString(), {
      x: 695,
      y: 360,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 360,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 336,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 336,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 336,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 336,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(22, 3).toString(), {
      x: 695,
      y: 336,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 336,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 435,
      y: 314,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 500,
      y: 314,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 565,
      y: 314,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 635,
      y: 314,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(23, 3).toString(), {
      x: 695,
      y: 314,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formatNumberPDF("N/A").toString(), {
      x: 760,
      y: 314,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[24].toString(), {
      x: 435,
      y: 295,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[25].toString(), {
      x: 500,
      y: 295,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[26].toString(), {
      x: 565,
      y: 295,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(27, 3).toString(), {
      x: 635,
      y: 295,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(getSafeFormatted(28, 3).toString(), {
      x: 695,
      y: 295,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    thirdPage.drawText(formattedValues[29].toString(), {
      x: 760,
      y: 295,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
      font
    });
    const pdfBytes = await pdfDoc.save();
    try {
      localStorage.setItem("sharedPDF", JSON.stringify(Array.from(pdfBytes)));
    } catch (storageErr) {
      throw new Error(
        `PIPELINE_PDF_STORAGE_FAILED: ${storageErr && storageErr.message || storageErr}`
      );
    }
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const finalUrl = pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0";
    window.finalPdfUrl = finalUrl;
    if (typeof window.onPdfReady === "function") {
      window.onPdfReady(finalUrl);
    }
  }

  // src/entries/main.entry.js
  window.getAllInputValues = getAllInputValues;
})();
