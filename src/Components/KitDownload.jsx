import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import { RotateCcw } from "lucide-react";

import { PDFDocument, StandardFonts, rgb, PDFName } from "pdf-lib";
import { saveAs } from "file-saver";

import androidImgSrc from "../../public/PDFGeneratorImages/android.png";
import appleImgSrc from "../../public/PDFGeneratorImages/Apple.png";
import difference from "../../public/PDFGeneratorImages/diff.png";
import image from "../../public/PDFGeneratorImages/image.png";
import image1 from "../../public/PDFGeneratorImages/image1.png";
import image2 from "../../public/PDFGeneratorImages/image2.png";
import image3 from "../../public/PDFGeneratorImages/image3.png";
import esimlogo from "../../public/PDFGeneratorImages/esim_logo.png";
import JSZip from "jszip";

let _zipQrData = [];
function sanitizeForPdf(text) {
  if (!text) return "";
  return String(text)
    .replace(/\uFFFD/g, " ") // ✅ char 65533 (replacement char) → space
    .replace(/\u00A0|\u2007|\u202F/g, " ") // non-breaking spaces → space
    .replace(/[^\x20-\x7E]/g, " ") // ✅ CHANGED "" to " " — unknown chars become spaces
    .replace(/\s+/g, " ") // collapse multiple spaces into one
    .trim();
}
// ✅ HELPER: Convert scientific notation ICC IDs to full string WITHOUT precision loss
function parseIccId(value) {
  if (!value) return "";

  let icc = String(value).trim();

  // Handle scientific notation (e.g., 8.94442E+18)
  if (icc.includes("E") || icc.includes("e")) {
    try {
      // ✅ Manual string conversion to avoid JavaScript number precision issues
      const parts = icc.split(/[Ee]/);
      const coefficient = parts[0];
      const exponent = parseInt(parts[1], 10);

      // Remove decimal point
      let digits = coefficient.replace(".", "");

      // Calculate where decimal point was
      const decimalPos = coefficient.indexOf(".");
      let zerosToAdd = 0;

      if (decimalPos === -1) {
        // No decimal point, just add zeros
        zerosToAdd = exponent;
      } else {
        // Had decimal point, account for existing decimal places
        const decimalPlaces = coefficient.length - decimalPos - 1;
        zerosToAdd = exponent - decimalPlaces;
      }

      // Add the zeros
      if (zerosToAdd > 0) {
        icc = digits + "0".repeat(zerosToAdd);
      } else {
        icc = digits;
      }

      // Remove any leading zeros (but keep the number)
      icc = icc.replace(/^0+/, "") || "0";
    } catch (e) {
      console.warn("Failed to parse ICC ID:", icc, e);
    }
  }

  return icc.replace(/['"]/g, "").trim();
}

export default function KitDownload() {
  // for top
  const csvTopRef = useRef(null);
  const logoTopRef = useRef(null);
  const zipQrListRef = useRef([]); // ✅ ADD HERE - inside component

  // for middle (generated PDFs)

  const csvBottomRef = useRef(null);
  const logoBottomRef = useRef(null);
  const zipBottomRef = useRef(null);

  // for bottom (send emails)
  const [uploadedEmailCsv, setUploadedEmailCsv] = useState(null);
  const emailCsvRef = useRef(null);
  // without zip
  const [uploadedCsvTop, setUploadedCsvTop] = useState(null);
  const [uploadedLogoTop, setUploadedLogoTop] = useState(null);
  const [loadingTop, setloadingTop] = useState(false);

  // ZIP related
  const [uploadedZip, setUploadedZip] = useState(null);
  const [zipQrList, setZipQrList] = useState([]);

  const [rows, setRows] = useState([]);
  const [pdfList, setPdfList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedCsv, setUploadedCsv] = useState(null);
  const [uploadedLogo, setUploadedLogo] = useState(null);

  async function handleZipUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedZip(file);

    const zip = await JSZip.loadAsync(file);
    const qrList = [];

    for (const entry of Object.values(zip.files)) {
      if (entry.dir) continue;
      if (!entry.name.match(/\.(png|jpg|jpeg)$/i)) continue;

      const buffer = await entry.async("arraybuffer");
      const iccId = entry.name
        .split("/")
        .pop()
        .replace(/\.(png|jpg|jpeg)$/i, "");
      const type = entry.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
      qrList.push({ iccId, buffer, type });
    }

    qrList.sort((a, b) => a.iccId.localeCompare(b.iccId));
    console.log("📦 ZIP entries found:", Object.keys(zip.files));
    console.log("📦 Image files found:", qrList.length);
    console.log(
      "📦 qrList:",
      qrList.map((q) => q.iccId),
    );
    _zipQrData = qrList; // ✅ module-level, instant, no async delay
    setZipQrList(qrList); // for UI display only
    console.log(
      "✅ ZIP loaded:",
      qrList.map((q) => q.iccId),
    );
  }
  useEffect(() => {
    fetch("/data.csv")
      .then((r) => {
        if (!r.ok) throw new Error("no-csv");
        return r.text();
      })
      .then((text) => parseCsv(text))
      .catch(() =>
        setRows([
          {
            vendor_user_name: "Demo Vendor",
            qr_img: "/images/sampleQR.png",
            icc_id: "8944422711107390000",
          },
        ]),
      );
  }, []);

  function parseCsv(text) {
    // ✅ Normalize line endings
    const normalized = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\uFEFF/g, ""); // remove BOM

    const lines = normalized.split("\n").filter((l) => l.trim());

    console.log("🔍 RAW LINE 1 (header):", JSON.stringify(lines[0]));
    console.log("🔍 RAW LINE 2 (first data):", JSON.stringify(lines[1]));

    // ✅ Count tabs vs commas in header to detect delimiter
    const headerLine = lines[0];
    const tabCount = (headerLine.match(/\t/g) || []).length;
    const commaCount = (headerLine.match(/,/g) || []).length;
    const delimiter = tabCount > commaCount ? "\t" : ",";

    console.log(
      `📄 Delimiter: ${delimiter === "\t" ? "TAB" : "COMMA"}, tabs=${tabCount}, commas=${commaCount}`,
    );

    // ✅ Count expected columns from header
    const headers = headerLine.split(delimiter).map((h) => h.trim());
    console.log("📋 Headers found:", headers);
    console.log("📋 Header count:", headers.length);

    Papa.parse(normalized, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
      dynamicTyping: false,
      transform: (value, field) => {
        // ✅ Only trim, never replace spaces
        return String(value).trim();
      },
      complete: (res) => {
        if (!res?.data?.length) return;

        console.log("📦 RAW FIRST ROW:", JSON.stringify(res.data[0]));
        console.log("📋 Keys in first row:", Object.keys(res.data[0]));

        const fixed = res.data.map((r, index) => {
          const rawVendorName =
            r.vendor_user_name || r["vendor_user_name"] || "";
          const rawCompanyName = r.company_name || "";
          const rawDatapack = r.datapack || "";
          const rawIcc = r.icc_id || r.ICCID || "";
          const rawWhatsapp = r.whatsapp || "";
          const rawHelpline = r.helpline || "";
          const rawEmail = r.email || "";

          console.log(`\n=== ROW ${index + 1} ===`);
          console.log("vendor_user_name:", JSON.stringify(rawVendorName));
          console.log(
            "CHAR CODES:",
            [...rawVendorName].map((c) => `${c}=${c.charCodeAt(0)}`).join(" "),
          );

          // ✅ Sanitize - preserve spaces
          const vendorName = sanitizeForPdf(rawVendorName);
          const companyName = sanitizeForPdf(rawCompanyName);
          const datapack = sanitizeForPdf(rawDatapack);
          const whatsapp = sanitizeForPdf(rawWhatsapp);
          const helpline = sanitizeForPdf(rawHelpline);
          const email = sanitizeForPdf(rawEmail);

          console.log("After sanitize:", JSON.stringify(vendorName));
          console.log("Has spaces:", vendorName.includes(" "));

          const qr = String(r.qr_img || "").trim();

          // Process ICC
          let icc = String(rawIcc).trim();
          if (icc.includes("E") || icc.includes("e")) {
            icc = parseIccId(icc);
          }
          if (!icc && qr) {
            icc = qr
              .split("/")
              .pop()
              .replace(/\.(png|jpg|jpeg)$/i, "");
          }

          return {
            vendor_user_name: vendorName, // ✅ explicit fields only, no ...r spread
            company_name: companyName,
            icc_id: icc,
            datapack: datapack,
            qr_img: qr,
            whatsapp: whatsapp,
            helpline: helpline,
            email: email,
          };
        });

        console.log("\n✅ FINAL ROWS:");
        fixed.forEach((row, i) => {
          console.log(
            `${i + 1}. name="${row.vendor_user_name}" icc="${row.icc_id}"`,
          );
        });

        setRows(fixed);
      },
    });
  }
  async function embedImage(pdfDoc, src) {
    if (!src) {
      console.warn("embedImage: No source provided");
      return null;
    }

    try {
      let fetchUrl = src;

      const resp = await fetch(fetchUrl);
      if (!resp.ok) {
        console.error(
          `Failed to fetch ${src}: ${resp.status} ${resp.statusText}`,
        );
        return null;
      }

      const blob = await resp.blob();

      if (blob.size === 0) {
        console.error("Empty blob received for:", src);
        return null;
      }

      // Convert to PNG using canvas
      const bitmap = await createImageBitmap(blob);

      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);

      const pngBlob = await new Promise((res) =>
        canvas.toBlob(res, "image/png"),
      );

      const buffer = await pngBlob.arrayBuffer();

      return await pdfDoc.embedPng(buffer);
    } catch (e) {
      console.error("Image embed failed:", src, e);
      return null;
    }
  }

  function drawWrapped(
    page,
    text,
    x,
    y,
    maxWidth,
    size,
    font,
    color = rgb(0, 0, 0),
  ) {
    // ✅ Sanitize text before drawing
    const sanitized = sanitizeForPdf(text);
    const words = sanitized.split(/\s+/);
    let line = "";
    const lineHeight = size + 4;
    let cursorY = y;
    for (let word of words) {
      const test = line ? line + " " + word : word;
      let w = 0;
      try {
        w = font.widthOfTextAtSize(test, size);
      } catch {
        w = test.length * size * 0.5;
      }
      if (w > maxWidth && line) {
        page.drawText(line, { x, y: cursorY, size, font, color });
        line = word;
        cursorY -= lineHeight;
      } else {
        line = test;
      }
    }
    if (line) page.drawText(line, { x, y: cursorY, size, font, color });
  }

  async function buildPdfBytesCsvOnly(vendorRow, logoFileTop) {
    console.log("\n🎨 Building PDF for:", vendorRow?.vendor_user_name);
    console.log(
      "   Raw vendor_user_name:",
      JSON.stringify(vendorRow?.vendor_user_name),
    );
    console.log("   Raw icc_id:", JSON.stringify(vendorRow?.icc_id));

    const pdfDoc = await PDFDocument.create();
    const pageSize = [595, 842];
    const marginLeft = 40;
    const contentWidth = pageSize[0] - marginLeft * 2;

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const yellowBg = rgb(1, 0.94, 0.6);
    const greenBg = rgb(0.7, 1, 0.7);
    const blue = rgb(0.05, 0.32, 0.75);

    // ✅ DON'T sanitize again - it's already sanitized from parseCsv
    const vendorName = vendorRow?.vendor_user_name || "Esteemed Traveler";
    const companyName = vendorRow?.company_name || "eSimNow.ai";
    const whatsapp = vendorRow?.whatsapp || "0000000000";
    const helpline = vendorRow?.helpline || "0000000000";
    const email = vendorRow?.email || "eSimNow.ai";

    // ✅ FIX: Safe ICC ID extraction — handles scientific notation from CSV parsers
    const iccId = (() => {
      const raw = vendorRow?.icc_id;
      if (raw == null || raw === "") return "";
      const str = String(raw).trim();
      if (/e/i.test(str)) {
        // e.g. "8.93e+18" → "8930000000000000000" via BigInt
        return BigInt(Math.round(Number(str))).toString();
      }
      return str;
    })();

    console.log("   Final vendorName in PDF:", JSON.stringify(vendorName));
    console.log("   Has spaces:", vendorName.includes(" "));
    console.log("   Final iccId in PDF:", JSON.stringify(iccId));

    const qrSource =
      vendorRow?.["qr_img"]?.trim() ||
      `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

    // ✅ EMBED LOGO ONCE — reused on page 1 and page 2
    let logoImgEmbedded = null;
    try {
      if (logoFileTop instanceof File) {
        const buffer = await logoFileTop.arrayBuffer();
        if (logoFileTop.type.includes("png")) {
          logoImgEmbedded = await pdfDoc.embedPng(buffer);
        } else if (
          logoFileTop.type.includes("jpeg") ||
          logoFileTop.type.includes("jpg")
        ) {
          logoImgEmbedded = await pdfDoc.embedJpg(buffer);
        }
      } else {
        logoImgEmbedded = await embedImage(pdfDoc, "/images/logo.png");
      }
    } catch (err) {
      console.warn("Logo load failed:", err);
    }

    // ---------- PAGE 1 ----------
    const page1 = pdfDoc.addPage(pageSize);

    // ✅ BACKGROUND FIRST
    page1.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: yellowBg,
    });

    // ✅ LOGO — centered at top
    if (logoImgEmbedded) {
      const dims = logoImgEmbedded.scale(1);
      const maxWidth = 160;
      const maxHeight = 80;
      const scale = Math.min(maxWidth / dims.width, maxHeight / dims.height);
      const lw = dims.width * scale;
      const lh = dims.height * scale;
      const centerX = (page1.getWidth() - lw) / 2;
      const topY = page1.getHeight() - lh - 20;
      page1.drawImage(logoImgEmbedded, {
        x: centerX,
        y: topY,
        width: lw,
        height: lh,
      });
    }

    page1.drawText("Welcome to the world of ESim powered by", {
      x: marginLeft,
      y: 720,
      size: 24,
      font: fontBold,
      color: blue,
    });
    page1.drawText(companyName, {
      x: marginLeft,
      y: 690,
      size: 24,
      font: fontBold,
      color: blue,
    });
    page1.drawText(`Dear ${vendorName},`, {
      x: marginLeft,
      y: 654,
      size: 14,
      font: fontBold,
    });

    let yPos = 626;
    drawWrapped(
      page1,
      "We are delighted to welcome you to eSimNow.ai! The world's leading eSim Marketplace.",
      marginLeft,
      yPos,
      contentWidth,
      12,
      fontRegular,
    );
    yPos -= 36;

    function drawInlineBoldParagraph(
      page,
      x,
      y,
      contentParts,
      maxWidth,
      fontSize,
    ) {
      let cursorX = x,
        cursorY = y;
      for (const part of contentParts) {
        const font = part.bold ? fontBold : fontRegular;
        const sanitized = sanitizeForPdf(part.text);
        for (const word of sanitized.split(" ")) {
          const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
          if (cursorX + wordWidth > x + maxWidth) {
            cursorX = x;
            cursorY -= fontSize + 4;
          }
          page.drawText(word + " ", {
            x: cursorX,
            y: cursorY,
            size: fontSize,
            font,
          });
          cursorX += wordWidth;
        }
      }
      return cursorY;
    }

    const inlineParts = [
      { text: "With your ", bold: false },
      { text: "180 countries, ", bold: true },
      {
        text: "enjoy instant connectivity the moment you land, with high speed 4G/5G networks without worrying about local SIM cards or high international roaming charges.",
        bold: false,
      },
    ];
    yPos = drawInlineBoldParagraph(
      page1,
      marginLeft,
      yPos,
      inlineParts,
      contentWidth,
      12,
    );

    yPos -= 72;
    drawWrapped(
      page1,
      "Now connect your laptop, tablets and mobile all with our no-limit tethering option. Top-up or buy new eSIMs with a single button click.",
      marginLeft,
      yPos,
      contentWidth,
      12,
      fontRegular,
    );
    yPos -= 48;
    drawWrapped(
      page1,
      "We wish you a pleasant journey and seamless digital experience.",
      marginLeft,
      yPos,
      contentWidth,
      12,
      fontRegular,
    );
    yPos -= 48;
    page1.drawText("Warm Regards,", {
      x: marginLeft,
      y: yPos,
      size: 12,
      font: fontRegular,
    });
    yPos -= 18;
    page1.drawText(companyName, {
      x: marginLeft,
      y: yPos,
      size: 12,
      font: fontBold,
    });

    // ---------- PAGE 2 ----------
    const page2 = pdfDoc.addPage(pageSize);
    page2.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: greenBg,
    });

    drawWrapped(
      page2,
      "Here is your very own personalized eSim Profile, scan and install in one click",
      marginLeft,
      760,
      contentWidth,
      16,
      fontBold,
      blue,
    );

    const qrSize = 150;
    const qrY = 450;
    const qrX = (page2.getWidth() - qrSize) / 2;

    const boxX = qrX - 10;
    const boxY = qrY - 40;
    const boxW = qrSize + 20;
    const boxH = qrSize + 100;

    // White box
    page2.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxW,
      height: boxH,
      color: rgb(1, 1, 1),
    });

    // ── Uploaded logo — TOP CENTER inside white box ──
    if (logoImgEmbedded) {
      const dims = logoImgEmbedded.scale(1);
      const maxSize = 80;
      const scale = Math.min(maxSize / dims.width, maxSize / dims.height);
      const lw = dims.width * scale;
      const lh = dims.height * scale;
      page2.drawImage(logoImgEmbedded, {
        x: boxX + (boxW - lw) / 2, // ✅ centered horizontally
        y: boxY + boxH - lh - 6, // ✅ top of white box
        width: lw,
        height: lh,
      });
    }

    // ── QR code — center ──
    let qrImage = null;
    try {
      let qrPath = qrSource;
      if (qrPath && !qrPath.startsWith("http") && !qrPath.startsWith("/")) {
        qrPath = `/images/${qrPath}`;
      }
      qrImage = await embedImage(pdfDoc, qrPath);
    } catch (err) {
      console.error("QR image error:", err);
    }

    if (qrImage) {
      const dims = qrImage.scale(1);
      const scale = qrSize / dims.width;
      page2.drawImage(qrImage, {
        x: qrX,
        y: qrY + 10,
        width: dims.width * scale,
        height: dims.height * scale,
      });
    } else {
      page2.drawText("QR CODE NOT FOUND", {
        x: qrX + 10,
        y: qrY + qrSize / 2 - 5,
        size: 10,
        font: fontBold,
        color: rgb(1, 0, 0),
      });
    }

    // ── Static esimlogo — BOTTOM CENTER inside white box ──
    const staticImg = await embedImage(pdfDoc, esimlogo);
    if (staticImg) {
      const dims = staticImg.scale(1);
      const maxSize = 80;
      const scale = Math.min(maxSize / dims.width, maxSize / dims.height);
      const sw = dims.width * scale;
      const sh = dims.height * scale;
      page2.drawImage(staticImg, {
        x: boxX + (boxW - sw) / 2, // ✅ centered horizontally
        y: boxY + 6, // ✅ bottom of white box
        width: sw,
        height: sh,
      });
    }

    // ── ICC ID — centered below white box ──
    const displayIccId = iccId || "N/A";
    const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
    page2.drawText(displayIccId, {
      x: qrX + qrSize / 2 - iccWidth / 2,
      y: qrY - 60,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // ── Installation videos ──
    drawWrapped(
      page2,
      "For Installation Support refer to the videos below:",
      marginLeft,
      qrY - 130,
      contentWidth,
      12,
      fontRegular,
    );

    const appleImg = await embedImage(pdfDoc, appleImgSrc);
    const androidImg = await embedImage(pdfDoc, androidImgSrc);

    let supportY = qrY - 160;
    let cursorX = marginLeft;

    if (appleImg) {
      const dims = appleImg.scale(1);
      const sc = 12 / dims.width;
      page2.drawImage(appleImg, {
        x: cursorX,
        y: supportY - 2,
        width: dims.width * sc,
        height: dims.height * sc,
      });
      cursorX += dims.width * sc + 8;
    }
    page2.drawText("Apple iOS: https://player.vimeo.com/video/1042080274", {
      x: cursorX,
      y: supportY,
      size: 11,
      font: fontRegular,
    });

    supportY -= 18;
    cursorX = marginLeft;

    if (androidImg) {
      const dims = androidImg.scale(1);
      const sc = 12 / dims.width;
      page2.drawImage(androidImg, {
        x: cursorX,
        y: supportY - 2,
        width: dims.width * sc,
        height: dims.height * sc,
      });
      cursorX += dims.width * sc + 8;
    }
    page2.drawText("Android: https://player.vimeo.com/video/1042080269", {
      x: cursorX,
      y: supportY,
      size: 11,
      font: fontRegular,
    });

    // ---------- PAGE 3 ----------
    const page3 = pdfDoc.addPage(pageSize);
    page3.drawRectangle({
      x: 0,
      y: pageSize[1] / 2,
      width: pageSize[0],
      height: pageSize[1] / 2,
      color: rgb(1, 1, 1),
    });
    page3.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1] / 2,
      color: greenBg,
    });

    page3.drawText("One-Page Technical Manual", {
      x: marginLeft,
      y: 800,
      size: 13,
      font: fontBold,
      color: blue,
    });

    drawWrapped(
      page3,
      "1. Check Compatibility: Ensure your phone supports eSim (iPhone XS or later, most recent Samsung/Google Pixel).",
      marginLeft,
      770,
      contentWidth,
      11,
      fontRegular,
    );
    drawWrapped(
      page3,
      "2. To check whether your Android phone is eSim compatible dial *#06#",
      marginLeft,
      740,
      contentWidth,
      11,
      fontRegular,
    );

    const whiteImg = await embedImage(pdfDoc, difference);
    if (whiteImg) {
      const maxW = pageSize[0] - marginLeft * 2;
      const maxH = 160;
      const dims = whiteImg.scale(1);
      const scale = Math.min(maxW / dims.width, maxH / dims.height);
      const w = dims.width * scale;
      const h = dims.height * scale;
      const x = (pageSize[0] - w) / 2;
      const yImg = pageSize[1] / 2 + 60;
      page3.drawImage(whiteImg, { x, y: yImg, width: w, height: h });
    }

    const greenStartY = pageSize[1] / 2 - 20;
    drawWrapped(
      page3,
      "3. Install eSIM: Go to Settings > Mobile/Cellular > Add Mobile Plan and scan the QR code.",
      marginLeft,
      greenStartY,
      contentWidth,
      11,
      fontRegular,
    );
    drawWrapped(
      page3,
      "ANDROID",
      marginLeft,
      greenStartY - 40,
      contentWidth,
      12,
      fontBold,
    );

    const cmToPts = 28.35;
    const sizes = [
      { h: 10.43 * cmToPts, w: 4.67 * cmToPts, path: image1 },
      { h: 9.86 * cmToPts, w: 4.66 * cmToPts, path: image2 },
      { h: 8.92 * cmToPts, w: 4.07 * cmToPts, path: image3 },
    ];

    const totalW = sizes.reduce((acc, s) => acc + s.w, 0);
    const gap = 0;
    const totalGroupWidth = totalW + gap * (sizes.length - 1);
    const startX = (pageSize[0] - totalGroupWidth) / 2;
    const baseY = 80;

    let curX = startX;
    for (let i = 0; i < sizes.length; i++) {
      const s = sizes[i];
      const img = await embedImage(pdfDoc, s.path);
      if (img) {
        page3.drawImage(img, { x: curX, y: baseY, width: s.w, height: s.h });
      } else {
        page3.drawRectangle({
          x: curX,
          y: baseY,
          width: s.w,
          height: s.h,
          borderColor: rgb(0.6, 0.6, 0.6),
          borderWidth: 1,
        });
        page3.drawText(s.path.split("/").pop(), {
          x: curX + 8,
          y: baseY + s.h / 2 - 6,
          size: 10,
          font: fontRegular,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
      curX += s.w + gap;
    }

    const afterImgsY = baseY - 24;
    drawWrapped(
      page3,
      "3. Activate Data: Set eSIM as Primary/Default Data Line and turn ON Data Roaming.",
      marginLeft,
      afterImgsY,
      contentWidth,
      11,
      fontRegular,
    );
    drawWrapped(
      page3,
      "4. Troubleshooting: Restart phone, check APN = 'internet', ensure Mobile Data is ON.",
      marginLeft,
      afterImgsY - 36,
      contentWidth,
      11,
      fontRegular,
    );

    // ---------- PAGE 4 ----------
    const page4 = pdfDoc.addPage(pageSize);
    page4.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: yellowBg,
    });

    page4.drawText("Support 24*7", {
      x: marginLeft,
      y: 780,
      size: 20,
      font: fontBold,
      color: blue,
    });

    let y4 = 740;
    drawWrapped(
      page4,
      `Helpline: ${helpline}`,
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;
    drawWrapped(
      page4,
      `WhatsApp: ${whatsapp}`,
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;
    drawWrapped(
      page4,
      `Email: ${email}`,
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 34;

    page4.drawText("Quick Reminders", {
      x: marginLeft,
      y: y4,
      size: 14,
      font: fontBold,
      color: blue,
    });

    const dataPackText =
      vendorRow?.datapack || "1 GB data valid for 7 days from activation";
    const bullets = [
      dataPackText,
      "Use WiFi when available to save data",
      "No physical SIM needed - purely digital",
      "QR code works only once - do not share",
      "Complete your eKYC, keep your PAN/AADHAAR/PASSPORT handy",
      "We offer Multi Country Regional Plans, Single Country Plans, World Plans and Lifelong validity plans. Choose as per your needs.",
    ];

    let by = y4 - 26;
    bullets.forEach((b) => {
      drawWrapped(
        page4,
        `• ${b}`,
        marginLeft + 8,
        by,
        contentWidth - 16,
        11,
        fontRegular,
      );
      by -= 20;
    });

    const footerText = `www.${companyName}`;
    const footerSize = 36;
    const footerWidth = fontBold.widthOfTextAtSize(footerText, footerSize);
    const footerX = (pageSize[0] - footerWidth) / 2;
    page4.drawText(footerText, {
      x: footerX,
      y: 150,
      size: footerSize,
      font: fontBold,
    });

    return await pdfDoc.save();
  }
  async function buildPdfBytes(vendorRow, options = {}) {
    const {
      logoFile = null,
      qrBuffer = null,
      qrType = null,
      iccFromZip = null,
    } = options;

    console.log(
      "\n🎨 Building PDF (with ZIP) for:",
      vendorRow?.vendor_user_name,
    );
    console.log(
      "   Raw vendor_user_name:",
      JSON.stringify(vendorRow?.vendor_user_name),
    );
    console.log("   Raw icc_id from CSV:", JSON.stringify(vendorRow?.icc_id));
    console.log("   ICC from ZIP:", JSON.stringify(iccFromZip));

    // ✅ FIX: Use ICC ID from CSV, not from ZIP filename
    // let iccId = vendorRow?.icc_id || "";
    // ✅ CORRECT - use ZIP filename ICC ID (full precision)
    let iccId = iccFromZip || vendorRow?.icc_id || "";
    console.log("   Using ICC ID:", JSON.stringify(iccId));

    const pdfDoc = await PDFDocument.create();
    const pageSize = [595, 842];
    const marginLeft = 40;
    const contentWidth = pageSize[0] - marginLeft * 2;

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const yellowBg = rgb(1, 0.94, 0.6);
    const greenBg = rgb(0.7, 1, 0.7);
    const blue = rgb(0.05, 0.32, 0.75);

    // ✅ DON'T sanitize again - already sanitized from parseCsv
    const vendorName = vendorRow?.vendor_user_name || "Esteemed Traveler";
    const companyName = vendorRow?.company_name || "eSimNow.ai";
    const whatsapp = vendorRow?.whatsapp || "0000000000";
    const helpline = vendorRow?.helpline || "0000000000";
    const email = vendorRow?.email || "eSimNow.ai";

    console.log("   Final vendorName:", JSON.stringify(vendorName));
    console.log("   Has spaces:", vendorName.includes(" "));

    const qrSource =
      vendorRow?.["qr_img"]?.trim() ||
      `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

    // ✅ CREATE LOGO IMAGE FIRST
    let logoImgPage1 = null;

    try {
      if (logoFile instanceof File) {
        const buffer = await logoFile.arrayBuffer();

        if (logoFile.type.includes("png")) {
          logoImgPage1 = await pdfDoc.embedPng(buffer);
        } else if (
          logoFile.type.includes("jpeg") ||
          logoFile.type.includes("jpg")
        ) {
          logoImgPage1 = await pdfDoc.embedJpg(buffer);
        }
      } else {
        // fallback (optional)
        logoImgPage1 = await embedImage(pdfDoc, "/images/logo.png");
      }
    } catch (err) {
      console.warn("Page1 Logo load failed:", err);
    }
    // ---------- PAGE 1 ----------
    const page1 = pdfDoc.addPage(pageSize);

    // ✅ BACKGROUND FIRST
    page1.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: yellowBg,
    });

    // ✅ THEN LOGO
    // if (logoImgPage1) {
    //   const dims = logoImgPage1.scale(1);

    //   const maxWidth = 200;
    //   const maxHeight = 120;

    //   const scale = Math.min(maxWidth / dims.width, maxHeight / dims.height);

    //   const lw = dims.width * scale;
    //   const lh = dims.height * scale;

    //   const centerX = (page1.getWidth() - lw) / 2;
    //   const centerY = (page1.getHeight() - lh) / 2 + 100;

    //   page1.drawImage(logoImgPage1, {
    //     x: centerX,
    //     y: centerY,
    //     width: lw,
    //     height: lh,
    //   });
    // }

    if (logoImgPage1) {
      const dims = logoImgPage1.scale(1);

      const maxWidth = 160;
      const maxHeight = 80;

      const scale = Math.min(maxWidth / dims.width, maxHeight / dims.height);

      const lw = dims.width * scale;
      const lh = dims.height * scale;

      // ✅ CENTER horizontally
      const centerX = (page1.getWidth() - lw) / 2;

      // ✅ PLACE AT TOP (HEADER AREA)
      const topY = page1.getHeight() - lh - 20; // 20 = top padding

      page1.drawImage(logoImgPage1, {
        x: centerX,
        y: topY,
        width: lw,
        height: lh,
      });
    }
    // page1.drawRectangle({
    //   x: 0,
    //   y: 0,
    //   width: pageSize[0],
    //   height: pageSize[1],
    //   color: yellowBg,
    // });
    page1.drawText("Welcome to the world of ESim powered by", {
      x: marginLeft,
      y: 720,
      size: 24,
      font: fontBold,
      color: blue,
    });
    page1.drawText(companyName, {
      x: marginLeft,
      y: 690,
      size: 24,
      font: fontBold,
      color: blue,
    });
    page1.drawText(`Dear ${vendorName},`, {
      x: marginLeft,
      y: 654,
      size: 14,
      font: fontBold,
    });

    let yPos = 626;
    drawWrapped(
      page1,
      "We are delighted to welcome you to eSimNow.ai! The world's leading eSim Marketplace.",
      marginLeft,
      yPos,
      contentWidth,
      12,
      fontRegular,
    );
    yPos -= 36;

    function drawInlineBoldParagraph(
      page,
      x,
      y,
      contentParts,
      maxWidth,
      fontSize,
    ) {
      let cursorX = x,
        cursorY = y;
      for (const part of contentParts) {
        const font = part.bold ? fontBold : fontRegular;
        const sanitized = sanitizeForPdf(part.text);
        for (const word of sanitized.split(" ")) {
          const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
          if (cursorX + wordWidth > x + maxWidth) {
            cursorX = x;
            cursorY -= fontSize + 4;
          }
          page.drawText(word + " ", {
            x: cursorX,
            y: cursorY,
            size: fontSize,
            font,
          });
          cursorX += wordWidth;
        }
      }
      return cursorY;
    }

    const inlineParts = [
      { text: "With your ", bold: false },
      { text: "180 countries, ", bold: true },
      {
        text: "enjoy instant connectivity the moment you land, with high speed 4G/5G networks without worrying about local SIM cards or high international roaming charges.",
        bold: false,
      },
    ];
    yPos = drawInlineBoldParagraph(
      page1,
      marginLeft,
      yPos,
      inlineParts,
      contentWidth,
      12,
    );

    yPos -= 72;
    drawWrapped(
      page1,
      "Now connect your laptop, tablets and mobile all with our no-limit tethering option. Top-up or buy new eSIMs with a single button click.",
      marginLeft,
      yPos,
      contentWidth,
      12,
      fontRegular,
    );
    yPos -= 48;
    drawWrapped(
      page1,
      "We wish you a pleasant journey and seamless digital experience.",
      marginLeft,
      yPos,
      contentWidth,
      12,
      fontRegular,
    );
    yPos -= 48;
    page1.drawText("Warm Regards,", {
      x: marginLeft,
      y: yPos,
      size: 12,
      font: fontRegular,
    });
    yPos -= 18;
    page1.drawText(companyName, {
      x: marginLeft,
      y: yPos,
      size: 12,
      font: fontBold,
    });

    // page 2-----------------------
    const page2 = pdfDoc.addPage(pageSize);
    page2.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: greenBg,
    });

    drawWrapped(
      page2,
      "Here is your very own personalized eSim Profile, scan and install in one click",
      marginLeft,
      760,
      contentWidth,
      16,
      fontBold,
      blue,
    );

    const qrSize = 150;
    const qrY = 450;
    const qrX = (page2.getWidth() - qrSize) / 2;

    const boxX = qrX - 10;
    const boxY = qrY - 40;
    const boxW = qrSize + 20;
    const boxH = qrSize + 100;

    // White box
    page2.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxW,
      height: boxH,
      color: rgb(1, 1, 1),
    });

    // !==========================

    // ── Uploaded logo — TOP CENTER above QR ──
    let logoImg = null;
    try {
      if (logoFile instanceof File) {
        // use logoFileTop in buildPdfBytesCsvOnly
        const buffer = await logoFile.arrayBuffer();
        if (logoFile.type.includes("png")) {
          logoImg = await pdfDoc.embedPng(buffer);
        } else if (
          logoFile.type.includes("jpeg") ||
          logoFile.type.includes("jpg")
        ) {
          logoImg = await pdfDoc.embedJpg(buffer);
        }
      } else {
        logoImg = await embedImage(pdfDoc, "/images/logo.png");
      }
    } catch (err) {
      console.warn("Logo not found:", err);
    }

    if (logoImg) {
      const dims = logoImg.scale(1);
      const maxSize = 80;
      const scale = Math.min(maxSize / dims.width, maxSize / dims.height);
      const lw = dims.width * scale;
      const lh = dims.height * scale;
      page2.drawImage(logoImg, {
        x: boxX + (boxW - lw) / 2, // ✅ center horizontally
        y: boxY + boxH - lh - 6, // ✅ top of white box
        width: lw,
        height: lh,
      });
    }
    // ── QR code — center ──
    let qrImage = null;
    try {
      if (qrBuffer instanceof ArrayBuffer) {
        qrImage =
          qrType === "jpg"
            ? await pdfDoc.embedJpg(qrBuffer)
            : await pdfDoc.embedPng(qrBuffer);
      } else {
        let qrPath = vendorRow?.["qr_img"]?.trim();
        if (qrPath && !qrPath.startsWith("http")) {
          qrPath = `/images/${qrPath.split("/").pop()}`;
        }
        qrImage = await embedImage(pdfDoc, qrPath);
      }
    } catch (err) {
      console.warn("QR image failed:", err);
    }

    if (qrImage) {
      const dims = qrImage.scale(1);
      const scale = qrSize / dims.width;
      // page2.drawImage(qrImage, {
      //   x: qrX,
      //   y: qrY + 40,
      //   width: dims.width * scale,
      //   height: dims.height * scale,
      // });
      page2.drawImage(qrImage, {
        x: qrX,
        y: qrY + 10, // ✅ moved down
        width: dims.width * scale,
        height: dims.height * scale,
      });
    } else {
      page2.drawText("QR CODE NOT FOUND", {
        x: qrX + 10,
        y: qrY + qrSize / 2 - 5,
        size: 10,
        font: fontBold,
        color: rgb(1, 0, 0),
      });
    }

    // ── Static esimlogo — BOTTOM CENTER below QR ──
    const staticImg = await embedImage(pdfDoc, esimlogo);
    if (staticImg) {
      const dims = staticImg.scale(1);
      const maxSize = 80;
      const scale = Math.min(maxSize / dims.width, maxSize / dims.height);
      const sw = dims.width * scale;
      const sh = dims.height * scale;
      page2.drawImage(staticImg, {
        x: boxX + (boxW - sw) / 2, // ✅ center horizontally
        y: boxY + 6, // ✅ bottom of white box
        width: sw,
        height: sh,
      });
    }

    // ICC ID
    const displayIccId = iccId || "N/A";
    const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
    page2.drawText(displayIccId, {
      x: qrX + qrSize / 2 - iccWidth / 2,
      y: qrY - 60,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Installation videos
    drawWrapped(
      page2,
      "For Installation Support refer to the videos below:",
      marginLeft,
      qrY - 130,
      contentWidth,
      12,
      fontRegular,
    );

    const appleImg = await embedImage(pdfDoc, appleImgSrc);
    const androidImg = await embedImage(pdfDoc, androidImgSrc);
    let supportY = qrY - 160;
    let cursorX = marginLeft;

    if (appleImg) {
      const dims = appleImg.scale(1);
      const sc = 12 / dims.width;
      page2.drawImage(appleImg, {
        x: cursorX,
        y: supportY - 2,
        width: dims.width * sc,
        height: dims.height * sc,
      });
      cursorX += dims.width * sc + 8;
    }
    page2.drawText("Apple iOS: https://player.vimeo.com/video/1042080274", {
      x: cursorX,
      y: supportY,
      size: 11,
      font: fontRegular,
    });

    supportY -= 18;
    cursorX = marginLeft;

    if (androidImg) {
      const dims = androidImg.scale(1);
      const sc = 12 / dims.width;
      page2.drawImage(androidImg, {
        x: cursorX,
        y: supportY - 2,
        width: dims.width * sc,
        height: dims.height * sc,
      });
      cursorX += dims.width * sc + 8;
    }
    page2.drawText("Android: https://player.vimeo.com/video/1042080269", {
      x: cursorX,
      y: supportY,
      size: 11,
      font: fontRegular,
    });
    // ---------- PAGE 3 ----------
    const page3 = pdfDoc.addPage(pageSize);
    page3.drawRectangle({
      x: 0,
      y: pageSize[1] / 2,
      width: pageSize[0],
      height: pageSize[1] / 2,
      color: rgb(1, 1, 1),
    });
    page3.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1] / 2,
      color: greenBg,
    });

    page3.drawText("One-Page Technical Manual", {
      x: marginLeft,
      y: 800,
      size: 13,
      font: fontBold,
      color: blue,
    });

    drawWrapped(
      page3,
      "1. Check Compatibility: Ensure your phone supports eSim (iPhone XS or later, most recent Samsung/Google Pixel).",
      marginLeft,
      770,
      contentWidth,
      11,
      fontRegular,
    );
    drawWrapped(
      page3,
      "2. To check whether your Android phone is eSim compatible dial *#06#",
      marginLeft,
      740,
      contentWidth,
      11,
      fontRegular,
    );

    const whiteImgPath = difference;
    const whiteImg = await embedImage(pdfDoc, whiteImgPath);
    if (whiteImg) {
      const maxW = pageSize[0] - marginLeft * 2;
      const maxH = 160;
      const dims = whiteImg.scale(1);
      const scale = Math.min(maxW / dims.width, maxH / dims.height);
      const w = dims.width * scale;
      const h = dims.height * scale;
      const x = (pageSize[0] - w) / 2;
      const yImg = pageSize[1] / 2 + 60;
      page3.drawImage(whiteImg, { x, y: yImg, width: w, height: h });
    }

    const greenStartY = pageSize[1] / 2 - 20;
    drawWrapped(
      page3,
      "3. Install eSIM: Go to Settings > Mobile/Cellular > Add Mobile Plan and scan the QR code.",
      marginLeft,
      greenStartY,
      contentWidth,
      11,
      fontRegular,
    );
    drawWrapped(
      page3,
      "ANDROID",
      marginLeft,
      greenStartY - 40,
      contentWidth,
      12,
      fontBold,
    );

    const cmToPts = 28.35;
    const sizes = [
      {
        h: 10.43 * cmToPts,
        w: 4.67 * cmToPts,
        path: image1,
      },
      {
        h: 9.86 * cmToPts,
        w: 4.66 * cmToPts,
        path: image2,
      },
      {
        h: 8.92 * cmToPts,
        w: 4.07 * cmToPts,
        path: image3,
      },
    ];

    const totalW = sizes.reduce((acc, s) => acc + s.w, 0);
    const gap = 0;
    const totalGroupWidth = totalW + gap * (sizes.length - 1);
    const startX = (pageSize[0] - totalGroupWidth) / 2;

    const baseY = 80;

    let curX = startX;
    for (let i = 0; i < sizes.length; i++) {
      const s = sizes[i];
      const img = await embedImage(pdfDoc, s.path);
      if (img) {
        page3.drawImage(img, { x: curX, y: baseY, width: s.w, height: s.h });
      } else {
        page3.drawRectangle({
          x: curX,
          y: baseY,
          width: s.w,
          height: s.h,
          borderColor: rgb(0.6, 0.6, 0.6),
          borderWidth: 1,
        });
        page3.drawText(s.path.split("/").pop(), {
          x: curX + 8,
          y: baseY + s.h / 2 - 6,
          size: 10,
          font: fontRegular,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
      curX += s.w + gap;
    }

    const afterImgsY = baseY - 24;
    drawWrapped(
      page3,
      "3. Activate Data: Set eSIM as Primary/Default Data Line and turn ON Data Roaming.",
      marginLeft,
      afterImgsY,
      contentWidth,
      11,
      fontRegular,
    );
    drawWrapped(
      page3,
      "4. Troubleshooting: Restart phone, check APN = 'internet', ensure Mobile Data is ON.",
      marginLeft,
      afterImgsY - 36,
      contentWidth,
      11,
      fontRegular,
    );

    // ---------- PAGE 4 ----------
    const page4 = pdfDoc.addPage(pageSize);
    page4.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: yellowBg,
    });
    page4.drawText("Support 24*7", {
      x: marginLeft,
      y: 780,
      size: 20,
      font: fontBold,
      color: blue,
    });

    let y4 = 740;
    drawWrapped(
      page4,
      `Helpline: ${helpline}`,
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;
    drawWrapped(
      page4,
      `WhatsApp: ${whatsapp}`,
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;
    drawWrapped(
      page4,
      `Email: ${email}`,
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );

    y4 -= 34;
    page4.drawText("Quick Reminders", {
      x: marginLeft,
      y: y4,
      size: 14,
      font: fontBold,
      color: blue,
    });

    // ✅ Sanitize datapack
    const dataPackText =
      vendorRow?.datapack || "1 GB data valid for 7 days from activation";

    const bullets = [
      dataPackText,
      "Use WiFi when available to save data",
      "No physical SIM needed - purely digital",
      "QR code works only once - do not share",
      "Complete your eKYC, keep your PAN/AADHAAR/PASSPORT handy",
      "We offer Multi Country Regional Plans, Single Country Plans, World Plans and Lifelong validity plans. Choose as per your needs.",
    ];

    let by = y4 - 26;
    bullets.forEach((b) => {
      drawWrapped(
        page4,
        `• ${b}`,
        marginLeft + 8,
        by,
        contentWidth - 16,
        11,
        fontRegular,
      );
      by -= 20;
    });

    const footerText = `www.${companyName}`;
    const footerSize = 36;
    const footerWidth = fontBold.widthOfTextAtSize(footerText, footerSize);
    const footerX = (pageSize[0] - footerWidth) / 2;
    page4.drawText(footerText, {
      x: footerX,
      y: 150,
      size: footerSize,
      font: fontBold,
    });

    return await pdfDoc.save();
  }

  async function handleGenerateCsvOnly() {
    setloadingTop(true);
    try {
      const generated = [];

      for (const row of rows) {
        const bytes = await buildPdfBytesCsvOnly(row, uploadedLogoTop);
        const blob = new Blob([bytes], { type: "application/pdf" });

        generated.push({
          name: `${row.vendor_user_name || "Vendor"}_${row.icc_id || "pdf"}.pdf`,
          blob,
          url: URL.createObjectURL(blob),
        });
      }

      setPdfList(generated);
      setShowModal(true);
    } finally {
      setloadingTop(false);
    }
  }

  async function handleGenerateAll() {
    setLoading(true);

    try {
      const generated = [];
      const currentZipList = _zipQrData; // ✅ always current, no stale state

      console.log("\n🚀 Starting PDF generation...");
      console.log("Total CSV rows:", rows.length);
      console.log("Total ZIP QR codes:", currentZipList.length);

      if (currentZipList.length === 0) {
        alert("ZIP QR codes not loaded. Please re-upload the ZIP file.");
        return;
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        console.log(`\n📄 Processing row ${i + 1}: ${row.vendor_user_name}`);

        const qrData = currentZipList[i];

        if (!qrData) {
          console.warn(`⚠️ No QR found for row ${i + 1}`);
          continue;
        }

        console.log("   ✅ Using ZIP QR:", qrData.iccId);

        const bytes = await buildPdfBytes(row, {
          logoFile: uploadedLogo,
          qrBuffer: qrData.buffer,
          qrType: qrData.type,
          iccFromZip: qrData.iccId,
        });

        const blob = new Blob([bytes], { type: "application/pdf" });
        generated.push({
          name: `${row.vendor_user_name || "Vendor"}_${qrData.iccId}.pdf`,
          blob,
          url: URL.createObjectURL(blob),
        });
      }

      console.log(`\n✅ Generated ${generated.length} PDFs`);
      setPdfList(generated);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }
  async function handleDownloadAll() {
    if (!pdfList.length) return alert("No PDFs to download.");

    const zip = new JSZip();
    const folder = zip.folder("Generated_PDFs");

    pdfList.forEach((pdf) => {
      folder.file(pdf.name, pdf.blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "All_PDFs.zip");
  }

  function resetTopBox() {
    setUploadedCsvTop(null);
    setUploadedLogoTop(null);
    setloadingTop(false);

    if (csvTopRef.current) csvTopRef.current.value = "";
    if (logoTopRef.current) logoTopRef.current.value = "";
  }

  function resetBottomBox() {
    setUploadedCsv(null);
    setUploadedLogo(null);
    setUploadedZip(null);
    setLoading(false);
    _zipQrData = [];

    // ✅ CRITICAL FIX
    if (csvBottomRef.current) csvBottomRef.current.value = "";
    if (logoBottomRef.current) logoBottomRef.current.value = "";
    if (zipBottomRef.current) zipBottomRef.current.value = "";
  }

  function resetEmailBox() {
    setUploadedEmailCsv(null);

    if (emailCsvRef.current) {
      emailCsvRef.current.value = ""; // ✅ important
    }
  }

  async function handleSendEmails() {
    if (!uploadedEmailCsv) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvText = event.target.result;

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          // ✅ Convert CSV → JSON
          const data = result.data
            .map((row) => ({
              name: row.name?.trim(),
              email: row.email?.trim(),
            }))
            .filter((item) => item.name && item.email);

          console.log("📦 Sending JSON:", data);

          try {
            const response = await fetch(
              "http://localhost:8080/common/event-main-sender",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              },
            );

            if (!response.ok) {
              throw new Error("Failed to send");
            }

            const resData = await response.json();
            console.log("✅ Backend response:", resData);

            alert("Emails sent successfully 🚀");
          } catch (error) {
            console.error("❌ Error:", error);
            alert("Failed to send emails");
          }
        },
      });
    };

    reader.readAsText(uploadedEmailCsv);
  }
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-12 p-8">
        {/* CSV INSTRUCTIONS */}
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              📄 Required CSV Column Names
            </h3>

            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-xl border border-gray-300">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th className="px-3 py-2 text-center font-medium">
                        vendor_user_name
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        company_name
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        icc_id (or ICCID)
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        datapack
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        qr_img
                      </th>

                      <th className="px-3 py-2 text-center font-medium">
                        whatsapp
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        email
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        helpline
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded">
              <ul className="list-disc ml-5 space-y-1">
                📌 Logo PNG format only
              </ul>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <ul className="list-disc ml-5 space-y-1">
                <p>
                  📌 QR Image name = ICC ID (e.g. <code>89444227.png</code>)
                </p>
                <p> 📌 PNG / JPG / JPEG supported</p>
              </ul>
            </div>
          </div>
        </div>

        {/* TOP CARD : CSV ONLY */}
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
          <h1 className="text-2xl font-bold mb-6">
            PDF Generator (CSV)
            <button
              onClick={resetTopBox}
              title="Reset"
              className="relative  left-4 text-gray-400 hover:text-blue-600 transition"
            >
              <RotateCcw size={20} />
            </button>
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
              {uploadedCsvTop ? uploadedCsvTop.name : "Upload CSV"}

              <input
                ref={csvTopRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadedCsvTop(file);

                  const reader = new FileReader();
                  reader.onload = (ev) => parseCsv(ev.target.result);
                  reader.readAsText(file);
                }}
              />
            </label>

            <label className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
              {uploadedLogoTop ? uploadedLogoTop.name : "Upload Logo"}
              <input
                ref={logoTopRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  if (
                    file.type !== "image/png" &&
                    !file.name.toLowerCase().endsWith(".png")
                  ) {
                    alert("Only PNG image files are allowed!");
                    e.target.value = "";
                    return;
                  }

                  setUploadedLogoTop(file);
                }}
              />
            </label>
          </div>

          <button
            onClick={handleGenerateCsvOnly}
            disabled={loadingTop || !uploadedCsvTop || !uploadedLogoTop}
            className={`px-6 py-3 rounded text-white transition ${
              loadingTop || !uploadedCsvTop || !uploadedLogoTop
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loadingTop ? "Generating..." : "Generate PDFs"}
          </button>
        </div>

        {/* OR DIVIDER */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-px bg-gray-400"></div>
          <span className="text-gray-500 font-semibold">OR</span>
          <div className="w-24 h-px bg-gray-400"></div>
        </div>
        {/* CSV INSTRUCTIONS */}
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              📄 Required CSV Column Names
            </h3>

            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-xl border border-gray-300">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th className="px-3 py-2 text-center font-medium">
                        vendor_user_name
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        company_name
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        icc_id (or ICCID)
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        datapack
                      </th>

                      <th className="px-3 py-2 text-center font-medium">
                        whatsapp
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        email
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        helpline
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded">
              <ul className="list-disc ml-5 space-y-1">
                📌 Logo PNG format only
              </ul>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <ul className="list-disc ml-5 space-y-1">
                <p>
                  📌 Zip: QR Image names = ICC ID (e.g.{" "}
                  <code>89444227.png</code>)
                </p>
                <p> 📌 PNG / JPG / JPEG supported for Logo</p>
              </ul>
            </div>
          </div>
        </div>
        {/* 2nd CARD : CSV + ZIP */}
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
          <h1 className="text-2xl font-bold mb-6">
            PDF Generator (CSV + QR ZIP)
            <button
              onClick={resetBottomBox}
              title="Reset"
              className="relative  left-4 text-gray-400 hover:text-blue-600 transition"
            >
              <RotateCcw size={20} />
            </button>
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
              {uploadedCsv ? uploadedCsv.name : "Upload CSV"}
              <input
                ref={csvBottomRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadedCsv(file);

                  const reader = new FileReader();
                  reader.onload = (ev) => parseCsv(ev.target.result);
                  reader.readAsText(file);
                }}
              />
            </label>

            <label className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
              {uploadedLogo ? uploadedLogo.name : "Upload Logo"}
              <input
                ref={logoBottomRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  if (
                    file.type !== "image/png" &&
                    !file.name.toLowerCase().endsWith(".png")
                  ) {
                    alert("Only PNG image files are allowed!");
                    e.target.value = "";
                    return;
                  }

                  setUploadedLogo(file);
                }}
              />
            </label>

            <label className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition">
              {uploadedZip ? uploadedZip.name : "Upload QR ZIP"}
              <input
                ref={zipBottomRef}
                type="file"
                accept=".zip"
                onChange={handleZipUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handleGenerateAll}
            disabled={loading || !uploadedCsv || !uploadedLogo || !uploadedZip}
            className={`px-6 py-3 rounded text-white transition ${
              loading || !uploadedCsv || !uploadedLogo || !uploadedZip
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? "Generating..." : "Generate PDFs"}
          </button>
        </div>

        {/* OR DIVIDER */}
        {/* <div className="flex items-center gap-4">
          <div className="w-24 h-px bg-gray-400"></div>
          <span className="text-gray-500 font-semibold">OR</span>
          <div className="w-24 h-px bg-gray-400"></div>
        </div> */}
        {/* last card */}
        {/* <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              📄 Required CSV Column Names
            </h3>

            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-xl border border-gray-300">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th className="px-3 py-2 text-center font-medium">
                        name
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        email
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
          <h1 className="text-2xl font-bold mb-6">
            Send Emails (CSV)
            <button
              onClick={resetEmailBox}
              title="Reset"
              className="relative left-4 text-gray-400 hover:text-blue-600 transition"
            >
              <RotateCcw size={20} />
            </button>
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
              {uploadedEmailCsv ? uploadedEmailCsv.name : "Upload CSV"}

              <input
                ref={emailCsvRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setUploadedEmailCsv(file);
                }}
              />
            </label>
          </div>

          <button
            onClick={handleSendEmails}
            disabled={!uploadedEmailCsv}
            className={`px-6 py-3 rounded text-white transition ${
              !uploadedEmailCsv
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            Send Emails
          </button>
        </div> */}
        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg w-[90%] max-w-5xl h-[95vh] flex flex-col">
              <div className="flex justify-between items-center p-3 border-b bg-gray-200">
                <h2 className="text-lg font-semibold">All PDF Previews</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                {pdfList.map((pdf, idx) => (
                  <div key={idx} className="border rounded shadow">
                    <div className="bg-gray-50 px-3 py-2 font-medium border-b">
                      {pdf.name}
                    </div>
                    <iframe
                      title={pdf.name}
                      src={pdf.url}
                      className="w-full h-[500px]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center p-3 border-t bg-gray-200">
                <button
                  onClick={handleDownloadAll}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  Download All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
