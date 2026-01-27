import React, { useState, useEffect } from "react";
import { RotateCcw, Download, FileText, Upload, X } from "lucide-react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import JSZip from "jszip";
import "./GSTInvoiceGenerator.css";

export default function GSTInvoiceGenerator() {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [activeCsv, setActiveCsv] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [generatedInvoices, setGeneratedInvoices] = useState([]);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [sampleType, setSampleType] = useState(null);

  const CSV1_COLUMNS = [
    "invoice_no",
    "date",
    "order_id",
    "tour/trip",
    "customer_pan",
    "customer_gst",
    "customer_address [Name.city.state]",
    "unit",
    "price",
    "dollar_rate",
    "gst",
  ];

  const CSV2_COLUMNS = [
    "plan_name",
    "passenger_name",
    "identity_type",
    "identity_no",
    "icc_id",
    "invoice_no",
  ];

  const SAMPLE_CSV1 = [
    {
      invoice_no: "inv123456",
      date: "24.12.2025",
      order_id: "0536a2f0-1f3c-40d7-bd51-608c2107a8a7",
      "tour/trip": "1d thailand",
      customer_pan: "ABCDE1234F",
      customer_gst: "09ABCDE1234F1Z1",
      customer_address: "KULSHAAN SINGH.Faridabad.Haryana.India.121001",
      unit: 2,
      price: 720,
      dollar_rate: 83.5,
      gst: 18,
    },
    {
      invoice_no: "inv123457",
      date: "24.12.2025",
      order_id: "0536a2f0-1f3c-40d7-bd51-608c2107a8a8",
      "tour/trip": "5d thailand",
      customer_pan: "ABCDE1234G",
      customer_gst: "09ABCDE1234F1P2",
      customer_address: "RAHUL SINGH.GHAZIABAD.UP.India.201005",
      unit: 3,
      price: 620,
      dollar_rate: 84.5,
      gst: 9,
    },
  ];

  const SAMPLE_CSV2 = [
    {
      plan_name: "eSim - IND-THA, 2GB/Day, 5days",
      invoice_no: "inv123456",
      passenger_name: "AAAAA",
      identity_type: "pp",
      identity_no: "128047800",
      icc_id: "Z-8948010000074359605",
    },
    {
      plan_name: "",
      invoice_no: "inv123456",
      passenger_name: "BBBBB",
      identity_type: "pp",
      identity_no: "128047801",
      icc_id: "Z-8948010000074359606",
    },
    {
      plan_name: "",
      invoice_no: "inv123456",
      passenger_name: "CCCCC",
      identity_type: "pp",
      identity_no: "128047802",
      icc_id: "Z-8948010000074359607",
    },
    {
      plan_name: "eSim - IND-THA, 1GB/Day, 5days",
      invoice_no: "inv123457",
      passenger_name: "DDDDD",
      identity_type: "pp",
      identity_no: "128047803",
      icc_id: "Z-8948010000074359605",
    },
    {
      plan_name: "",
      invoice_no: "inv123457",
      passenger_name: "EEEEE",
      identity_type: "pp",
      identity_no: "128047804",
      icc_id: "Z-8948010000074359606",
    },
    {
      plan_name: "",
      invoice_no: "inv123457",
      passenger_name: "FFFFF",
      identity_type: "pp",
      identity_no: "128047805",
      icc_id: "Z-8948010000074359607",
    },
  ];

  function downloadSampleCsv(type) {
    const data = type === "csv1" ? SAMPLE_CSV1 : SAMPLE_CSV2;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const fileName =
      type === "csv1" ? "sample_invoice_data.csv" : "sample_passenger_data.csv";
    saveAs(blob, fileName);
  }

  const [csv1, setCsv1] = useState(null);
  const [csv2, setCsv2] = useState(null);
  const [rows1, setRows1] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [pdfList, setPdfList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDownloadAll() {
    if (!pdfList.length) {
      alert("No PDFs to download");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("GST_Invoices");

    pdfList.forEach((pdf) => {
      folder.file(pdf.name, pdf.blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "GST_Invoices.zip");
  }

  useEffect(() => {
    const shouldLockScroll = showColumnModal || showModal || showSampleModal;
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showColumnModal, showModal, showSampleModal]);

  function parseUniversalFile(file, setRowsFn) {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          setRowsFn(res.data);
        },
        error: (err) => {
          console.error("CSV parse error", err);
          alert("Invalid CSV file");
        },
      });
      return;
    }

    if (ext === "xls" || ext === "xlsx") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
          dateNF: "dd.mm.yyyy",
        });
        setRowsFn(json);
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    alert("Unsupported file type. Upload CSV or Excel file only.");
  }

  function resetBox() {
    setCsv1(null);
    setCsv2(null);
    setRows1([]);
    setRows2([]);
    setPdfList([]);
    setLoading(false);
    setFileInputKey(Date.now());
  }

  function addFiveDays(dateStr) {
    if (!dateStr) return "";
    let date = null;

    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split(".");
      date = new Date(Number(year), Number(month) - 1, Number(day));
    }

    if (!date || isNaN(date.getTime())) {
      const native = new Date(dateStr);
      if (!isNaN(native.getTime())) {
        date = native;
      }
    }

    if (!date || isNaN(date.getTime())) {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const [day, mon, yr] = parts;
        const monthMap = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };
        if (monthMap[mon] !== undefined) {
          const year = yr.length === 2 ? Number("20" + yr) : Number(yr);
          date = new Date(year, monthMap[mon], Number(day));
        }
      }
    }

    if (!date || isNaN(date.getTime())) {
      console.warn("Invalid invoice date:", dateStr);
      return "";
    }

    date.setDate(date.getDate() + 3);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  function splitAddress(address) {
    if (!address) return [];

    if (!/[.,]/.test(address)) {
      return [address.trim()];
    }

    let normalized = address.replace(/\./g, ",");
    return normalized
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function embedImage(pdfDoc, relativePath) {
    const url = new URL(relativePath, import.meta.url);
    const res = await fetch(url);
    const bytes = await res.arrayBuffer();
    const b = new Uint8Array(bytes);
    const isPNG = b[0] === 0x89 && b[1] === 0x50;
    const isJPG = b[0] === 0xff && b[1] === 0xd8;

    if (isPNG) return await pdfDoc.embedPng(bytes);
    if (isJPG) return await pdfDoc.embedJpg(bytes);

    throw new Error(`${relativePath} is not a valid PNG/JPEG`);
  }

  function numberToWords(num) {
    if (num === 0) return "Zero";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function convert(n) {
      if (n < 20) return ones[n];
      if (n < 100) {
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      }
      if (n < 1000) {
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + convert(n % 100) : "")
        );
      }
      if (n < 100000) {
        return (
          convert(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + convert(n % 1000) : "")
        );
      }
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    }

    return convert(num).trim();
  }

  async function generateStaticInvoiceExact(csv1, rows2) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const blue = rgb(0.23, 0.32, 0.55);
    const black = rgb(0, 0, 0);

    const FIXED_GSTIN = "09AAHCC5468N1ZY";
    const FIXED_PAN = "AAHCC5468N";

    let y = 800;

    const logoImg = await embedImage(pdfDoc, "./img/logo.png");
    const qrImg = await embedImage(pdfDoc, "./img/qr_code.png");
    const signImg = await embedImage(pdfDoc, "./img/signature.png");

    page.drawImage(logoImg, {
      x: 40,
      y: 775,
      width: 140,
      height: 55,
    });

    const title = "TAX INVOICE";
    const titleSize = 18;
    const titleWidth = bold.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (595 - titleWidth) / 2,
      y: 800,
      size: titleSize,
      font: bold,
    });

    page.drawText("Invoice No.", { x: 315, y: y - 70, size: 9, font });
    page.drawText(String(csv1.invoice_no || ""), {
      x: 390,
      y: y - 70,
      size: 9,
      font: bold,
    });

    page.drawText("Date", {
      x: 315,
      y: y - 85,
      size: 9,
      font,
    });
    page.drawText(String(csv1.date || ""), {
      x: 390,
      y: y - 85,
      size: 9,
      font: bold,
    });

    page.drawText("Due Date", { x: 315, y: y - 100, size: 9, font });
    page.drawText(csv1.date ? addFiveDays(csv1.date) : "", {
      x: 390,
      y: y - 100,
      size: 9,
      font: bold,
    });

    y -= 80;
    page.drawRectangle({ x: 40, y, width: 200, height: 18, color: blue });
    page.drawText("Provider", {
      x: 46,
      y: y + 5,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y -= 18;
    page.drawText("ConnectingIT Technologies Pvt. Ltd.", {
      x: 40,
      y,
      size: 9,
      font: bold,
    });
    y -= 14;
    page.drawText("Plot No 20 , 2nd Floor", { x: 40, y, size: 9, font });
    y -= 14;
    page.drawText("TechZone 7, Greater Noida West", {
      x: 40,
      y,
      size: 9,
      font,
    });
    y -= 14;
    page.drawText("Gautam Buddha Nagar, U.P. 203207", {
      x: 40,
      y,
      size: 9,
      font,
    });

    let ry = y + 10;
    page.drawText("Order ID", { x: 315, y: ry, size: 9, font });
    page.drawText(String(csv1.order_id || ""), {
      x: 390,
      y: ry,
      size: 9,
      font,
    });

    ry -= 14;
    page.drawText("GSTIN", { x: 315, y: ry, size: 9, font });
    page.drawText(FIXED_GSTIN, { x: 390, y: ry, size: 9, font });

    ry -= 14;
    page.drawText("PAN", { x: 315, y: ry, size: 9, font });
    page.drawText(FIXED_PAN, { x: 390, y: ry, size: 9, font });

    ry -= 14;
    page.drawText("State Code", { x: 315, y: ry + 1, size: 9, font });
    page.drawText("09", { x: 390, y: ry, size: 9, font });

    ry -= 14;
    page.drawText("Tour/Trip", { x: 315, y: ry, size: 9, font });
    page.drawText(String(csv1.tour_trip || ""), {
      x: 390,
      y: ry,
      size: 9,
      font,
    });

    ry -= 30;
    page.drawText("Customer PAN", { x: 315, y: ry, size: 9, font });
    page.drawText(csv1.customer_pan || "", { x: 390, y: ry, size: 9, font });

    ry -= 14;
    page.drawText("Customer GST", { x: 315, y: ry, size: 9, font });
    page.drawText(csv1.customer_gst || "", { x: 390, y: ry, size: 9, font });

    y -= 30;
    page.drawRectangle({ x: 40, y, width: 200, height: 18, color: blue });
    page.drawText("Billed No.", {
      x: 46,
      y: y + 5,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });

    const addressLines = splitAddress(csv1.customer_address);
    const startY = y;

    page.drawText(addressLines[0] || "", {
      x: 40,
      y: startY - 15,
      size: 9,
      font: bold,
    });
    page.drawText(addressLines[1] || "", {
      x: 40,
      y: startY - 30,
      size: 9,
      font,
    });
    page.drawText(addressLines[2] || "", {
      x: 40,
      y: startY - 40,
      size: 9,
      font,
    });
    page.drawText(addressLines[3] || "", {
      x: 40,
      y: startY - 60,
      size: 9,
      font,
    });
    page.drawText(addressLines[4] || "", {
      x: 80,
      y: startY - 60,
      size: 9,
      font,
    });
    page.drawText("India", { x: 40, y: startY - 50, size: 9, font });

    const tableTopY = 560;
    const rowH = 18;
    const xSno = 40;
    const snoW = 35;
    const descW = 315;
    const unitW = 40;
    const unitPriceW = 75;
    const amountW = 60;

    const xDesc = xSno + snoW;
    const xUnit = xDesc + descW;
    const xUnitPrice = xUnit + unitW;
    const xAmount = xUnitPrice + unitPriceW;
    const tableRight = xAmount + amountW;

    const tableHeight = 320;

    page.drawRectangle({
      x: xSno,
      y: tableTopY - tableHeight,
      width: tableRight - xSno,
      height: tableHeight,
      borderWidth: 1,
      color: undefined,
      borderColor: black,
    });

    [xDesc, xUnit, xUnitPrice, xAmount].forEach((x) => {
      page.drawLine({
        start: { x, y: tableTopY },
        end: { x, y: tableTopY - tableHeight },
      });
    });

    page.drawRectangle({
      x: xSno,
      y: tableTopY - rowH,
      width: tableRight - xSno,
      height: rowH,
      color: blue,
    });

    page.drawText("S.No.", {
      x: xSno + 6,
      y: tableTopY - 13,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText("DESCRIPTION", {
      x: xDesc + 80,
      y: tableTopY - 13,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText("UNIT", {
      x: xUnit + 10,
      y: tableTopY - 13,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText("UNIT PRICE", {
      x: xUnitPrice + 6,
      y: tableTopY - 13,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText("AMOUNT", {
      x: xAmount + 6,
      y: tableTopY - 13,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y = tableTopY - rowH - 14;
    page.drawText("1", { x: xSno + 12, y, size: 9, font });

    const planName = rows2[0]?.plan_name || "";
    page.drawText(planName, { x: xDesc + 6, y, size: 9, font });

    const invoiceUnit = Number(csv1.unit || 0);
    const unitPrice = Number(csv1.price || 0);
    const amount = invoiceUnit * unitPrice;

    page.drawText(String(invoiceUnit), { x: xUnit + 18, y, size: 9, font });
    page.drawText(`INR ${unitPrice.toFixed(2)}`, {
      x: xUnitPrice + 8,
      y,
      size: 9,
      font,
    });
    page.drawText(`INR ${amount.toFixed(2)}`, {
      x: xAmount + 5,
      y,
      size: 9,
      font,
    });

    const passTopY = y - 14;
    const pX = xDesc;
    const pCols = [127, 48, 45, 105];
    const pRowH = 13;
    const rows = rows2.length + 1;

    for (let i = 0; i <= rows; i++) {
      page.drawLine({
        start: { x: pX, y: passTopY - i * pRowH },
        end: { x: xUnit, y: passTopY - i * pRowH },
      });
    }

    let px = pX;
    pCols.forEach((w) => {
      page.drawLine({
        start: { x: px, y: passTopY },
        end: { x: px, y: passTopY - rows * pRowH },
      });
      px += w;
    });

    let hx = pX;
    ["Passenger Name", "Identity Type", "Identity No.", "ICC-ID"].forEach(
      (h, i) => {
        page.drawText(h, {
          x: hx + 3,
          y: passTopY - 11,
          size: 7,
          font: bold,
        });
        hx += pCols[i];
      },
    );

    if (
      csv1?.dollar_rate !== undefined &&
      csv1?.dollar_rate !== null &&
      csv1?.dollar_rate !== "0" &&
      csv1?.dollar_rate !== ""
    ) {
      page.drawText(`(1 USD = ${csv1.dollar_rate} INR)`, {
        x: xUnitPrice + 4,
        y: passTopY - 12,
        size: 7,
        font,
      });
    }

    let passengerY = passTopY - pRowH - 12;
    let taxableTotal = 0;

    rows2.forEach((row) => {
      let hx = pX;
      page.drawText(String(row.passenger_name || ""), {
        x: hx + 3,
        y: passengerY + 2,
        size: 7,
        font,
      });
      hx += pCols[0];

      page.drawText(String(row.identity_type || ""), {
        x: hx + 6,
        y: passengerY + 4,
        size: 7,
        font,
      });
      hx += pCols[1];

      page.drawText(String(row.identity_no || ""), {
        x: hx + 3,
        y: passengerY + 2,
        size: 7,
        font,
      });
      hx += pCols[2];

      page.drawText(String(row.icc_id || ""), {
        x: hx + 3,
        y: passengerY + 2,
        size: 7,
        font,
      });

      passengerY -= pRowH;
    });

    taxableTotal = invoiceUnit * unitPrice;

    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    const gstType = csv1?.gst;

    if (gstType === "18") {
      igst = taxableTotal * 0.18;
    } else if (gstType === "9") {
      cgst = taxableTotal * 0.09;
      sgst = taxableTotal * 0.09;
    }

    const finalTotal = Math.round(taxableTotal + igst + cgst + sgst);

    y -= 220;
    page.drawText("Taxable Value", { x: 80, y, size: 9, font: bold });

    y -= 14;
    page.drawText("IGST @18 %", { x: 80, y, size: 9, font });
    page.drawText("18%", { x: 450, y, size: 9, font });
    page.drawText(`INR ${igst.toFixed(2)}`, { x: 509, y, size: 9, font });

    y -= 14;
    page.drawText("Central GST @09 %", { x: 80, y, size: 9, font });
    page.drawText("9%", { x: 454, y, size: 9, font });
    page.drawText(`INR ${cgst.toFixed(2)}`, { x: 509, y, size: 9, font });

    y -= 14;
    page.drawText("State GST@09 %", { x: 80, y, size: 9, font });
    page.drawText("9%", { x: 454, y, size: 9, font });
    page.drawText(`INR ${sgst.toFixed(2)}`, { x: 509, y, size: 9, font });

    y -= 20;
    page.drawText(`INR ${(taxableTotal + igst + cgst + sgst).toFixed(2)}`, {
      x: 509,
      y,
      size: 9,
      font,
    });

    y -= 18;
    page.drawText("Total Value", { x: 40, y, size: 9, font: bold });
    page.drawText(`INR ${finalTotal}.00`, {
      x: 509,
      y,
      size: 9,
      font: bold,
    });

    y -= 6;
    page.drawLine({
      start: { x: 40, y },
      end: { x: 555, y },
      thickness: 1,
      color: black,
    });

    y -= 10;
    page.drawText(`Amount in Words: ( ${numberToWords(finalTotal)} only)`, {
      x: 40,
      y,
      size: 9,
      font: bold,
    });

    y -= 6;
    page.drawLine({
      start: { x: 40, y },
      end: { x: 555, y },
      thickness: 1,
      color: black,
    });

    y -= 20;
    page.drawText("Terms and Conditions:", { x: 40, y, size: 10, font: bold });

    y -= 14;
    page.drawText(
      "Payment within 3 calendar days of presentment of Invoice vide Account Payee Cheque favouring ",
      { x: 70, y, size: 9, font, maxWidth: 500 },
    );

    y -= 8;
    page.drawText("ConnectingIT Technologies Private Limited", {
      x: 70,
      y: y - 5,
      size: 9,
      font: bold,
      maxWidth: 500,
    });

    y -= 30;
    page.drawText("Account EFT Details:", { x: 40, y, size: 10, font: bold });

    y -= 14;
    page.drawText("ACCOUNT NAME: CONNECTINGIT TECHNOLOGIES PRIVATE LIMITED", {
      x: 70,
      y,
      size: 9,
      font,
    });
    y -= 14;
    page.drawText("ACCOUNT NUMBER: 071805001786", { x: 70, y, size: 9, font });
    y -= 14;
    page.drawText("IFSC CODE: ICIC0000718", { x: 70, y, size: 9, font });
    y -= 14;
    page.drawText("MICR CODE: 110229092", { x: 70, y, size: 9, font });
    y -= 14;
    page.drawText("Branch: ICICI BANK INDIRAPURAM Ghaziabad", {
      x: 70,
      y,
      size: 9,
      font,
    });

    y -= 20;
    page.drawText(
      "This is to computer generated invoice no signature required",
      { x: 40, y, size: 8, font },
    );

    page.drawImage(qrImg, {
      x: 595 - 120,
      y: 130,
      width: 70,
      height: 70,
    });

    page.drawImage(signImg, {
      x: 595 - 280,
      y: 20,
      width: 90,
      height: 90,
    });

    return await pdfDoc.save();
  }

  async function generateAllInvoices(csv1Rows, csv2Rows) {
    const invoices = [];

    for (const csv1Row of csv1Rows) {
      const invoiceNo = csv1Row.invoice_no;
      if (!invoiceNo) continue;

      const matchedPassengers = csv2Rows.filter(
        (p) =>
          String(p.invoice_no ?? "").trim() === String(invoiceNo ?? "").trim(),
      );

      if (!matchedPassengers.length) {
        console.warn("No passengers for invoice:", invoiceNo);
        continue;
      }

      try {
        const pdfBytes = await generateStaticInvoiceExact(
          csv1Row,
          matchedPassengers,
        );

        invoices.push({
          invoiceNo,
          pdfBytes,
        });
      } catch (err) {
        console.error("❌ Invoice failed:", invoiceNo, err.message);
        invoices.push({
          invoiceNo,
          pdfBytes: null,
        });
      }
    }

    return invoices;
  }

  const handleGenerateInvoices = async () => {
    if (!rows1.length || !rows2.length) {
      alert("CSV data missing");
      return;
    }

    setLoading(true);

    const normalizedCsv1 = rows1.map(normalizeCsv1);
    const normalizedCsv2 = rows2.map((row) => ({
      plan_name: String(row["plan_name"] || "").trim(),
      passenger_name: String(row["passenger_name"] || "").trim(),
      identity_type: String(row["identity_type"] || "").trim(),
      identity_no: String(row["identity_no"] || "").trim(),
      icc_id: String(row["icc_id"] || "").trim(),
      invoice_no: String(row["invoice_no"] || "").trim(),
    }));

    const invoiceList = await generateAllInvoices(
      normalizedCsv1,
      normalizedCsv2,
    );

    if (!invoiceList.length) {
      alert("No matching invoices found");
      setLoading(false);
      return;
    }

    const previews = invoiceList.map((inv) => {
      const blob = new Blob([inv.pdfBytes], { type: "application/pdf" });
      return {
        name: `GST-Invoice-${inv.invoiceNo}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
      };
    });

    setPdfList(previews);
    setGeneratedInvoices(invoiceList);
    setShowModal(true);
    setLoading(false);
  };

  function normalizeCsv1(row) {
    return {
      invoice_no: row["invoice_no"],
      date: row["date"],
      order_id: row["order_id"],
      tour_trip: row["tour/trip"],
      gst: String(row["gst"] || "").trim(),
      customer_pan: row["customer_pan"],
      customer_gst: row["customer_gst"],
      customer_address: row["customer_address"] || "",
      dollar_rate: row["dollar_rate"]?.toString().trim() || "",
      unit: Number(row["unit"] || 0),
      price: Number(row["price"] || 0),
    };
  }

  function SampleCsvTable({ data }) {
    if (!data || !data.length) return null;
    const headers = Object.keys(data[0]);

    return (
      <div className="table-container">
        <table className="sample-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => (
                  <td key={h}>{row[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="gst-app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <FileText size={28} />
            <span>GST Invoice Generator</span>
          </div>
          <div className="navbar-info">
            <span className="navbar-subtitle">
              Generate Professional Tax Invoices
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        {/* Header Card */}
        <div className="header-card">
          <h1 className="main-title">GST Invoice Generator</h1>
          <p className="main-subtitle">
            Upload your CSV files to generate professional GST invoices
            instantly
          </p>
        </div>

        {/* CSV Instructions */}
        <div className="info-card">
          <h2 className="info-title">📄 Required CSV Column Structure</h2>
          <div className="button-grid">
            <button
              onClick={() => {
                setSampleType("csv1");
                setShowSampleModal(true);
              }}
              className="sample-btn sample-btn-primary"
            >
              <FileText size={20} />
              View Sample CSV 1
            </button>

            <button
              onClick={() => {
                setSampleType("csv2");
                setShowSampleModal(true);
              }}
              className="sample-btn sample-btn-success"
            >
              <FileText size={20} />
              View Sample CSV 2
            </button>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="upload-card">
          <div className="upload-section">
            {/* CSV 1 Upload */}
            <div className="upload-group">
              <label className="upload-label">
                Upload Invoice Data (CSV/Excel)
              </label>
              <input
                key={fileInputKey}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="file-input"
                id="csv1-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setCsv1(file);
                  parseUniversalFile(file, setRows1);
                }}
              />
              <label htmlFor="csv1-upload" className="file-upload-box">
                <Upload size={24} />
                <span>{csv1 ? csv1.name : "Click to upload CSV 1"}</span>
                {csv1 && <span className="file-status">✓ File uploaded</span>}
              </label>
            </div>

            {/* CSV 2 Upload */}
            <div className="upload-group">
              <label className="upload-label">
                Upload Passenger Data (CSV/Excel)
              </label>
              <input
                key={fileInputKey + 1}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="file-input"
                id="csv2-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setCsv2(file);
                  parseUniversalFile(file, setRows2);
                }}
              />
              <label htmlFor="csv2-upload" className="file-upload-box">
                <Upload size={24} />
                <span>{csv2 ? csv2.name : "Click to upload CSV 2"}</span>
                {csv2 && <span className="file-status">✓ File uploaded</span>}
              </label>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleGenerateInvoices}
                disabled={!csv1 || !csv2 || loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Generate GST Invoices
                  </>
                )}
              </button>

              <button
                onClick={resetBox}
                className="btn btn-reset"
                title="Reset"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">GST Invoice Preview</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                {pdfList.map((pdf, idx) => (
                  <div key={idx} className="pdf-preview-item">
                    <div className="pdf-preview-header">
                      <span className="pdf-name">{pdf.name}</span>
                      <button
                        onClick={() => saveAs(pdf.blob, pdf.name)}
                        className="btn-download"
                      >
                        <Download size={18} />
                        Download
                      </button>
                    </div>
                    <iframe
                      src={pdf.url}
                      title={pdf.name}
                      className="pdf-iframe"
                    />
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleDownloadAll}>
                  <Download size={18} />
                  Download All as ZIP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sample CSV Modal */}
        {showSampleModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowSampleModal(false)}
          >
            <div
              className="modal-content sample-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {sampleType === "csv1"
                    ? "Sample CSV 1 – Invoice Data"
                    : "Sample CSV 2 – Passenger Data"}
                </h2>
                <button
                  onClick={() => setShowSampleModal(false)}
                  className="modal-close"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <SampleCsvTable
                  data={sampleType === "csv1" ? SAMPLE_CSV1 : SAMPLE_CSV2}
                />
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => downloadSampleCsv(sampleType)}
                  className="btn btn-primary"
                >
                  <Download size={18} />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
