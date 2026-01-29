// import React, { useEffect, useState, useRef } from "react";
// import Papa from "papaparse";
// import { RotateCcw } from "lucide-react";

// import { PDFDocument, StandardFonts, rgb, PDFName } from "pdf-lib";
// import { saveAs } from "file-saver";
// // import Layout from "../../utils/Layout";

// import androidImgSrc from "../../public/PDFGeneratorImages/android.png";
// import appleImgSrc from "../../public/PDFGeneratorImages/Apple.png";
// import difference from "../../public/PDFGeneratorImages/diff.png";
// import image from "../../public/PDFGeneratorImages/image.png";
// import image1 from "../../public/PDFGeneratorImages/image1.png";
// import image2 from "../../public/PDFGeneratorImages/image2.png";
// import image3 from "../../public/PDFGeneratorImages/image3.png";
// import JSZip from "jszip";
// export default function KitDownload() {
//   const csvTopRef = useRef(null);
//   const logoTopRef = useRef(null);

//   // without zip
//   const [uploadedCsvTop, setUploadedCsvTop] = useState(null);
//   const [uploadedLogoTop, setUploadedLogoTop] = useState(null);
//   const [loadingTop, setloadingTop] = useState(false);

//   // ZIP related
//   const [uploadedZip, setUploadedZip] = useState(null);
//   // const [zipQrBuffer, setZipQrBuffer] = useState(null); // ArrayBuffer
//   // const [zipIccId, setZipIccId] = useState("");
//   // const [zipQrType, setZipQrType] = useState(""); // png | jpg
//   const [zipQrMap, setZipQrMap] = useState({});
//   // replace old zip states
//   const [zipQrList, setZipQrList] = useState([]);

//   const [rows, setRows] = useState([]);
//   const [pdfList, setPdfList] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploadedCsv, setUploadedCsv] = useState(null);
//   const [uploadedLogo, setUploadedLogo] = useState(null);
//   // !for popup============
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [pendingFileInput, setPendingFileInput] = useState(null);

//   async function handleZipUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadedZip(file);

//     const zip = await JSZip.loadAsync(file);
//     const qrList = [];

//     for (const entry of Object.values(zip.files)) {
//       if (entry.dir) continue;
//       if (!entry.name.match(/\.(png|jpg|jpeg)$/i)) continue;

//       const buffer = await entry.async("arraybuffer");
//       const iccId = entry.name
//         .split("/")
//         .pop()
//         .replace(/\.(png|jpg|jpeg)$/i, "");

//       const type = entry.name.toLowerCase().endsWith(".png") ? "png" : "jpg";

//       qrList.push({ iccId, buffer, type });
//     }

//     setZipQrList(qrList);
//   }

//   const handleConfirmOk = () => {
//     setShowConfirm(false); // hide popup first
//     setTimeout(() => {
//       if (pendingFileInput) {
//         pendingFileInput.click(); // now open file picker
//       }
//     }, 100);
//   };

//   const handleConfirmCancel = () => {
//     setShowConfirm(false);
//   };

//   // !for popup ends===================
//   useEffect(() => {
//     fetch("/data.csv")
//       .then((r) => {
//         if (!r.ok) throw new Error("no-csv");
//         return r.text();
//       })
//       .then((text) => parseCsv(text))
//       .catch(() =>
//         setRows([
//           {
//             vendor_user_name: "Demo Vendor",
//             qr_img: "/images/sampleQR.png",
//             icc_id: "8944422711107390000",
//           },
//         ]),
//       );
//   }, []);

//   //   function parseCsv(text) {
//   //     Papa.parse(text, {
//   //       header: true,
//   //       skipEmptyLines: true,
//   //       dynamicTyping: false,
//   //       complete: (res) => {
//   //         if (res?.data?.length) {
//   //           const fixed = res.data.map((r) => {
//   //             let iccId = "";
//   //             if (r["qr_img"]?.includes("/uploads/images/")) {
//   //               const match = r["qr_img"].match(/(\d+)\.png$/);
//   //               if (match) iccId = match[1];
//   //             } else if (r.icc_id) {
//   //               iccId = String(r.icc_id).trim();
//   //             }
//   //             return { ...r, icc_id: iccId };
//   //           });
//   //           setRows(fixed);
//   //         }
//   //       },
//   //     });
//   //   }

//   //   function parseCsv(text) {
//   //     Papa.parse(text, {
//   //       header: true,
//   //       skipEmptyLines: true,
//   //       complete: (res) => {
//   //         if (!res?.data?.length) return;

//   //         const fixed = res.data.map((r) => {
//   //           const qr = String(r.qr_img || "").trim();

//   //           // derive ICC from filename if missing
//   //           let icc = String(r.icc_id || "").trim();

//   //           if (!icc && qr) {
//   //             icc = qr
//   //               .split("/")
//   //               .pop()
//   //               .replace(/\.(png|jpg|jpeg)$/i, "");
//   //           }

//   //           return {
//   //             ...r,
//   //             qr_img: qr,
//   //             icc_id: icc,
//   //           };
//   //         });

//   //         console.log("CSV rows:", fixed); // DEBUG

//   //         setRows(fixed);
//   //       },
//   //     });
//   //   }

//   function parseCsv(text) {
//     Papa.parse(text, {
//       header: true,
//       skipEmptyLines: true,
//       dynamicTyping: false,
//       complete: (res) => {
//         if (!res?.data?.length) return;

//         const fixed = res.data.map((r) => {
//           const qr = String(r.qr_img || "").trim();

//           let icc = String(r.icc_id || "").trim();

//           // 🔥 Convert scientific notation to full integer string
//           if (icc && (icc.includes("E") || icc.includes("e"))) {
//             try {
//               // Parse the scientific notation
//               const num = parseFloat(icc);

//               // Convert to integer string without decimals
//               icc = num.toFixed(0);

//               // Alternative: use BigInt for very large numbers
//               // icc = BigInt(num).toString();
//             } catch (e) {
//               console.warn("Failed to parse ICC ID:", icc, e);
//             }
//           }

//           // Derive ICC from filename if missing
//           if (!icc && qr) {
//             icc = qr
//               .split("/")
//               .pop()
//               .replace(/\.(png|jpg|jpeg)$/i, "");
//           }

//           return {
//             ...r,
//             qr_img: qr,
//             icc_id: icc,
//           };
//         });

//         console.log("CSV rows:", fixed);
//         setRows(fixed);
//       },
//     });
//   }
//   //   async function embedImage(pdfDoc, pathOrBuffer) {
//   //     if (!pathOrBuffer) return null;
//   //     try {
//   //       let ab;
//   //       if (pathOrBuffer instanceof ArrayBuffer) {
//   //         ab = pathOrBuffer;
//   //       } else {
//   //         const resp = await fetch(pathOrBuffer);
//   //         if (!resp.ok) return null;
//   //         ab = await resp.arrayBuffer();
//   //       }
//   //       try {
//   //         return await pdfDoc.embedPng(ab);
//   //       } catch {
//   //         return await pdfDoc.embedJpg(ab);
//   //       }
//   //     } catch {
//   //       return null;
//   //     }
//   //   }
//   //   async function embedImage(pdfDoc, src) {
//   //     if (!src) return null;

//   //     try {
//   //       const resp = await fetch(src);
//   //       if (!resp.ok) return null;

//   //       const blob = await resp.blob();

//   //       // convert ANY format into PNG using canvas
//   //       const bitmap = await createImageBitmap(blob);

//   //       const canvas = document.createElement("canvas");
//   //       canvas.width = bitmap.width;
//   //       canvas.height = bitmap.height;

//   //       const ctx = canvas.getContext("2d");
//   //       ctx.drawImage(bitmap, 0, 0);

//   //       const pngBlob = await new Promise((res) =>
//   //         canvas.toBlob(res, "image/png"),
//   //       );

//   //       const buffer = await pngBlob.arrayBuffer();

//   //       return await pdfDoc.embedPng(buffer);
//   //     } catch (e) {
//   //       console.warn("Image embed failed:", src, e);
//   //       return null;
//   //     }
//   //   }
//   //   async function embedImage(pdfDoc, src) {
//   //     if (!src) {
//   //       console.warn("embedImage: No source provided");
//   //       return null;
//   //     }

//   //     try {
//   //       console.log("Fetching image:", src); // DEBUG

//   //       const resp = await fetch(src);
//   //       if (!resp.ok) {
//   //         console.error(
//   //           `Failed to fetch ${src}: ${resp.status} ${resp.statusText}`,
//   //         );
//   //         return null;
//   //       }

//   //       const blob = await resp.blob();

//   //       // Check if blob is valid
//   //       if (blob.size === 0) {
//   //         console.error("Empty blob received for:", src);
//   //         return null;
//   //       }

//   //       // convert ANY format into PNG using canvas
//   //       const bitmap = await createImageBitmap(blob);

//   //       const canvas = document.createElement("canvas");
//   //       canvas.width = bitmap.width;
//   //       canvas.height = bitmap.height;

//   //       const ctx = canvas.getContext("2d");
//   //       ctx.drawImage(bitmap, 0, 0);

//   //       const pngBlob = await new Promise((res) =>
//   //         canvas.toBlob(res, "image/png"),
//   //       );

//   //       const buffer = await pngBlob.arrayBuffer();

//   //       return await pdfDoc.embedPng(buffer);
//   //     } catch (e) {
//   //       console.error("Image embed failed:", src, e);
//   //       return null;
//   //     }
//   //   }

//   async function embedImage(pdfDoc, src) {
//     if (!src) {
//       console.warn("embedImage: No source provided");
//       return null;
//     }

//     try {
//       //   console.log("Fetching image:", src);

//       let fetchUrl = src;

//       // 🔥 Use CORS proxy for external URLs
//       // if (src.startsWith("http://") || src.startsWith("https://")) {
//       //   fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(src)}`;
//       // }

//       const resp = await fetch(fetchUrl);
//       if (!resp.ok) {
//         console.error(
//           `Failed to fetch ${src}: ${resp.status} ${resp.statusText}`,
//         );
//         return null;
//       }

//       const blob = await resp.blob();

//       if (blob.size === 0) {
//         console.error("Empty blob received for:", src);
//         return null;
//       }

//       // Convert to PNG using canvas
//       const bitmap = await createImageBitmap(blob);

//       const canvas = document.createElement("canvas");
//       canvas.width = bitmap.width;
//       canvas.height = bitmap.height;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(bitmap, 0, 0);

//       const pngBlob = await new Promise((res) =>
//         canvas.toBlob(res, "image/png"),
//       );

//       const buffer = await pngBlob.arrayBuffer();

//       return await pdfDoc.embedPng(buffer);
//     } catch (e) {
//       console.error("Image embed failed:", src, e);
//       return null;
//     }
//   }
//   function drawWrapped(
//     page,
//     text,
//     x,
//     y,
//     maxWidth,
//     size,
//     font,
//     color = rgb(0, 0, 0),
//   ) {
//     const words = String(text).split(/\s+/);
//     let line = "";
//     const lineHeight = size + 4;
//     let cursorY = y;
//     for (let word of words) {
//       const test = line ? line + " " + word : word;
//       let w = 0;
//       try {
//         w = font.widthOfTextAtSize(test, size);
//       } catch {
//         w = test.length * size * 0.5;
//       }
//       if (w > maxWidth && line) {
//         page.drawText(line, { x, y: cursorY, size, font, color });
//         line = word;
//         cursorY -= lineHeight;
//       } else {
//         line = test;
//       }
//     }
//     if (line) page.drawText(line, { x, y: cursorY, size, font, color });
//   }
//   //  NEW FUNCTION — FOR MODULE 1 (CSV ONLY)
//   // Uses: vendor_user_name, company_name, icc_id, datapack, qr_img from CSV
//   async function buildPdfBytesCsvOnly(vendorRow, logoFileTop) {
//     const pdfDoc = await PDFDocument.create();
//     const pageSize = [595, 842];
//     const marginLeft = 40;
//     const contentWidth = pageSize[0] - marginLeft * 2;

//     const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const yellowBg = rgb(1, 0.94, 0.6);
//     const greenBg = rgb(0.7, 1, 0.7);
//     const blue = rgb(0.05, 0.32, 0.75);

//     const vendorName = vendorRow?.vendor_user_name || "Esteemed Traveler";
//     const companyName = vendorRow?.company_name || "eSimNow.ai";
//     console.log("ROW QR:", vendorRow.qr_img);

//     // icc_id directly from CSV
//     const iccId = String(vendorRow?.icc_id || "")
//       .replace(/['"]/g, "")
//       .trim();

//     // QR source directly from CSV qr_img
//     const qrSource =
//       vendorRow?.["qr_img"]?.trim() ||
//       `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

//     // ---------- PAGE 1 ----------
//     const page1 = pdfDoc.addPage(pageSize);
//     page1.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });

//     page1.drawText("Welcome to the world of ESim powered by", {
//       x: marginLeft,
//       y: 760,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });

//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: 724,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });

//     page1.drawText(`Dear ${vendorName},`, {
//       x: marginLeft,
//       y: 684,
//       size: 14,
//       font: fontBold,
//     });

//     let yPos = 656;
//     drawWrapped(
//       page1,
//       "We are delighted to welcome you to eSimNow.ai! The world's leading eSim Marketplace.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 36;

//     function drawInlineBoldParagraph(
//       page,
//       x,
//       y,
//       contentParts,
//       maxWidth,
//       fontSize,
//     ) {
//       let cursorX = x,
//         cursorY = y;

//       for (const part of contentParts) {
//         const font = part.bold ? fontBold : fontRegular;
//         for (const word of part.text.split(" ")) {
//           const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
//           if (cursorX + wordWidth > x + maxWidth) {
//             cursorX = x;
//             cursorY -= fontSize + 4;
//           }
//           page.drawText(word + " ", {
//             x: cursorX,
//             y: cursorY,
//             size: fontSize,
//             font,
//           });
//           cursorX += wordWidth;
//         }
//       }
//       return cursorY;
//     }

//     const inlineParts = [
//       { text: "With your ", bold: false },
//       { text: "180 countries, ", bold: true },
//       {
//         text: "enjoy instant connectivity the moment you land, with high speed 4G/5G networks without worrying about local SIM cards or high international roaming charges.",
//         bold: false,
//       },
//     ];

//     yPos = drawInlineBoldParagraph(
//       page1,
//       marginLeft,
//       yPos,
//       inlineParts,
//       contentWidth,
//       12,
//     );

//     yPos -= 72;
//     drawWrapped(
//       page1,
//       "Now connect your laptop, tablets and mobile all with our no-limit tethering option. Top-up or buy new eSIMs with a single button click.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;

//     drawWrapped(
//       page1,
//       "We wish you a pleasant journey and seamless digital experience.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;

//     page1.drawText("Warm Regards,", {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontRegular,
//     });
//     yPos -= 18;

//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontBold,
//     });

//     // ---------- PAGE 2 ----------
//     const page2 = pdfDoc.addPage(pageSize);
//     page2.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: greenBg,
//     });

//     drawWrapped(
//       page2,
//       "Here is your very own personalized eSim Profile, scan and install in one click",
//       marginLeft,
//       760,
//       contentWidth,
//       16,
//       fontBold,
//       blue,
//     );

//     const qrSize = 150;
//     const qrY = 450;
//     const qrX = (page2.getWidth() - qrSize) / 2;

//     // White box behind QR
//     page2.drawRectangle({
//       x: qrX - 10,
//       y: qrY - 40,
//       width: qrSize + 20,
//       height: qrSize + 100,
//       color: rgb(1, 1, 1),
//     });

//     // QR from CSV image path
//     // let qrImage = null;
//     // try {
//     //   let qrPath = qrSource;
//     //   if (qrPath && !qrPath.startsWith("http")) {
//     //     // assume public /images
//     //     qrPath = `/images/${qrPath.split("/").pop()}`;
//     //   }
//     //   qrImage = await embedImage(pdfDoc, qrPath);
//     // } catch (err) {
//     //   console.warn("QR image failed (CSV only module):", err);
//     // }

//     // Around line 424-438 in buildPdfBytesCsvOnly
//     // QR from CSV image path
//     let qrImage = null;
//     try {
//       let qrPath = qrSource;

//       // DEBUG: Log what we're trying to fetch
//       console.log("Attempting to load QR from:", qrPath);

//       // If it's a relative path, ensure it's properly prefixed
//       if (qrPath && !qrPath.startsWith("http") && !qrPath.startsWith("/")) {
//         qrPath = `/images/${qrPath}`;
//       } else if (qrPath && qrPath.startsWith("/uploads/")) {
//         // Handle uploads path from CSV
//         qrPath = qrPath; // Keep as is
//       }

//       qrImage = await embedImage(pdfDoc, qrPath);

//       if (!qrImage) {
//         console.error("QR image failed to load from path:", qrPath);
//       }
//     } catch (err) {
//       console.error(
//         "QR image error (CSV only module):",
//         err,
//         "Path was:",
//         qrSource,
//       );
//     }
//     if (qrImage) {
//       const dims = qrImage.scale(1);
//       const scale = qrSize / dims.width;
//       page2.drawImage(qrImage, {
//         x: qrX,
//         y: qrY + 40,
//         width: dims.width * scale,
//         height: dims.height * scale,
//       });
//     } else {
//       page2.drawText("QR CODE NOT FOUND", {
//         x: qrX + 10,
//         y: qrY + qrSize / 2 - 5,
//         size: 10,
//         font: fontBold,
//         color: rgb(1, 0, 0),
//       });
//     }

//     // Logo (uses TOP logoFile)
//     let logoImg = null;
//     try {
//       if (logoFileTop instanceof File) {
//         const buffer = await logoFileTop.arrayBuffer();
//         if (logoFileTop.type.includes("png")) {
//           logoImg = await pdfDoc.embedPng(buffer);
//         } else if (
//           logoFileTop.type.includes("jpeg") ||
//           logoFileTop.type.includes("jpg")
//         ) {
//           logoImg = await pdfDoc.embedJpg(buffer);
//         }
//       } else {
//         logoImg = await embedImage(pdfDoc, "/images/logo.png");
//       }
//     } catch (err) {
//       console.warn("Logo not found (CSV only module):", err);
//     }

//     if (logoImg) {
//       const dims = logoImg.scale(1);
//       const scale = Math.min(100 / dims.width, 40 / dims.height);
//       const lw = dims.width * scale;
//       const lh = dims.height * scale;
//       const lx = (page2.getWidth() - lw) / 2;
//       const ly = qrY - 15;
//       page2.drawImage(logoImg, { x: lx, y: ly, width: lw, height: lh });
//     }

//     // ICC ID under logo (from CSV)
//     const displayIccId = iccId || "N/A";
//     const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
//     page2.drawText(displayIccId, {
//       x: qrX + qrSize / 2 - iccWidth / 2,
//       y: qrY - 60,
//       size: 12,
//       font: fontBold,
//       color: rgb(0, 0, 0),
//     });

//     // Installation videos
//     drawWrapped(
//       page2,
//       "For Installation Support refer to the videos below:",
//       marginLeft,
//       qrY - 130,
//       contentWidth,
//       12,
//       fontRegular,
//     );

//     const appleImg = await embedImage(pdfDoc, appleImgSrc);
//     const androidImg = await embedImage(pdfDoc, androidImgSrc);

//     let supportY = qrY - 160;
//     let cursorX = marginLeft;

//     if (appleImg) {
//       const dims = appleImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(appleImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }

//     page2.drawText("Apple iOS: https://player.vimeo.com/video/1042080274", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     supportY -= 18;
//     cursorX = marginLeft;

//     if (androidImg) {
//       const dims = androidImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(androidImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }

//     page2.drawText("Android: https://player.vimeo.com/video/1042080269", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     // ---------- PAGE 3 (same layout, no ZIP logic) ----------
//     const page3 = pdfDoc.addPage(pageSize);
//     page3.drawRectangle({
//       x: 0,
//       y: pageSize[1] / 2,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: rgb(1, 1, 1),
//     });
//     page3.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: greenBg,
//     });

//     page3.drawText("One-Page Technical Manual", {
//       x: marginLeft,
//       y: 800,
//       size: 13,
//       font: fontBold,
//       color: blue,
//     });

//     drawWrapped(
//       page3,
//       "1. Check Compatibility: Ensure your phone supports eSim (iPhone XS or later, most recent Samsung/Google Pixel).",
//       marginLeft,
//       770,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     drawWrapped(
//       page3,
//       "2. To check whether your Android phone is eSim compatible dial *#06#",
//       marginLeft,
//       740,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     const whiteImg = await embedImage(pdfDoc, difference);
//     if (whiteImg) {
//       const maxW = pageSize[0] - marginLeft * 2;
//       const maxH = 160;
//       const dims = whiteImg.scale(1);
//       const scale = Math.min(maxW / dims.width, maxH / dims.height);
//       const w = dims.width * scale;
//       const h = dims.height * scale;
//       const x = (pageSize[0] - w) / 2;
//       const yImg = pageSize[1] / 2 + 60;
//       page3.drawImage(whiteImg, { x, y: yImg, width: w, height: h });
//     }

//     const greenStartY = pageSize[1] / 2 - 20;
//     drawWrapped(
//       page3,
//       "3. Install eSIM: Go to Settings > Mobile/Cellular > Add Mobile Plan and scan the QR code.",
//       marginLeft,
//       greenStartY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "ANDROID",
//       marginLeft,
//       greenStartY - 40,
//       contentWidth,
//       12,
//       fontBold,
//     );

//     const cmToPts = 28.35;
//     const sizes = [
//       { h: 10.43 * cmToPts, w: 4.67 * cmToPts, path: image1 },
//       { h: 9.86 * cmToPts, w: 4.66 * cmToPts, path: image2 },
//       { h: 8.92 * cmToPts, w: 4.07 * cmToPts, path: image3 },
//     ];

//     const totalW = sizes.reduce((acc, s) => acc + s.w, 0);
//     const gap = 0;
//     const totalGroupWidth = totalW + gap * (sizes.length - 1);
//     const startX = (pageSize[0] - totalGroupWidth) / 2;
//     const baseY = 80;

//     let curX = startX;
//     for (let i = 0; i < sizes.length; i++) {
//       const s = sizes[i];
//       const img = await embedImage(pdfDoc, s.path);
//       if (img) {
//         page3.drawImage(img, { x: curX, y: baseY, width: s.w, height: s.h });
//       } else {
//         page3.drawRectangle({
//           x: curX,
//           y: baseY,
//           width: s.w,
//           height: s.h,
//           borderColor: rgb(0.6, 0.6, 0.6),
//           borderWidth: 1,
//         });
//         page3.drawText(s.path.split("/").pop(), {
//           x: curX + 8,
//           y: baseY + s.h / 2 - 6,
//           size: 10,
//           font: fontRegular,
//           color: rgb(0.5, 0.5, 0.5),
//         });
//       }
//       curX += s.w + gap;
//     }

//     const afterImgsY = baseY - 24;
//     drawWrapped(
//       page3,
//       "3. Activate Data: Set eSIM as Primary/Default Data Line and turn ON Data Roaming.",
//       marginLeft,
//       afterImgsY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "4. Troubleshooting: Restart phone, check APN = 'internet', ensure Mobile Data is ON.",
//       marginLeft,
//       afterImgsY - 36,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     // ---------- PAGE 4 ----------
//     const page4 = pdfDoc.addPage(pageSize);
//     page4.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });

//     page4.drawText("Support 24*7", {
//       x: marginLeft,
//       y: 780,
//       size: 20,
//       font: fontBold,
//       color: blue,
//     });

//     let y4 = 740;
//     drawWrapped(
//       page4,
//       "Helpline: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;

//     drawWrapped(
//       page4,
//       "WhatsApp: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;

//     drawWrapped(
//       page4,
//       `Email: ravi@eSimNow.ai`,
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 34;

//     page4.drawText("Quick Reminders", {
//       x: marginLeft,
//       y: y4,
//       size: 14,
//       font: fontBold,
//       color: blue,
//     });

//     // datapack from CSV (for module 1)
//     const dataPackText = vendorRow?.datapack
//       ? vendorRow.datapack
//       : "1 GB data valid for 7 days from activation";

//     const bullets = [
//       dataPackText,
//       "Use WiFi when available to save data",
//       "No physical SIM needed – purely digital",
//       "QR code works only once – do not share",
//       "Complete your eKYC, keep your PAN/AADHAAR/PASSPORT handy",
//       "We offer Multi Country Regional Plans, Single Country Plans, World Plans and Lifelong validity plans. Choose as per your needs.",
//     ];

//     let by = y4 - 26;
//     bullets.forEach((b) => {
//       drawWrapped(
//         page4,
//         `• ${b}`,
//         marginLeft + 8,
//         by,
//         contentWidth - 16,
//         11,
//         fontRegular,
//       );
//       by -= 20;
//     });

//     const footerText = `www.${companyName}.ai`;
//     const footerSize = 36;
//     const footerWidth = fontBold.widthOfTextAtSize(footerText, footerSize);
//     const footerX = (pageSize[0] - footerWidth) / 2;

//     page4.drawText(footerText, {
//       x: footerX,
//       y: 150,
//       size: footerSize,
//       font: fontBold,
//     });

//     const socialIcons = [
//       {
//         url: "https://www.eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
//       },
//       {
//         url: "https://www.facebook.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
//       },
//       {
//         url: "https://www.instagram.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
//       },
//       {
//         url: "https://www.linkedin.com/company/esimnow",
//         icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
//       },
//       {
//         url: "https://x.com/eSimNow",
//         icon: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
//       },
//     ];

//     const iconSize = 32;
//     const spacing = 20;
//     const totalWidthIcons = socialIcons.length * (iconSize + spacing) - spacing;
//     let iconStartX = (pageSize[0] - totalWidthIcons) / 2;
//     const iconY = 80;
//     const annots = [];

//     for (const s of socialIcons) {
//       const resp = await fetch(s.icon);
//       const bytes = await resp.arrayBuffer();
//       const img = await pdfDoc.embedPng(bytes);

//       page4.drawImage(img, {
//         x: iconStartX,
//         y: iconY,
//         width: iconSize,
//         height: iconSize,
//       });

//       const annotRef = pdfDoc.context.register(
//         pdfDoc.context.obj({
//           Type: "Annot",
//           Subtype: "Link",
//           Rect: [iconStartX, iconY, iconStartX + iconSize, iconY + iconSize],
//           Border: [0, 0, 0],
//           A: pdfDoc.context.obj({ Type: "Action", S: "URI", URI: s.url }),
//         }),
//       );

//       annots.push(annotRef);
//       iconStartX += iconSize + spacing;
//     }

//     const pageAnnots =
//       page4.node.lookup(PDFName.of("Annots")) || pdfDoc.context.obj([]);
//     annots.forEach((a) => pageAnnots.push(a));
//     page4.node.set(PDFName.of("Annots"), pageAnnots);

//     return await pdfDoc.save();
//   }

//   // async function buildPdfBytes(vendorRow) {
//   async function buildPdfBytes(vendorRow, options = {}) {
//     const {
//       logoFile = null,
//       qrBuffer = null,
//       qrType = null,
//       iccFromZip = null,
//     } = options;

//     // let iccId = zipIccId
//     //   ? zipIccId
//     //   : String(vendorRow?.icc_id || "")
//     //       .replace(/['"]/g, "")
//     //       .trim();
//     let iccId = iccFromZip
//       ? iccFromZip
//       : String(vendorRow?.icc_id || "")
//           .replace(/['"]/g, "")
//           .trim();

//     const pdfDoc = await PDFDocument.create();
//     const pageSize = [595, 842];
//     const marginLeft = 40;
//     const contentWidth = pageSize[0] - marginLeft * 2;

//     const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const yellowBg = rgb(1, 0.94, 0.6);
//     const greenBg = rgb(0.7, 1, 0.7);
//     const blue = rgb(0.05, 0.32, 0.75);

//     const vendorName = vendorRow?.vendor_user_name || "Esteemed Traveler";
//     const companyName = vendorRow?.company_name || "eSimNow.ai";
//     // console.log(companyName, "=========================");
//     const qrSource =
//       vendorRow?.["qr_img"]?.trim() ||
//       `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

//     // ---------- PAGE 1 ----------
//     const page1 = pdfDoc.addPage(pageSize);
//     page1.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });
//     page1.drawText("Welcome to the world of ESim powered by", {
//       x: marginLeft,
//       y: 760,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });
//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: 724,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });
//     page1.drawText(`Dear ${vendorName},`, {
//       x: marginLeft,
//       y: 684,
//       size: 14,
//       font: fontBold,
//     });

//     let yPos = 656;
//     drawWrapped(
//       page1,
//       "We are delighted to welcome you to eSimNow.ai! The world's leading eSim Marketplace.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 36;

//     // Inline bold paragraph helper
//     function drawInlineBoldParagraph(
//       page,
//       x,
//       y,
//       contentParts,
//       maxWidth,
//       fontSize,
//     ) {
//       let cursorX = x,
//         cursorY = y;
//       for (const part of contentParts) {
//         const font = part.bold ? fontBold : fontRegular;
//         for (const word of part.text.split(" ")) {
//           const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
//           if (cursorX + wordWidth > x + maxWidth) {
//             cursorX = x;
//             cursorY -= fontSize + 4;
//           }
//           page.drawText(word + " ", {
//             x: cursorX,
//             y: cursorY,
//             size: fontSize,
//             font,
//           });
//           cursorX += wordWidth;
//         }
//       }
//       return cursorY;
//     }

//     const inlineParts = [
//       { text: "With your ", bold: false },
//       { text: "180 countries, ", bold: true },
//       {
//         text: "enjoy instant connectivity the moment you land, with high speed 4G/5G networks without worrying about local SIM cards or high international roaming charges.",
//         bold: false,
//       },
//     ];
//     yPos = drawInlineBoldParagraph(
//       page1,
//       marginLeft,
//       yPos,
//       inlineParts,
//       contentWidth,
//       12,
//     );

//     yPos -= 72;
//     drawWrapped(
//       page1,
//       "Now connect your laptop, tablets and mobile all with our no-limit tethering option. Top-up or buy new eSIMs with a single button click.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;
//     drawWrapped(
//       page1,
//       "We wish you a pleasant journey and seamless digital experience.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;
//     page1.drawText("Warm Regards,", {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontRegular,
//     });
//     yPos -= 18;
//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontBold,
//     });

//     // ---------- PAGE 2 ----------
//     const page2 = pdfDoc.addPage(pageSize);
//     page2.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: greenBg,
//     });

//     // --- Header ---
//     drawWrapped(
//       page2,
//       "Here is your very own personalized eSim Profile, scan and install in one click",
//       marginLeft,
//       760,
//       contentWidth,
//       16,
//       fontBold,
//       blue,
//     );

//     // --- QR Section ---
//     const qrSize = 150;
//     const qrY = 450;
//     const qrX = (page2.getWidth() - qrSize) / 2;

//     // White box behind QR
//     page2.drawRectangle({
//       x: qrX - 10,
//       y: qrY - 40,
//       width: qrSize + 20,
//       height: qrSize + 100,
//       color: rgb(1, 1, 1),
//     });
//     // !================================================
//     // let qrImage = null;
//     // try {
//     //   // ✅ Fix local vs remote paths
//     //   let qrPath = vendorRow?.["qr_img"]?.trim();
//     //   if (qrPath && !qrPath.startsWith("http")) {
//     //     // assume file stored in /public/images
//     //     qrPath = `/images/${qrPath.split("/").pop()}`;
//     //   }
//     //   qrImage = await embedImage(pdfDoc, qrPath);
//     // } catch (err) {
//     //   console.warn("QR image failed:", err);
//     // }

//     // let qrImage = null;

//     // try {
//     //   // 🔥 ZIP QR HAS FIRST PRIORITY
//     //   if (zipQrBuffer instanceof ArrayBuffer) {
//     //     qrImage = await pdfDoc.embedPng(zipQrBuffer);
//     //   } else {
//     //     let qrPath = vendorRow?.["qr_img"]?.trim();
//     //     if (qrPath && !qrPath.startsWith("http")) {
//     //       qrPath = `/images/${qrPath.split("/").pop()}`;
//     //     }
//     //     qrImage = await embedImage(pdfDoc, qrPath);
//     //   }
//     // } catch (err) {
//     //   console.warn("QR image failed:", err);
//     // }
//     // let qrImage = null;

//     // try {
//     //   // 🔥 ZIP QR has first priority
//     //   if (zipQrBuffer instanceof ArrayBuffer) {
//     //     if (zipQrType === "png") {
//     //       qrImage = await pdfDoc.embedPng(zipQrBuffer);
//     //     } else {
//     //       qrImage = await pdfDoc.embedJpg(zipQrBuffer);
//     //     }
//     //   } else {
//     //     let qrPath = vendorRow?.["qr_img"]?.trim();
//     //     if (qrPath && !qrPath.startsWith("http")) {
//     //       qrPath = `/images/${qrPath.split("/").pop()}`;
//     //     }
//     //     qrImage = await embedImage(pdfDoc, qrPath);
//     //   }
//     // } catch (err) {
//     //   console.warn("QR image failed:", err);
//     // }
//     let qrImage = null;

//     try {
//       if (qrBuffer instanceof ArrayBuffer) {
//         qrImage =
//           qrType === "jpg"
//             ? await pdfDoc.embedJpg(qrBuffer)
//             : await pdfDoc.embedPng(qrBuffer);
//       } else {
//         let qrPath = vendorRow?.["qr_img"]?.trim();
//         if (qrPath && !qrPath.startsWith("http")) {
//           qrPath = `/images/${qrPath.split("/").pop()}`;
//         }
//         qrImage = await embedImage(pdfDoc, qrPath);
//       }
//     } catch (err) {
//       console.warn("QR image failed:", err);
//     }

//     // !================================================

//     // Draw QR or fallback
//     if (qrImage) {
//       const dims = qrImage.scale(1);
//       const scale = qrSize / dims.width;
//       page2.drawImage(qrImage, {
//         x: qrX,
//         y: qrY + 40,
//         width: dims.width * scale,
//         height: dims.height * scale,
//       });
//     } else {
//       page2.drawText("QR CODE NOT FOUND", {
//         x: qrX + 10,
//         y: qrY + qrSize / 2 - 5,
//         size: 10,
//         font: fontBold,
//         color: rgb(1, 0, 0),
//       });
//     }

//     // --- Logo Below QR ---
//     // let logoImg = null;
//     // try {
//     //   if (uploadedLogo instanceof File) {
//     //     const buffer = await uploadedLogo.arrayBuffer();
//     //     if (uploadedLogo.type.includes("png"))
//     //       logoImg = await pdfDoc.embedPng(buffer);
//     //     else if (
//     //       uploadedLogo.type.includes("jpeg") ||
//     //       uploadedLogo.type.includes("jpg")
//     //     )
//     //       logoImg = await pdfDoc.embedJpg(buffer);
//     //   } else {
//     //     logoImg = await embedImage(pdfDoc, "/images/logo.png");
//     //   }
//     // } catch (err) {
//     //   console.warn("Logo not found:", err);
//     // }
//     let logoImg = null;

//     try {
//       if (logoFile instanceof File) {
//         const buffer = await logoFile.arrayBuffer();

//         if (logoFile.type.includes("png")) {
//           logoImg = await pdfDoc.embedPng(buffer);
//         } else if (
//           logoFile.type.includes("jpeg") ||
//           logoFile.type.includes("jpg")
//         ) {
//           logoImg = await pdfDoc.embedJpg(buffer);
//         }
//       } else {
//         logoImg = await embedImage(pdfDoc, "/images/logo.png");
//       }
//     } catch (err) {
//       console.warn("Logo not found:", err);
//     }

//     // Draw Logo — centered and inside white box
//     if (logoImg) {
//       const dims = logoImg.scale(1);
//       const scale = Math.min(100 / dims.width, 40 / dims.height);
//       const lw = dims.width * scale;
//       const lh = dims.height * scale;
//       const lx = (page2.getWidth() - lw) / 2;
//       const ly = qrY - 15; // ✅ raised logo position
//       page2.drawImage(logoImg, { x: lx, y: ly, width: lw, height: lh });
//     }
//     // --- ICC ID under logo ---
//     const displayIccId = iccId || "N/A";
//     const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
//     page2.drawText(displayIccId, {
//       x: qrX + qrSize / 2 - iccWidth / 2,
//       y: qrY - 60,
//       size: 12,
//       font: fontBold,
//       color: rgb(0, 0, 0),
//     });

//     // --- Support Information ---
//     drawWrapped(
//       page2,
//       "For Installation Support refer to the videos below:",
//       marginLeft,
//       qrY - 130,
//       contentWidth,
//       12,
//       fontRegular,
//     );

//     const appleImg = await embedImage(pdfDoc, appleImgSrc);
//     const androidImg = await embedImage(pdfDoc, androidImgSrc);
//     let supportY = qrY - 160;
//     let cursorX = marginLeft;

//     if (appleImg) {
//       const dims = appleImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(appleImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }
//     page2.drawText("Apple iOS: https://player.vimeo.com/video/1042080274", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     supportY -= 18;
//     cursorX = marginLeft;

//     if (androidImg) {
//       const dims = androidImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(androidImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }
//     page2.drawText("Android: https://player.vimeo.com/video/1042080269", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     // ---------page 3-----------------
//     const page3 = pdfDoc.addPage(pageSize);
//     page3.drawRectangle({
//       x: 0,
//       y: pageSize[1] / 2,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: rgb(1, 1, 1),
//     });
//     page3.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: greenBg,
//     });

//     // Title in white section (blue, 13pt)
//     page3.drawText("One-Page Technical Manual", {
//       x: marginLeft,
//       y: 800,
//       size: 13,
//       font: fontBold,
//       color: blue,
//     });

//     // Steps 1 & 2
//     drawWrapped(
//       page3,
//       "1. Check Compatibility: Ensure your phone supports eSim (iPhone XS or later, most recent Samsung/Google Pixel).",
//       marginLeft,
//       770,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "2. To check whether your Android phone is eSim compatible dial *#06#",
//       marginLeft,
//       740,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     // White-section wide image (diff.png)
//     const whiteImgPath = difference;
//     const whiteImg = await embedImage(pdfDoc, whiteImgPath);
//     if (whiteImg) {
//       const maxW = pageSize[0] - marginLeft * 2;
//       const maxH = 160;
//       const dims = whiteImg.scale(1);
//       const scale = Math.min(maxW / dims.width, maxH / dims.height);
//       const w = dims.width * scale;
//       const h = dims.height * scale;
//       const x = (pageSize[0] - w) / 2;
//       const yImg = pageSize[1] / 2 + 60;
//       page3.drawImage(whiteImg, { x, y: yImg, width: w, height: h });
//     } else {
//       page3.drawText("[diff.png]", {
//         x: marginLeft,
//         y: pageSize[1] / 2 + 80,
//         size: 12,
//         font: fontRegular,
//         color: rgb(0.4, 0.4, 0.4),
//       });
//     }

//     // Green section: step 3, ANDROID label
//     const greenStartY = pageSize[1] / 2 - 20;
//     drawWrapped(
//       page3,
//       "3. Install eSIM: Go to Settings > Mobile/Cellular > Add Mobile Plan and scan the QR code.",
//       marginLeft,
//       greenStartY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "ANDROID",
//       marginLeft,
//       greenStartY - 40,
//       contentWidth,
//       12,
//       fontBold,
//     );

//     // Three images side-by-side, bottom-aligned, different sizes
//     const cmToPts = 28.35;
//     const sizes = [
//       {
//         h: 10.43 * cmToPts,
//         w: 4.67 * cmToPts,
//         path: image1,
//       },
//       {
//         h: 9.86 * cmToPts,
//         w: 4.66 * cmToPts,
//         path: image2,
//       },
//       {
//         h: 8.92 * cmToPts,
//         w: 4.07 * cmToPts,
//         path: image3,
//       },
//     ];

//     const totalW = sizes.reduce((acc, s) => acc + s.w, 0);
//     const gap = 0;
//     const totalGroupWidth = totalW + gap * (sizes.length - 1);
//     const startX = (pageSize[0] - totalGroupWidth) / 2;

//     const baseY = 80;

//     let curX = startX;
//     for (let i = 0; i < sizes.length; i++) {
//       const s = sizes[i];
//       const img = await embedImage(pdfDoc, s.path);
//       if (img) {
//         page3.drawImage(img, { x: curX, y: baseY, width: s.w, height: s.h });
//       } else {
//         page3.drawRectangle({
//           x: curX,
//           y: baseY,
//           width: s.w,
//           height: s.h,
//           borderColor: rgb(0.6, 0.6, 0.6),
//           borderWidth: 1,
//         });
//         page3.drawText(s.path.split("/").pop(), {
//           x: curX + 8,
//           y: baseY + s.h / 2 - 6,
//           size: 10,
//           font: fontRegular,
//           color: rgb(0.5, 0.5, 0.5),
//         });
//       }
//       curX += s.w + gap;
//     }

//     // After images: activate & troubleshooting
//     const afterImgsY = baseY - 24;
//     drawWrapped(
//       page3,
//       "3. Activate Data: Set eSIM as Primary/Default Data Line and turn ON Data Roaming.",
//       marginLeft,
//       afterImgsY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "4. Troubleshooting: Restart phone, check APN = 'internet', ensure Mobile Data is ON.",
//       marginLeft,
//       afterImgsY - 36,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     // ---------- PAGE 4 ----------
//     const page4 = pdfDoc.addPage(pageSize);
//     page4.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });
//     page4.drawText("Support 24*7", {
//       x: marginLeft,
//       y: 780,
//       size: 20,
//       font: fontBold,
//       color: blue,
//     });

//     let y4 = 740;
//     drawWrapped(
//       page4,
//       "Helpline: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;
//     drawWrapped(
//       page4,
//       "WhatsApp: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;
//     drawWrapped(
//       page4,
//       `Email: ravi@eSimNow.ai`,
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );

//     // Quick reminders
//     y4 -= 34;
//     page4.drawText("Quick Reminders", {
//       x: marginLeft,
//       y: y4,
//       size: 14,
//       font: fontBold,
//       color: blue,
//     });

//     // ✅ DATAPACK FROM CSV
//     const dataPackText = vendorRow?.datapack
//       ? vendorRow.datapack
//       : "1 GB data valid for 7 days from activation";

//     // Bullets (first one dynamic)
//     const bullets = [
//       dataPackText, // ✅ comes from CSV
//       "Use WiFi when available to save data",
//       "No physical SIM needed – purely digital",
//       "QR code works only once – do not share",
//       "Complete your eKYC, keep your PAN/AADHAAR/PASSPORT handy",
//       "We offer Multi Country Regional Plans, Single Country Plans, World Plans and Lifelong validity plans. Choose as per your needs.",
//     ];

//     let by = y4 - 26;
//     bullets.forEach((b) => {
//       drawWrapped(
//         page4,
//         `• ${b}`,
//         marginLeft + 8,
//         by,
//         contentWidth - 16,
//         11,
//         fontRegular,
//       );
//       by -= 20;
//     });

//     const footerText = `www.${companyName}.ai`;
//     const footerSize = 36;
//     const footerWidth = fontBold.widthOfTextAtSize(footerText, footerSize);
//     const footerX = (pageSize[0] - footerWidth) / 2;
//     page4.drawText(footerText, {
//       x: footerX,
//       y: 150,
//       size: footerSize,
//       font: fontBold,
//     });

//     // Social icons
//     const socialIcons = [
//       {
//         url: "https://www.eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
//       },
//       {
//         url: "https://www.facebook.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
//       },
//       {
//         url: "https://www.instagram.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
//       },
//       {
//         url: "https://www.linkedin.com/company/esimnow",
//         icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
//       },
//       {
//         url: "https://x.com/eSimNow",
//         icon: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
//       },
//     ];
//     const iconSize = 32;
//     const spacing = 20;
//     const totalWidth = socialIcons.length * (iconSize + spacing) - spacing;
//     let iconStartX = (pageSize[0] - totalWidth) / 2;
//     const iconY = 80;
//     const annots = [];
//     for (const s of socialIcons) {
//       const resp = await fetch(s.icon);
//       const bytes = await resp.arrayBuffer();
//       const img = await pdfDoc.embedPng(bytes);
//       page4.drawImage(img, {
//         x: iconStartX,
//         y: iconY,
//         width: iconSize,
//         height: iconSize,
//       });
//       const annotRef = pdfDoc.context.register(
//         pdfDoc.context.obj({
//           Type: "Annot",
//           Subtype: "Link",
//           Rect: [iconStartX, iconY, iconStartX + iconSize, iconY + iconSize],
//           Border: [0, 0, 0],
//           A: pdfDoc.context.obj({ Type: "Action", S: "URI", URI: s.url }),
//         }),
//       );
//       annots.push(annotRef);
//       iconStartX += iconSize + spacing;
//     }
//     const pageAnnots =
//       page4.node.lookup(PDFName.of("Annots")) || pdfDoc.context.obj([]);
//     annots.forEach((a) => pageAnnots.push(a));
//     page4.node.set(PDFName.of("Annots"), pageAnnots);

//     return await pdfDoc.save();
//   }

//   function handleCsvUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploadedCsv(file);
//     const reader = new FileReader();
//     reader.onload = (ev) => parseCsv(ev.target.result);
//     reader.readAsText(file);
//   }

//   function handleLogoUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setUploadedLogo(ev.target.result);
//     reader.readAsArrayBuffer(file);
//   }
//   async function handleGenerateCsvOnly() {
//     setloadingTop(true);
//     try {
//       const generated = [];

//       for (const row of rows) {
//         const bytes = await buildPdfBytesCsvOnly(row, uploadedLogoTop);
//         const blob = new Blob([bytes], { type: "application/pdf" });
//         generated.push({
//           name: `${row.vendor_user_name || "Vendor"}.pdf`,
//           blob,
//           url: URL.createObjectURL(blob),
//         });
//       }

//       setPdfList(generated);
//       setShowModal(true);
//     } finally {
//       setloadingTop(false);
//     }
//   }

//   async function handleGenerateAll() {
//     setLoading(true);

//     try {
//       const generated = [];

//       for (let i = 0; i < rows.length; i++) {
//         const row = rows[i];
//         const qrData = zipQrList[i]; // ✅ index-based mapping

//         if (!qrData) continue;

//         const bytes = await buildPdfBytes(row, {
//           logoFile: uploadedLogo,
//           qrBuffer: qrData.buffer,
//           qrType: qrData.type,
//           iccFromZip: qrData.iccId,
//         });

//         const blob = new Blob([bytes], { type: "application/pdf" });

//         generated.push({
//           name: `${row.vendor_user_name || "Vendor"}_${qrData.iccId}.pdf`,
//           blob,
//           url: URL.createObjectURL(blob),
//         });
//       }

//       setPdfList(generated);
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDownloadAll() {
//     if (!pdfList.length) return alert("No PDFs to download.");

//     const zip = new JSZip();

//     // Create a folder inside the zip (optional)
//     const folder = zip.folder("Generated_PDFs");

//     pdfList.forEach((pdf) => {
//       folder.file(pdf.name, pdf.blob);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     saveAs(zipBlob, "All_PDFs.zip");
//   }

//   //   function resetTopBox() {
//   //     setUploadedCsvTop(null);
//   //     setUploadedLogoTop(null);
//   //     setloadingTop(false);
//   //   }
//   function resetTopBox() {
//     setUploadedCsvTop(null);
//     setUploadedLogoTop(null);
//     setloadingTop(false);

//     if (csvTopRef.current) csvTopRef.current.value = "";
//     if (logoTopRef.current) logoTopRef.current.value = "";
//   }

//   // 🔄 Reset BOTTOM box (CSV + ZIP)
//   function resetBottomBox() {
//     setUploadedCsv(null);
//     setUploadedLogo(null);
//     setUploadedZip(null);
//     setLoading(false);
//   }
//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-12 p-8">
//         {/* ================= CSV INSTRUCTIONS ================= */}
//         <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
//           {/* <h2 className="text-xl font-bold mb-4 text-gray-800">
//             📄 CSV & Upload Guidelines
//           </h2> */}

//           {/* CSV Columns */}
//           <div className="mb-4">
//             <h3 className="font-semibold text-gray-700 mb-2">
//               📄 Required CSV Column Names
//             </h3>

//             <div className="overflow-x-auto">
//               <div className="overflow-hidden rounded-xl border border-gray-300">
//                 <table className="w-full text-sm border-collapse">
//                   <thead className="bg-gray-50">
//                     <tr className="divide-x divide-gray-200">
//                       <th className="px-3 py-2 text-center font-medium">
//                         vendor_user_name
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         company_name
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         icc_id
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         datapack
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         qr_img
//                       </th>
//                     </tr>
//                   </thead>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* File Rules */}
//           <div className="grid md:grid-cols-2 gap-4 text-sm">
//             <div className="bg-gray-50 p-4 rounded">
//               <ul className="list-disc ml-5 space-y-1">
//                 📌 Logo PNG format only
//               </ul>
//             </div>

//             <div className="bg-gray-50 p-2 rounded">
//               <ul className="list-disc ml-5 space-y-1">
//                 <p>
//                   📌 QR Image name = ICC ID (e.g. <code>89444227.png</code>)
//                 </p>
//                 <p> 📌 PNG / JPG / JPEG supported</p>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* ================= TOP CARD : CSV ONLY ================= */}
//         <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
//           <h1 className="text-2xl font-bold mb-6">
//             PDF Generator (CSV)
//             <button
//               onClick={resetTopBox}
//               title="Reset"
//               className="relative  left-4 text-gray-400 hover:text-blue-600 transition"
//             >
//               <RotateCcw size={20} />
//             </button>
//           </h1>

//           <div className="flex flex-wrap justify-center gap-4 mb-6">
//             {/* CSV Upload (TOP) */}

//             <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//               {uploadedCsvTop ? uploadedCsvTop.name : "Upload CSV"}

//               <input
//                 ref={csvTopRef}
//                 type="file"
//                 accept=".csv"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;
//                   setUploadedCsvTop(file);

//                   const reader = new FileReader();
//                   reader.onload = (ev) => parseCsv(ev.target.result);
//                   reader.readAsText(file);
//                 }}
//               />
//             </label>

//             {/* Logo Upload (TOP) */}
//             <label className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
//               {uploadedLogoTop ? uploadedLogoTop.name : "Upload Logo"}
//               <input
//                 ref={logoTopRef}
//                 type="file"
//                 accept="image/png"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;

//                   if (
//                     file.type !== "image/png" &&
//                     !file.name.toLowerCase().endsWith(".png")
//                   ) {
//                     alert("Only PNG image files are allowed!");
//                     e.target.value = "";
//                     return;
//                   }

//                   setUploadedLogoTop(file);
//                 }}
//               />
//             </label>
//           </div>

//           <button
//             onClick={handleGenerateCsvOnly}
//             disabled={loadingTop || !uploadedCsvTop || !uploadedLogoTop}
//             className={`px-6 py-3 rounded text-white transition ${
//               loadingTop || !uploadedCsvTop || !uploadedLogoTop
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-teal-600 hover:bg-teal-700"
//             }`}
//           >
//             {loadingTop ? "Generating..." : "Generate PDFs"}
//           </button>
//         </div>

//         {/* ================= OR DIVIDER ================= */}
//         <div className="flex items-center gap-4">
//           <div className="w-24 h-px bg-gray-400"></div>
//           <span className="text-gray-500 font-semibold">OR</span>
//           <div className="w-24 h-px bg-gray-400"></div>
//         </div>

//         {/* ================= BOTTOM CARD : CSV + ZIP ================= */}
//         <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
//           <h1 className="text-2xl font-bold mb-6">
//             PDF Generator (CSV + QR ZIP)
//             <button
//               onClick={resetBottomBox}
//               title="Reset"
//               className="relative  left-4 text-gray-400 hover:text-blue-600 transition"
//             >
//               <RotateCcw size={20} />
//             </button>
//           </h1>

//           <div className="flex flex-wrap justify-center gap-4 mb-6">
//             {/* CSV Upload (BOTTOM) */}
//             <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//               {uploadedCsv ? uploadedCsv.name : "Upload CSV"}
//               <input
//                 type="file"
//                 accept=".csv"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;
//                   setUploadedCsv(file);

//                   const reader = new FileReader();
//                   reader.onload = (ev) => parseCsv(ev.target.result);
//                   reader.readAsText(file);
//                 }}
//               />
//             </label>

//             {/* Logo Upload (BOTTOM) */}
//             <label className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
//               {uploadedLogo ? uploadedLogo.name : "Upload Logo"}
//               <input
//                 type="file"
//                 accept="image/png"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;

//                   if (
//                     file.type !== "image/png" &&
//                     !file.name.toLowerCase().endsWith(".png")
//                   ) {
//                     alert("Only PNG image files are allowed!");
//                     e.target.value = "";
//                     return;
//                   }

//                   setUploadedLogo(file);
//                 }}
//               />
//             </label>

//             {/* ZIP Upload (BOTTOM) */}
//             <label className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition">
//               {uploadedZip ? uploadedZip.name : "Upload QR ZIP"}
//               <input
//                 type="file"
//                 accept=".zip"
//                 onChange={handleZipUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           <button
//             onClick={handleGenerateAll}
//             disabled={loading || !uploadedCsv || !uploadedLogo || !uploadedZip}
//             className={`px-6 py-3 rounded text-white transition ${
//               loading || !uploadedCsv || !uploadedLogo || !uploadedZip
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-teal-600 hover:bg-teal-700"
//             }`}
//           >
//             {loading ? "Generating..." : "Generate PDFs"}
//           </button>
//         </div>

//         {/* ================= MODAL (SHARED PREVIEW) ================= */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//             <div className="bg-white rounded-lg w-[90%] max-w-5xl h-[95vh] flex flex-col">
//               <div className="flex justify-between items-center p-3 border-b bg-gray-200">
//                 <h2 className="text-lg font-semibold">All PDF Previews</h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
//                 >
//                   Close
//                 </button>
//               </div>

//               <div className="overflow-y-auto flex-1 p-4 space-y-4">
//                 {pdfList.map((pdf, idx) => (
//                   <div key={idx} className="border rounded shadow">
//                     <div className="bg-gray-50 px-3 py-2 font-medium border-b">
//                       {pdf.name}
//                     </div>
//                     <iframe
//                       title={pdf.name}
//                       src={pdf.url}
//                       className="w-full h-[500px]"
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-center p-3 border-t bg-gray-200">
//                 <button
//                   onClick={handleDownloadAll}
//                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
//                 >
//                   Download All
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
// !==============
// import React, { useEffect, useState, useRef } from "react";
// import Papa from "papaparse";
// import { RotateCcw } from "lucide-react";

// import { PDFDocument, StandardFonts, rgb, PDFName } from "pdf-lib";
// import { saveAs } from "file-saver";

// import androidImgSrc from "../../public/PDFGeneratorImages/android.png";
// import appleImgSrc from "../../public/PDFGeneratorImages/Apple.png";
// import difference from "../../public/PDFGeneratorImages/diff.png";
// import image from "../../public/PDFGeneratorImages/image.png";
// import image1 from "../../public/PDFGeneratorImages/image1.png";
// import image2 from "../../public/PDFGeneratorImages/image2.png";
// import image3 from "../../public/PDFGeneratorImages/image3.png";
// import JSZip from "jszip";

// // ✅ HELPER: Sanitize text for PDF (remove non-WinAnsi chars but KEEP SPACES)
// function sanitizeForPdf(text) {
//   if (!text) return "";
//   return String(text)
//     .replace(/[^\x20-\x7E]/g, "") // Remove non-ASCII (but \x20 is space, so it stays!)
//     .trim();
// }

// // ✅ HELPER: Convert scientific notation ICC IDs to full string WITHOUT precision loss
// function parseIccId(value) {
//   if (!value) return "";

//   let icc = String(value).trim();

//   // Handle scientific notation (e.g., 8.94442E+18)
//   if (icc.includes("E") || icc.includes("e")) {
//     try {
//       // ✅ Manual string conversion to avoid JavaScript number precision issues
//       const parts = icc.split(/[Ee]/);
//       const coefficient = parts[0];
//       const exponent = parseInt(parts[1], 10);

//       // Remove decimal point
//       let digits = coefficient.replace(".", "");

//       // Calculate where decimal point was
//       const decimalPos = coefficient.indexOf(".");
//       let zerosToAdd = 0;

//       if (decimalPos === -1) {
//         // No decimal point, just add zeros
//         zerosToAdd = exponent;
//       } else {
//         // Had decimal point, account for existing decimal places
//         const decimalPlaces = coefficient.length - decimalPos - 1;
//         zerosToAdd = exponent - decimalPlaces;
//       }

//       // Add the zeros
//       if (zerosToAdd > 0) {
//         icc = digits + "0".repeat(zerosToAdd);
//       } else {
//         icc = digits;
//       }

//       // Remove any leading zeros (but keep the number)
//       icc = icc.replace(/^0+/, "") || "0";
//     } catch (e) {
//       console.warn("Failed to parse ICC ID:", icc, e);
//     }
//   }

//   return icc.replace(/['"]/g, "").trim();
// }

// export default function KitDownload() {
//   const csvTopRef = useRef(null);
//   const logoTopRef = useRef(null);

//   // without zip
//   const [uploadedCsvTop, setUploadedCsvTop] = useState(null);
//   const [uploadedLogoTop, setUploadedLogoTop] = useState(null);
//   const [loadingTop, setloadingTop] = useState(false);

//   // ZIP related
//   const [uploadedZip, setUploadedZip] = useState(null);
//   const [zipQrList, setZipQrList] = useState([]);

//   const [rows, setRows] = useState([]);
//   const [pdfList, setPdfList] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploadedCsv, setUploadedCsv] = useState(null);
//   const [uploadedLogo, setUploadedLogo] = useState(null);

//   async function handleZipUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadedZip(file);

//     const zip = await JSZip.loadAsync(file);
//     const qrList = [];

//     for (const entry of Object.values(zip.files)) {
//       if (entry.dir) continue;
//       if (!entry.name.match(/\.(png|jpg|jpeg)$/i)) continue;

//       const buffer = await entry.async("arraybuffer");
//       const iccId = entry.name
//         .split("/")
//         .pop()
//         .replace(/\.(png|jpg|jpeg)$/i, "");

//       const type = entry.name.toLowerCase().endsWith(".png") ? "png" : "jpg";

//       qrList.push({ iccId, buffer, type });
//     }

//     setZipQrList(qrList);
//   }

//   useEffect(() => {
//     fetch("/data.csv")
//       .then((r) => {
//         if (!r.ok) throw new Error("no-csv");
//         return r.text();
//       })
//       .then((text) => parseCsv(text))
//       .catch(() =>
//         setRows([
//           {
//             vendor_user_name: "Demo Vendor",
//             qr_img: "/images/sampleQR.png",
//             icc_id: "8944422711107390000",
//           },
//         ]),
//       );
//   }, []);

//   function parseCsv(text) {
//     // ✅ Detect delimiter (comma or tab)
//     const firstLine = text.split("\n")[0];
//     const delimiter = firstLine.includes("\t") ? "\t" : ",";

//     console.log(
//       `📄 CSV Delimiter detected: ${delimiter === "\t" ? "TAB" : "COMMA"}`,
//     );

//     Papa.parse(text, {
//       header: true,
//       skipEmptyLines: true,
//       delimiter: delimiter, // Use detected delimiter
//       dynamicTyping: false, // Keep everything as strings
//       transform: (value, field) => {
//         // ✅ CRITICAL: Force ICC fields to stay as strings
//         if (field === "icc_id" || field === "ICCID") {
//           return String(value).trim();
//         }
//         return value;
//       },
//       complete: (res) => {
//         if (!res?.data?.length) return;

//         console.log("📦 FULL RAW CSV DATA:", res.data);

//         const fixed = res.data.map((r, index) => {
//           // ✅ Get raw values BEFORE any processing
//           const rawVendorName = r.vendor_user_name || "";
//           const rawCompanyName = r.company_name || "";
//           const rawDatapack = r.datapack || "";
//           const rawIcc = r.icc_id || r.ICCID || "";

//           console.log(`\n=== ROW ${index + 1}: ${rawVendorName} ===`);
//           console.log("Raw vendor name:", JSON.stringify(rawVendorName));
//           console.log("Raw ICC:", JSON.stringify(rawIcc));
//           console.log("ICC Type:", typeof rawIcc);
//           console.log("ICC Length:", rawIcc.length);

//           const qr = String(r.qr_img || "").trim();

//           // ✅ Process ICC ID - keep as string, no conversion
//           let icc = String(rawIcc).trim();

//           // Only parse if it has scientific notation
//           if (icc.includes("E") || icc.includes("e")) {
//             const original = icc;
//             icc = parseIccId(icc);
//             console.log(`Converted ${original} → ${icc}`);
//           } else {
//             console.log("ICC already in full format:", icc);
//           }

//           // Derive ICC from filename if missing
//           if (!icc && qr) {
//             icc = qr
//               .split("/")
//               .pop()
//               .replace(/\.(png|jpg|jpeg)$/i, "");
//           }

//           // ✅ Sanitize for PDF (should preserve spaces!)
//           const vendorName = sanitizeForPdf(rawVendorName);
//           const companyName = sanitizeForPdf(rawCompanyName);
//           const datapack = sanitizeForPdf(rawDatapack);

//           console.log("After sanitize vendor:", JSON.stringify(vendorName));
//           console.log("Vendor has spaces:", vendorName.includes(" "));
//           console.log("Final ICC:", JSON.stringify(icc));
//           console.log("---");

//           return {
//             ...r,
//             qr_img: qr,
//             icc_id: icc,
//             vendor_user_name: vendorName,
//             company_name: companyName,
//             datapack: datapack,
//           };
//         });

//         console.log("\n✅ FINAL PROCESSED ROWS:", fixed);
//         console.log("\n🔍 ICC IDs in order:");
//         fixed.forEach((row, i) => {
//           console.log(`${i + 1}. ${row.vendor_user_name}: ${row.icc_id}`);
//         });

//         setRows(fixed);
//       },
//     });
//   }

//   async function embedImage(pdfDoc, src) {
//     if (!src) {
//       console.warn("embedImage: No source provided");
//       return null;
//     }

//     try {
//       let fetchUrl = src;

//       const resp = await fetch(fetchUrl);
//       if (!resp.ok) {
//         console.error(
//           `Failed to fetch ${src}: ${resp.status} ${resp.statusText}`,
//         );
//         return null;
//       }

//       const blob = await resp.blob();

//       if (blob.size === 0) {
//         console.error("Empty blob received for:", src);
//         return null;
//       }

//       // Convert to PNG using canvas
//       const bitmap = await createImageBitmap(blob);

//       const canvas = document.createElement("canvas");
//       canvas.width = bitmap.width;
//       canvas.height = bitmap.height;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(bitmap, 0, 0);

//       const pngBlob = await new Promise((res) =>
//         canvas.toBlob(res, "image/png"),
//       );

//       const buffer = await pngBlob.arrayBuffer();

//       return await pdfDoc.embedPng(buffer);
//     } catch (e) {
//       console.error("Image embed failed:", src, e);
//       return null;
//     }
//   }

//   function drawWrapped(
//     page,
//     text,
//     x,
//     y,
//     maxWidth,
//     size,
//     font,
//     color = rgb(0, 0, 0),
//   ) {
//     // ✅ Sanitize text before drawing
//     const sanitized = sanitizeForPdf(text);
//     const words = sanitized.split(/\s+/);
//     let line = "";
//     const lineHeight = size + 4;
//     let cursorY = y;
//     for (let word of words) {
//       const test = line ? line + " " + word : word;
//       let w = 0;
//       try {
//         w = font.widthOfTextAtSize(test, size);
//       } catch {
//         w = test.length * size * 0.5;
//       }
//       if (w > maxWidth && line) {
//         page.drawText(line, { x, y: cursorY, size, font, color });
//         line = word;
//         cursorY -= lineHeight;
//       } else {
//         line = test;
//       }
//     }
//     if (line) page.drawText(line, { x, y: cursorY, size, font, color });
//   }

//   async function buildPdfBytesCsvOnly(vendorRow, logoFileTop) {
//     const pdfDoc = await PDFDocument.create();
//     const pageSize = [595, 842];
//     const marginLeft = 40;
//     const contentWidth = pageSize[0] - marginLeft * 2;

//     const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const yellowBg = rgb(1, 0.94, 0.6);
//     const greenBg = rgb(0.7, 1, 0.7);
//     const blue = rgb(0.05, 0.32, 0.75);

//     // ✅ Sanitize all text fields
//     const vendorName =
//       sanitizeForPdf(vendorRow?.vendor_user_name) || "Esteemed Traveler";
//     const companyName = sanitizeForPdf(vendorRow?.company_name) || "eSimNow.ai";
//     const iccId = parseIccId(vendorRow?.icc_id || vendorRow?.ICCID);
//     const qrSource =
//       vendorRow?.["qr_img"]?.trim() ||
//       `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

//     // ---------- PAGE 1 ----------
//     const page1 = pdfDoc.addPage(pageSize);
//     page1.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });

//     page1.drawText("Welcome to the world of ESim powered by", {
//       x: marginLeft,
//       y: 760,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });

//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: 724,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });

//     page1.drawText(`Dear ${vendorName},`, {
//       x: marginLeft,
//       y: 684,
//       size: 14,
//       font: fontBold,
//     });

//     let yPos = 656;
//     drawWrapped(
//       page1,
//       "We are delighted to welcome you to eSimNow.ai! The world's leading eSim Marketplace.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 36;

//     function drawInlineBoldParagraph(
//       page,
//       x,
//       y,
//       contentParts,
//       maxWidth,
//       fontSize,
//     ) {
//       let cursorX = x,
//         cursorY = y;

//       for (const part of contentParts) {
//         const font = part.bold ? fontBold : fontRegular;
//         // ✅ Sanitize each part
//         const sanitized = sanitizeForPdf(part.text);
//         for (const word of sanitized.split(" ")) {
//           const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
//           if (cursorX + wordWidth > x + maxWidth) {
//             cursorX = x;
//             cursorY -= fontSize + 4;
//           }
//           page.drawText(word + " ", {
//             x: cursorX,
//             y: cursorY,
//             size: fontSize,
//             font,
//           });
//           cursorX += wordWidth;
//         }
//       }
//       return cursorY;
//     }

//     const inlineParts = [
//       { text: "With your ", bold: false },
//       { text: "180 countries, ", bold: true },
//       {
//         text: "enjoy instant connectivity the moment you land, with high speed 4G/5G networks without worrying about local SIM cards or high international roaming charges.",
//         bold: false,
//       },
//     ];

//     yPos = drawInlineBoldParagraph(
//       page1,
//       marginLeft,
//       yPos,
//       inlineParts,
//       contentWidth,
//       12,
//     );

//     yPos -= 72;
//     drawWrapped(
//       page1,
//       "Now connect your laptop, tablets and mobile all with our no-limit tethering option. Top-up or buy new eSIMs with a single button click.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;

//     drawWrapped(
//       page1,
//       "We wish you a pleasant journey and seamless digital experience.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;

//     page1.drawText("Warm Regards,", {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontRegular,
//     });
//     yPos -= 18;

//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontBold,
//     });

//     // ---------- PAGE 2 ----------
//     const page2 = pdfDoc.addPage(pageSize);
//     page2.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: greenBg,
//     });

//     drawWrapped(
//       page2,
//       "Here is your very own personalized eSim Profile, scan and install in one click",
//       marginLeft,
//       760,
//       contentWidth,
//       16,
//       fontBold,
//       blue,
//     );

//     const qrSize = 150;
//     const qrY = 450;
//     const qrX = (page2.getWidth() - qrSize) / 2;

//     // White box behind QR
//     page2.drawRectangle({
//       x: qrX - 10,
//       y: qrY - 40,
//       width: qrSize + 20,
//       height: qrSize + 100,
//       color: rgb(1, 1, 1),
//     });

//     // QR from CSV image path
//     let qrImage = null;
//     try {
//       let qrPath = qrSource;

//       console.log("Attempting to load QR from:", qrPath);

//       if (qrPath && !qrPath.startsWith("http") && !qrPath.startsWith("/")) {
//         qrPath = `/images/${qrPath}`;
//       }

//       qrImage = await embedImage(pdfDoc, qrPath);

//       if (!qrImage) {
//         console.error("QR image failed to load from path:", qrPath);
//       }
//     } catch (err) {
//       console.error(
//         "QR image error (CSV only module):",
//         err,
//         "Path was:",
//         qrSource,
//       );
//     }

//     if (qrImage) {
//       const dims = qrImage.scale(1);
//       const scale = qrSize / dims.width;
//       page2.drawImage(qrImage, {
//         x: qrX,
//         y: qrY + 40,
//         width: dims.width * scale,
//         height: dims.height * scale,
//       });
//     } else {
//       page2.drawText("QR CODE NOT FOUND", {
//         x: qrX + 10,
//         y: qrY + qrSize / 2 - 5,
//         size: 10,
//         font: fontBold,
//         color: rgb(1, 0, 0),
//       });
//     }

//     // Logo
//     let logoImg = null;
//     try {
//       if (logoFileTop instanceof File) {
//         const buffer = await logoFileTop.arrayBuffer();
//         if (logoFileTop.type.includes("png")) {
//           logoImg = await pdfDoc.embedPng(buffer);
//         } else if (
//           logoFileTop.type.includes("jpeg") ||
//           logoFileTop.type.includes("jpg")
//         ) {
//           logoImg = await pdfDoc.embedJpg(buffer);
//         }
//       } else {
//         logoImg = await embedImage(pdfDoc, "/images/logo.png");
//       }
//     } catch (err) {
//       console.warn("Logo not found (CSV only module):", err);
//     }

//     if (logoImg) {
//       const dims = logoImg.scale(1);
//       const scale = Math.min(100 / dims.width, 40 / dims.height);
//       const lw = dims.width * scale;
//       const lh = dims.height * scale;
//       const lx = (page2.getWidth() - lw) / 2;
//       const ly = qrY - 15;
//       page2.drawImage(logoImg, { x: lx, y: ly, width: lw, height: lh });
//     }

//     // ICC ID under logo
//     const displayIccId = iccId || "N/A";
//     const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
//     page2.drawText(displayIccId, {
//       x: qrX + qrSize / 2 - iccWidth / 2,
//       y: qrY - 60,
//       size: 12,
//       font: fontBold,
//       color: rgb(0, 0, 0),
//     });

//     // Installation videos
//     drawWrapped(
//       page2,
//       "For Installation Support refer to the videos below:",
//       marginLeft,
//       qrY - 130,
//       contentWidth,
//       12,
//       fontRegular,
//     );

//     const appleImg = await embedImage(pdfDoc, appleImgSrc);
//     const androidImg = await embedImage(pdfDoc, androidImgSrc);

//     let supportY = qrY - 160;
//     let cursorX = marginLeft;

//     if (appleImg) {
//       const dims = appleImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(appleImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }

//     page2.drawText("Apple iOS: https://player.vimeo.com/video/1042080274", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     supportY -= 18;
//     cursorX = marginLeft;

//     if (androidImg) {
//       const dims = androidImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(androidImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }

//     page2.drawText("Android: https://player.vimeo.com/video/1042080269", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     // ---------- PAGE 3 ----------
//     const page3 = pdfDoc.addPage(pageSize);
//     page3.drawRectangle({
//       x: 0,
//       y: pageSize[1] / 2,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: rgb(1, 1, 1),
//     });
//     page3.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: greenBg,
//     });

//     page3.drawText("One-Page Technical Manual", {
//       x: marginLeft,
//       y: 800,
//       size: 13,
//       font: fontBold,
//       color: blue,
//     });

//     drawWrapped(
//       page3,
//       "1. Check Compatibility: Ensure your phone supports eSim (iPhone XS or later, most recent Samsung/Google Pixel).",
//       marginLeft,
//       770,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     drawWrapped(
//       page3,
//       "2. To check whether your Android phone is eSim compatible dial *#06#",
//       marginLeft,
//       740,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     const whiteImg = await embedImage(pdfDoc, difference);
//     if (whiteImg) {
//       const maxW = pageSize[0] - marginLeft * 2;
//       const maxH = 160;
//       const dims = whiteImg.scale(1);
//       const scale = Math.min(maxW / dims.width, maxH / dims.height);
//       const w = dims.width * scale;
//       const h = dims.height * scale;
//       const x = (pageSize[0] - w) / 2;
//       const yImg = pageSize[1] / 2 + 60;
//       page3.drawImage(whiteImg, { x, y: yImg, width: w, height: h });
//     }

//     const greenStartY = pageSize[1] / 2 - 20;
//     drawWrapped(
//       page3,
//       "3. Install eSIM: Go to Settings > Mobile/Cellular > Add Mobile Plan and scan the QR code.",
//       marginLeft,
//       greenStartY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "ANDROID",
//       marginLeft,
//       greenStartY - 40,
//       contentWidth,
//       12,
//       fontBold,
//     );

//     const cmToPts = 28.35;
//     const sizes = [
//       { h: 10.43 * cmToPts, w: 4.67 * cmToPts, path: image1 },
//       { h: 9.86 * cmToPts, w: 4.66 * cmToPts, path: image2 },
//       { h: 8.92 * cmToPts, w: 4.07 * cmToPts, path: image3 },
//     ];

//     const totalW = sizes.reduce((acc, s) => acc + s.w, 0);
//     const gap = 0;
//     const totalGroupWidth = totalW + gap * (sizes.length - 1);
//     const startX = (pageSize[0] - totalGroupWidth) / 2;
//     const baseY = 80;

//     let curX = startX;
//     for (let i = 0; i < sizes.length; i++) {
//       const s = sizes[i];
//       const img = await embedImage(pdfDoc, s.path);
//       if (img) {
//         page3.drawImage(img, { x: curX, y: baseY, width: s.w, height: s.h });
//       } else {
//         page3.drawRectangle({
//           x: curX,
//           y: baseY,
//           width: s.w,
//           height: s.h,
//           borderColor: rgb(0.6, 0.6, 0.6),
//           borderWidth: 1,
//         });
//         page3.drawText(s.path.split("/").pop(), {
//           x: curX + 8,
//           y: baseY + s.h / 2 - 6,
//           size: 10,
//           font: fontRegular,
//           color: rgb(0.5, 0.5, 0.5),
//         });
//       }
//       curX += s.w + gap;
//     }

//     const afterImgsY = baseY - 24;
//     drawWrapped(
//       page3,
//       "3. Activate Data: Set eSIM as Primary/Default Data Line and turn ON Data Roaming.",
//       marginLeft,
//       afterImgsY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "4. Troubleshooting: Restart phone, check APN = 'internet', ensure Mobile Data is ON.",
//       marginLeft,
//       afterImgsY - 36,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     // ---------- PAGE 4 ----------
//     const page4 = pdfDoc.addPage(pageSize);
//     page4.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });

//     page4.drawText("Support 24*7", {
//       x: marginLeft,
//       y: 780,
//       size: 20,
//       font: fontBold,
//       color: blue,
//     });

//     let y4 = 740;
//     drawWrapped(
//       page4,
//       "Helpline: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;

//     drawWrapped(
//       page4,
//       "WhatsApp: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;

//     drawWrapped(
//       page4,
//       `Email: ravi@eSimNow.ai`,
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 34;

//     page4.drawText("Quick Reminders", {
//       x: marginLeft,
//       y: y4,
//       size: 14,
//       font: fontBold,
//       color: blue,
//     });

//     // ✅ Sanitize datapack
//     const dataPackText =
//       sanitizeForPdf(vendorRow?.datapack) ||
//       "1 GB data valid for 7 days from activation";

//     const bullets = [
//       dataPackText,
//       "Use WiFi when available to save data",
//       "No physical SIM needed - purely digital",
//       "QR code works only once - do not share",
//       "Complete your eKYC, keep your PAN/AADHAAR/PASSPORT handy",
//       "We offer Multi Country Regional Plans, Single Country Plans, World Plans and Lifelong validity plans. Choose as per your needs.",
//     ];

//     let by = y4 - 26;
//     bullets.forEach((b) => {
//       drawWrapped(
//         page4,
//         `• ${b}`,
//         marginLeft + 8,
//         by,
//         contentWidth - 16,
//         11,
//         fontRegular,
//       );
//       by -= 20;
//     });

//     const footerText = `www.${companyName}.ai`;
//     const footerSize = 36;
//     const footerWidth = fontBold.widthOfTextAtSize(footerText, footerSize);
//     const footerX = (pageSize[0] - footerWidth) / 2;

//     page4.drawText(footerText, {
//       x: footerX,
//       y: 150,
//       size: footerSize,
//       font: fontBold,
//     });

//     const socialIcons = [
//       {
//         url: "https://www.eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
//       },
//       {
//         url: "https://www.facebook.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
//       },
//       {
//         url: "https://www.instagram.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
//       },
//       {
//         url: "https://www.linkedin.com/company/esimnow",
//         icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
//       },
//       {
//         url: "https://x.com/eSimNow",
//         icon: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
//       },
//     ];

//     const iconSize = 32;
//     const spacing = 20;
//     const totalWidthIcons = socialIcons.length * (iconSize + spacing) - spacing;
//     let iconStartX = (pageSize[0] - totalWidthIcons) / 2;
//     const iconY = 80;
//     const annots = [];

//     for (const s of socialIcons) {
//       const resp = await fetch(s.icon);
//       const bytes = await resp.arrayBuffer();
//       const img = await pdfDoc.embedPng(bytes);

//       page4.drawImage(img, {
//         x: iconStartX,
//         y: iconY,
//         width: iconSize,
//         height: iconSize,
//       });

//       const annotRef = pdfDoc.context.register(
//         pdfDoc.context.obj({
//           Type: "Annot",
//           Subtype: "Link",
//           Rect: [iconStartX, iconY, iconStartX + iconSize, iconY + iconSize],
//           Border: [0, 0, 0],
//           A: pdfDoc.context.obj({ Type: "Action", S: "URI", URI: s.url }),
//         }),
//       );

//       annots.push(annotRef);
//       iconStartX += iconSize + spacing;
//     }

//     const pageAnnots =
//       page4.node.lookup(PDFName.of("Annots")) || pdfDoc.context.obj([]);
//     annots.forEach((a) => pageAnnots.push(a));
//     page4.node.set(PDFName.of("Annots"), pageAnnots);

//     return await pdfDoc.save();
//   }

//   async function buildPdfBytes(vendorRow, options = {}) {
//     const {
//       logoFile = null,
//       qrBuffer = null,
//       qrType = null,
//       iccFromZip = null,
//     } = options;

//     let iccId = iccFromZip
//       ? iccFromZip
//       : parseIccId(vendorRow?.icc_id || vendorRow?.ICCID);

//     const pdfDoc = await PDFDocument.create();
//     const pageSize = [595, 842];
//     const marginLeft = 40;
//     const contentWidth = pageSize[0] - marginLeft * 2;

//     const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const yellowBg = rgb(1, 0.94, 0.6);
//     const greenBg = rgb(0.7, 1, 0.7);
//     const blue = rgb(0.05, 0.32, 0.75);

//     // ✅ Sanitize all text
//     const vendorName =
//       sanitizeForPdf(vendorRow?.vendor_user_name) || "Esteemed Traveler";
//     const companyName = sanitizeForPdf(vendorRow?.company_name) || "eSimNow.ai";
//     const qrSource =
//       vendorRow?.["qr_img"]?.trim() ||
//       `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

//     // ---------- PAGE 1 ----------
//     const page1 = pdfDoc.addPage(pageSize);
//     page1.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });
//     page1.drawText("Welcome to the world of ESim powered by", {
//       x: marginLeft,
//       y: 760,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });
//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: 724,
//       size: 24,
//       font: fontBold,
//       color: blue,
//     });
//     page1.drawText(`Dear ${vendorName},`, {
//       x: marginLeft,
//       y: 684,
//       size: 14,
//       font: fontBold,
//     });

//     let yPos = 656;
//     drawWrapped(
//       page1,
//       "We are delighted to welcome you to eSimNow.ai! The world's leading eSim Marketplace.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 36;

//     function drawInlineBoldParagraph(
//       page,
//       x,
//       y,
//       contentParts,
//       maxWidth,
//       fontSize,
//     ) {
//       let cursorX = x,
//         cursorY = y;
//       for (const part of contentParts) {
//         const font = part.bold ? fontBold : fontRegular;
//         const sanitized = sanitizeForPdf(part.text);
//         for (const word of sanitized.split(" ")) {
//           const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
//           if (cursorX + wordWidth > x + maxWidth) {
//             cursorX = x;
//             cursorY -= fontSize + 4;
//           }
//           page.drawText(word + " ", {
//             x: cursorX,
//             y: cursorY,
//             size: fontSize,
//             font,
//           });
//           cursorX += wordWidth;
//         }
//       }
//       return cursorY;
//     }

//     const inlineParts = [
//       { text: "With your ", bold: false },
//       { text: "180 countries, ", bold: true },
//       {
//         text: "enjoy instant connectivity the moment you land, with high speed 4G/5G networks without worrying about local SIM cards or high international roaming charges.",
//         bold: false,
//       },
//     ];
//     yPos = drawInlineBoldParagraph(
//       page1,
//       marginLeft,
//       yPos,
//       inlineParts,
//       contentWidth,
//       12,
//     );

//     yPos -= 72;
//     drawWrapped(
//       page1,
//       "Now connect your laptop, tablets and mobile all with our no-limit tethering option. Top-up or buy new eSIMs with a single button click.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;
//     drawWrapped(
//       page1,
//       "We wish you a pleasant journey and seamless digital experience.",
//       marginLeft,
//       yPos,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     yPos -= 48;
//     page1.drawText("Warm Regards,", {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontRegular,
//     });
//     yPos -= 18;
//     page1.drawText(companyName, {
//       x: marginLeft,
//       y: yPos,
//       size: 12,
//       font: fontBold,
//     });

//     // ---------- PAGE 2 (similar sanitization applied throughout) ----------
//     const page2 = pdfDoc.addPage(pageSize);
//     page2.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: greenBg,
//     });

//     drawWrapped(
//       page2,
//       "Here is your very own personalized eSim Profile, scan and install in one click",
//       marginLeft,
//       760,
//       contentWidth,
//       16,
//       fontBold,
//       blue,
//     );

//     const qrSize = 150;
//     const qrY = 450;
//     const qrX = (page2.getWidth() - qrSize) / 2;

//     page2.drawRectangle({
//       x: qrX - 10,
//       y: qrY - 40,
//       width: qrSize + 20,
//       height: qrSize + 100,
//       color: rgb(1, 1, 1),
//     });

//     let qrImage = null;

//     try {
//       if (qrBuffer instanceof ArrayBuffer) {
//         qrImage =
//           qrType === "jpg"
//             ? await pdfDoc.embedJpg(qrBuffer)
//             : await pdfDoc.embedPng(qrBuffer);
//       } else {
//         let qrPath = vendorRow?.["qr_img"]?.trim();
//         if (qrPath && !qrPath.startsWith("http")) {
//           qrPath = `/images/${qrPath.split("/").pop()}`;
//         }
//         qrImage = await embedImage(pdfDoc, qrPath);
//       }
//     } catch (err) {
//       console.warn("QR image failed:", err);
//     }

//     if (qrImage) {
//       const dims = qrImage.scale(1);
//       const scale = qrSize / dims.width;
//       page2.drawImage(qrImage, {
//         x: qrX,
//         y: qrY + 40,
//         width: dims.width * scale,
//         height: dims.height * scale,
//       });
//     } else {
//       page2.drawText("QR CODE NOT FOUND", {
//         x: qrX + 10,
//         y: qrY + qrSize / 2 - 5,
//         size: 10,
//         font: fontBold,
//         color: rgb(1, 0, 0),
//       });
//     }

//     let logoImg = null;

//     try {
//       if (logoFile instanceof File) {
//         const buffer = await logoFile.arrayBuffer();

//         if (logoFile.type.includes("png")) {
//           logoImg = await pdfDoc.embedPng(buffer);
//         } else if (
//           logoFile.type.includes("jpeg") ||
//           logoFile.type.includes("jpg")
//         ) {
//           logoImg = await pdfDoc.embedJpg(buffer);
//         }
//       } else {
//         logoImg = await embedImage(pdfDoc, "/images/logo.png");
//       }
//     } catch (err) {
//       console.warn("Logo not found:", err);
//     }

//     if (logoImg) {
//       const dims = logoImg.scale(1);
//       const scale = Math.min(100 / dims.width, 40 / dims.height);
//       const lw = dims.width * scale;
//       const lh = dims.height * scale;
//       const lx = (page2.getWidth() - lw) / 2;
//       const ly = qrY - 15;
//       page2.drawImage(logoImg, { x: lx, y: ly, width: lw, height: lh });
//     }

//     const displayIccId = iccId || "N/A";
//     const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
//     page2.drawText(displayIccId, {
//       x: qrX + qrSize / 2 - iccWidth / 2,
//       y: qrY - 60,
//       size: 12,
//       font: fontBold,
//       color: rgb(0, 0, 0),
//     });

//     drawWrapped(
//       page2,
//       "For Installation Support refer to the videos below:",
//       marginLeft,
//       qrY - 130,
//       contentWidth,
//       12,
//       fontRegular,
//     );

//     const appleImg = await embedImage(pdfDoc, appleImgSrc);
//     const androidImg = await embedImage(pdfDoc, androidImgSrc);
//     let supportY = qrY - 160;
//     let cursorX = marginLeft;

//     if (appleImg) {
//       const dims = appleImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(appleImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }
//     page2.drawText("Apple iOS: https://player.vimeo.com/video/1042080274", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     supportY -= 18;
//     cursorX = marginLeft;

//     if (androidImg) {
//       const dims = androidImg.scale(1);
//       const sc = 12 / dims.width;
//       page2.drawImage(androidImg, {
//         x: cursorX,
//         y: supportY - 2,
//         width: dims.width * sc,
//         height: dims.height * sc,
//       });
//       cursorX += dims.width * sc + 8;
//     }
//     page2.drawText("Android: https://player.vimeo.com/video/1042080269", {
//       x: cursorX,
//       y: supportY,
//       size: 11,
//       font: fontRegular,
//     });

//     // ---------- PAGE 3 ----------
//     const page3 = pdfDoc.addPage(pageSize);
//     page3.drawRectangle({
//       x: 0,
//       y: pageSize[1] / 2,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: rgb(1, 1, 1),
//     });
//     page3.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1] / 2,
//       color: greenBg,
//     });

//     page3.drawText("One-Page Technical Manual", {
//       x: marginLeft,
//       y: 800,
//       size: 13,
//       font: fontBold,
//       color: blue,
//     });

//     drawWrapped(
//       page3,
//       "1. Check Compatibility: Ensure your phone supports eSim (iPhone XS or later, most recent Samsung/Google Pixel).",
//       marginLeft,
//       770,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "2. To check whether your Android phone is eSim compatible dial *#06#",
//       marginLeft,
//       740,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     const whiteImgPath = difference;
//     const whiteImg = await embedImage(pdfDoc, whiteImgPath);
//     if (whiteImg) {
//       const maxW = pageSize[0] - marginLeft * 2;
//       const maxH = 160;
//       const dims = whiteImg.scale(1);
//       const scale = Math.min(maxW / dims.width, maxH / dims.height);
//       const w = dims.width * scale;
//       const h = dims.height * scale;
//       const x = (pageSize[0] - w) / 2;
//       const yImg = pageSize[1] / 2 + 60;
//       page3.drawImage(whiteImg, { x, y: yImg, width: w, height: h });
//     }

//     const greenStartY = pageSize[1] / 2 - 20;
//     drawWrapped(
//       page3,
//       "3. Install eSIM: Go to Settings > Mobile/Cellular > Add Mobile Plan and scan the QR code.",
//       marginLeft,
//       greenStartY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "ANDROID",
//       marginLeft,
//       greenStartY - 40,
//       contentWidth,
//       12,
//       fontBold,
//     );

//     const cmToPts = 28.35;
//     const sizes = [
//       {
//         h: 10.43 * cmToPts,
//         w: 4.67 * cmToPts,
//         path: image1,
//       },
//       {
//         h: 9.86 * cmToPts,
//         w: 4.66 * cmToPts,
//         path: image2,
//       },
//       {
//         h: 8.92 * cmToPts,
//         w: 4.07 * cmToPts,
//         path: image3,
//       },
//     ];

//     const totalW = sizes.reduce((acc, s) => acc + s.w, 0);
//     const gap = 0;
//     const totalGroupWidth = totalW + gap * (sizes.length - 1);
//     const startX = (pageSize[0] - totalGroupWidth) / 2;

//     const baseY = 80;

//     let curX = startX;
//     for (let i = 0; i < sizes.length; i++) {
//       const s = sizes[i];
//       const img = await embedImage(pdfDoc, s.path);
//       if (img) {
//         page3.drawImage(img, { x: curX, y: baseY, width: s.w, height: s.h });
//       } else {
//         page3.drawRectangle({
//           x: curX,
//           y: baseY,
//           width: s.w,
//           height: s.h,
//           borderColor: rgb(0.6, 0.6, 0.6),
//           borderWidth: 1,
//         });
//         page3.drawText(s.path.split("/").pop(), {
//           x: curX + 8,
//           y: baseY + s.h / 2 - 6,
//           size: 10,
//           font: fontRegular,
//           color: rgb(0.5, 0.5, 0.5),
//         });
//       }
//       curX += s.w + gap;
//     }

//     const afterImgsY = baseY - 24;
//     drawWrapped(
//       page3,
//       "3. Activate Data: Set eSIM as Primary/Default Data Line and turn ON Data Roaming.",
//       marginLeft,
//       afterImgsY,
//       contentWidth,
//       11,
//       fontRegular,
//     );
//     drawWrapped(
//       page3,
//       "4. Troubleshooting: Restart phone, check APN = 'internet', ensure Mobile Data is ON.",
//       marginLeft,
//       afterImgsY - 36,
//       contentWidth,
//       11,
//       fontRegular,
//     );

//     // ---------- PAGE 4 ----------
//     const page4 = pdfDoc.addPage(pageSize);
//     page4.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageSize[0],
//       height: pageSize[1],
//       color: yellowBg,
//     });
//     page4.drawText("Support 24*7", {
//       x: marginLeft,
//       y: 780,
//       size: 20,
//       font: fontBold,
//       color: blue,
//     });

//     let y4 = 740;
//     drawWrapped(
//       page4,
//       "Helpline: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;
//     drawWrapped(
//       page4,
//       "WhatsApp: +91-9810266776",
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );
//     y4 -= 22;
//     drawWrapped(
//       page4,
//       `Email: ravi@eSimNow.ai`,
//       marginLeft,
//       y4,
//       contentWidth,
//       12,
//       fontRegular,
//     );

//     y4 -= 34;
//     page4.drawText("Quick Reminders", {
//       x: marginLeft,
//       y: y4,
//       size: 14,
//       font: fontBold,
//       color: blue,
//     });

//     // ✅ Sanitize datapack
//     const dataPackText =
//       sanitizeForPdf(vendorRow?.datapack) ||
//       "1 GB data valid for 7 days from activation";

//     const bullets = [
//       dataPackText,
//       "Use WiFi when available to save data",
//       "No physical SIM needed - purely digital",
//       "QR code works only once - do not share",
//       "Complete your eKYC, keep your PAN/AADHAAR/PASSPORT handy",
//       "We offer Multi Country Regional Plans, Single Country Plans, World Plans and Lifelong validity plans. Choose as per your needs.",
//     ];

//     let by = y4 - 26;
//     bullets.forEach((b) => {
//       drawWrapped(
//         page4,
//         `• ${b}`,
//         marginLeft + 8,
//         by,
//         contentWidth - 16,
//         11,
//         fontRegular,
//       );
//       by -= 20;
//     });

//     const footerText = `www.${companyName}.ai`;
//     const footerSize = 36;
//     const footerWidth = fontBold.widthOfTextAtSize(footerText, footerSize);
//     const footerX = (pageSize[0] - footerWidth) / 2;
//     page4.drawText(footerText, {
//       x: footerX,
//       y: 150,
//       size: footerSize,
//       font: fontBold,
//     });

//     const socialIcons = [
//       {
//         url: "https://www.eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
//       },
//       {
//         url: "https://www.facebook.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
//       },
//       {
//         url: "https://www.instagram.com/eSimNow.ai",
//         icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
//       },
//       {
//         url: "https://www.linkedin.com/company/esimnow",
//         icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
//       },
//       {
//         url: "https://x.com/eSimNow",
//         icon: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
//       },
//     ];
//     const iconSize = 32;
//     const spacing = 20;
//     const totalWidth = socialIcons.length * (iconSize + spacing) - spacing;
//     let iconStartX = (pageSize[0] - totalWidth) / 2;
//     const iconY = 80;
//     const annots = [];
//     for (const s of socialIcons) {
//       const resp = await fetch(s.icon);
//       const bytes = await resp.arrayBuffer();
//       const img = await pdfDoc.embedPng(bytes);
//       page4.drawImage(img, {
//         x: iconStartX,
//         y: iconY,
//         width: iconSize,
//         height: iconSize,
//       });
//       const annotRef = pdfDoc.context.register(
//         pdfDoc.context.obj({
//           Type: "Annot",
//           Subtype: "Link",
//           Rect: [iconStartX, iconY, iconStartX + iconSize, iconY + iconSize],
//           Border: [0, 0, 0],
//           A: pdfDoc.context.obj({ Type: "Action", S: "URI", URI: s.url }),
//         }),
//       );
//       annots.push(annotRef);
//       iconStartX += iconSize + spacing;
//     }
//     const pageAnnots =
//       page4.node.lookup(PDFName.of("Annots")) || pdfDoc.context.obj([]);
//     annots.forEach((a) => pageAnnots.push(a));
//     page4.node.set(PDFName.of("Annots"), pageAnnots);

//     return await pdfDoc.save();
//   }

//   async function handleGenerateCsvOnly() {
//     setloadingTop(true);
//     try {
//       const generated = [];

//       for (const row of rows) {
//         const bytes = await buildPdfBytesCsvOnly(row, uploadedLogoTop);
//         const blob = new Blob([bytes], { type: "application/pdf" });
//         generated.push({
//           name: `${sanitizeForPdf(row.vendor_user_name) || "Vendor"}.pdf`,
//           blob,
//           url: URL.createObjectURL(blob),
//         });
//       }

//       setPdfList(generated);
//       setShowModal(true);
//     } finally {
//       setloadingTop(false);
//     }
//   }

//   async function handleGenerateAll() {
//     setLoading(true);

//     try {
//       const generated = [];

//       for (let i = 0; i < rows.length; i++) {
//         const row = rows[i];
//         const qrData = zipQrList[i];

//         if (!qrData) continue;

//         const bytes = await buildPdfBytes(row, {
//           logoFile: uploadedLogo,
//           qrBuffer: qrData.buffer,
//           qrType: qrData.type,
//           iccFromZip: qrData.iccId,
//         });

//         const blob = new Blob([bytes], { type: "application/pdf" });

//         generated.push({
//           name: `${sanitizeForPdf(row.vendor_user_name) || "Vendor"}_${qrData.iccId}.pdf`,
//           blob,
//           url: URL.createObjectURL(blob),
//         });
//       }

//       setPdfList(generated);
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDownloadAll() {
//     if (!pdfList.length) return alert("No PDFs to download.");

//     const zip = new JSZip();
//     const folder = zip.folder("Generated_PDFs");

//     pdfList.forEach((pdf) => {
//       folder.file(pdf.name, pdf.blob);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     saveAs(zipBlob, "All_PDFs.zip");
//   }

//   function resetTopBox() {
//     setUploadedCsvTop(null);
//     setUploadedLogoTop(null);
//     setloadingTop(false);

//     if (csvTopRef.current) csvTopRef.current.value = "";
//     if (logoTopRef.current) logoTopRef.current.value = "";
//   }

//   function resetBottomBox() {
//     setUploadedCsv(null);
//     setUploadedLogo(null);
//     setUploadedZip(null);
//     setLoading(false);
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-12 p-8">
//         {/* CSV INSTRUCTIONS */}
//         <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
//           <div className="mb-4">
//             <h3 className="font-semibold text-gray-700 mb-2">
//               📄 Required CSV Column Names
//             </h3>

//             <div className="overflow-x-auto">
//               <div className="overflow-hidden rounded-xl border border-gray-300">
//                 <table className="w-full text-sm border-collapse">
//                   <thead className="bg-gray-50">
//                     <tr className="divide-x divide-gray-200">
//                       <th className="px-3 py-2 text-center font-medium">
//                         vendor_user_name
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         company_name
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         icc_id (or ICCID)
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         datapack
//                       </th>
//                       <th className="px-3 py-2 text-center font-medium">
//                         qr_img
//                       </th>
//                     </tr>
//                   </thead>
//                 </table>
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-4 text-sm">
//             <div className="bg-gray-50 p-4 rounded">
//               <ul className="list-disc ml-5 space-y-1">
//                 📌 Logo PNG format only
//               </ul>
//             </div>

//             <div className="bg-gray-50 p-2 rounded">
//               <ul className="list-disc ml-5 space-y-1">
//                 <p>
//                   📌 QR Image name = ICC ID (e.g. <code>89444227.png</code>)
//                 </p>
//                 <p> 📌 PNG / JPG / JPEG supported</p>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* TOP CARD : CSV ONLY */}
//         <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
//           <h1 className="text-2xl font-bold mb-6">
//             PDF Generator (CSV)
//             <button
//               onClick={resetTopBox}
//               title="Reset"
//               className="relative  left-4 text-gray-400 hover:text-blue-600 transition"
//             >
//               <RotateCcw size={20} />
//             </button>
//           </h1>

//           <div className="flex flex-wrap justify-center gap-4 mb-6">
//             <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//               {uploadedCsvTop ? uploadedCsvTop.name : "Upload CSV"}

//               <input
//                 ref={csvTopRef}
//                 type="file"
//                 accept=".csv"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;
//                   setUploadedCsvTop(file);

//                   const reader = new FileReader();
//                   reader.onload = (ev) => parseCsv(ev.target.result);
//                   reader.readAsText(file);
//                 }}
//               />
//             </label>

//             <label className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
//               {uploadedLogoTop ? uploadedLogoTop.name : "Upload Logo"}
//               <input
//                 ref={logoTopRef}
//                 type="file"
//                 accept="image/png"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;

//                   if (
//                     file.type !== "image/png" &&
//                     !file.name.toLowerCase().endsWith(".png")
//                   ) {
//                     alert("Only PNG image files are allowed!");
//                     e.target.value = "";
//                     return;
//                   }

//                   setUploadedLogoTop(file);
//                 }}
//               />
//             </label>
//           </div>

//           <button
//             onClick={handleGenerateCsvOnly}
//             disabled={loadingTop || !uploadedCsvTop || !uploadedLogoTop}
//             className={`px-6 py-3 rounded text-white transition ${
//               loadingTop || !uploadedCsvTop || !uploadedLogoTop
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-teal-600 hover:bg-teal-700"
//             }`}
//           >
//             {loadingTop ? "Generating..." : "Generate PDFs"}
//           </button>
//         </div>

//         {/* OR DIVIDER */}
//         <div className="flex items-center gap-4">
//           <div className="w-24 h-px bg-gray-400"></div>
//           <span className="text-gray-500 font-semibold">OR</span>
//           <div className="w-24 h-px bg-gray-400"></div>
//         </div>

//         {/* BOTTOM CARD : CSV + ZIP */}
//         <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl text-center">
//           <h1 className="text-2xl font-bold mb-6">
//             PDF Generator (CSV + QR ZIP)
//             <button
//               onClick={resetBottomBox}
//               title="Reset"
//               className="relative  left-4 text-gray-400 hover:text-blue-600 transition"
//             >
//               <RotateCcw size={20} />
//             </button>
//           </h1>

//           <div className="flex flex-wrap justify-center gap-4 mb-6">
//             <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//               {uploadedCsv ? uploadedCsv.name : "Upload CSV"}
//               <input
//                 type="file"
//                 accept=".csv"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;
//                   setUploadedCsv(file);

//                   const reader = new FileReader();
//                   reader.onload = (ev) => parseCsv(ev.target.result);
//                   reader.readAsText(file);
//                 }}
//               />
//             </label>

//             <label className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
//               {uploadedLogo ? uploadedLogo.name : "Upload Logo"}
//               <input
//                 type="file"
//                 accept="image/png"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;

//                   if (
//                     file.type !== "image/png" &&
//                     !file.name.toLowerCase().endsWith(".png")
//                   ) {
//                     alert("Only PNG image files are allowed!");
//                     e.target.value = "";
//                     return;
//                   }

//                   setUploadedLogo(file);
//                 }}
//               />
//             </label>

//             <label className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition">
//               {uploadedZip ? uploadedZip.name : "Upload QR ZIP"}
//               <input
//                 type="file"
//                 accept=".zip"
//                 onChange={handleZipUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           <button
//             onClick={handleGenerateAll}
//             disabled={loading || !uploadedCsv || !uploadedLogo || !uploadedZip}
//             className={`px-6 py-3 rounded text-white transition ${
//               loading || !uploadedCsv || !uploadedLogo || !uploadedZip
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-teal-600 hover:bg-teal-700"
//             }`}
//           >
//             {loading ? "Generating..." : "Generate PDFs"}
//           </button>
//         </div>

//         {/* MODAL */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//             <div className="bg-white rounded-lg w-[90%] max-w-5xl h-[95vh] flex flex-col">
//               <div className="flex justify-between items-center p-3 border-b bg-gray-200">
//                 <h2 className="text-lg font-semibold">All PDF Previews</h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
//                 >
//                   Close
//                 </button>
//               </div>

//               <div className="overflow-y-auto flex-1 p-4 space-y-4">
//                 {pdfList.map((pdf, idx) => (
//                   <div key={idx} className="border rounded shadow">
//                     <div className="bg-gray-50 px-3 py-2 font-medium border-b">
//                       {pdf.name}
//                     </div>
//                     <iframe
//                       title={pdf.name}
//                       src={pdf.url}
//                       className="w-full h-[500px]"
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-center p-3 border-t bg-gray-200">
//                 <button
//                   onClick={handleDownloadAll}
//                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
//                 >
//                   Download All
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
// !======================================
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
import JSZip from "jszip";

// ✅ HELPER: Sanitize text for PDF (remove non-WinAnsi chars but KEEP SPACES)
function sanitizeForPdf(text) {
  if (!text) return "";
  return String(text)
    .replace(/[^\x20-\x7E]/g, "") // Remove non-ASCII (but \x20 is space, so it stays!)
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
  const csvTopRef = useRef(null);
  const logoTopRef = useRef(null);

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

    setZipQrList(qrList);
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
    // ✅ Detect delimiter (comma or tab)
    const firstLine = text.split("\n")[0];
    const delimiter = firstLine.includes("\t") ? "\t" : ",";

    console.log(
      `📄 CSV Delimiter detected: ${delimiter === "\t" ? "TAB" : "COMMA"}`,
    );

    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter, // Use detected delimiter
      dynamicTyping: false, // Keep everything as strings
      transform: (value, field) => {
        // ✅ CRITICAL: Force ICC fields to stay as strings
        if (field === "icc_id" || field === "ICCID") {
          return String(value).trim();
        }
        return value;
      },
      complete: (res) => {
        if (!res?.data?.length) return;

        console.log("📦 FULL RAW CSV DATA:", res.data);

        const fixed = res.data.map((r, index) => {
          // ✅ Get raw values BEFORE any processing
          const rawVendorName = r.vendor_user_name || "";
          const rawCompanyName = r.company_name || "";
          const rawDatapack = r.datapack || "";
          const rawIcc = r.icc_id || r.ICCID || "";

          console.log(`\n=== ROW ${index + 1}: ${rawVendorName} ===`);
          console.log("Raw vendor name:", JSON.stringify(rawVendorName));
          console.log("Raw ICC:", JSON.stringify(rawIcc));
          console.log("ICC Type:", typeof rawIcc);
          console.log("ICC Length:", rawIcc.length);

          const qr = String(r.qr_img || "").trim();

          // ✅ Process ICC ID - keep as string, no conversion
          let icc = String(rawIcc).trim();

          // Only parse if it has scientific notation
          if (icc.includes("E") || icc.includes("e")) {
            const original = icc;
            icc = parseIccId(icc);
            console.log(`Converted ${original} → ${icc}`);
          } else {
            console.log("ICC already in full format:", icc);
          }

          // Derive ICC from filename if missing
          if (!icc && qr) {
            icc = qr
              .split("/")
              .pop()
              .replace(/\.(png|jpg|jpeg)$/i, "");
          }

          // ✅ Sanitize for PDF (should preserve spaces!)
          const vendorName = sanitizeForPdf(rawVendorName);
          const companyName = sanitizeForPdf(rawCompanyName);
          const datapack = sanitizeForPdf(rawDatapack);

          console.log("After sanitize vendor:", JSON.stringify(vendorName));
          console.log("Vendor has spaces:", vendorName.includes(" "));
          console.log("Final ICC:", JSON.stringify(icc));
          console.log("---");

          return {
            ...r,
            qr_img: qr,
            icc_id: icc,
            vendor_user_name: vendorName,
            company_name: companyName,
            datapack: datapack,
          };
        });

        console.log("\n✅ FINAL PROCESSED ROWS:", fixed);
        console.log("\n🔍 ICC IDs in order:");
        fixed.forEach((row, i) => {
          console.log(`${i + 1}. ${row.vendor_user_name}: ${row.icc_id}`);
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
    const iccId = vendorRow?.icc_id || "";

    console.log("   Final vendorName in PDF:", JSON.stringify(vendorName));
    console.log("   Has spaces:", vendorName.includes(" "));
    console.log("   Final iccId in PDF:", JSON.stringify(iccId));

    const qrSource =
      vendorRow?.["qr_img"]?.trim() ||
      `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

    // ---------- PAGE 1 ----------
    const page1 = pdfDoc.addPage(pageSize);
    page1.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: yellowBg,
    });

    page1.drawText("Welcome to the world of ESim powered by", {
      x: marginLeft,
      y: 760,
      size: 24,
      font: fontBold,
      color: blue,
    });

    page1.drawText(companyName, {
      x: marginLeft,
      y: 724,
      size: 24,
      font: fontBold,
      color: blue,
    });

    page1.drawText(`Dear ${vendorName},`, {
      x: marginLeft,
      y: 684,
      size: 14,
      font: fontBold,
    });

    let yPos = 656;
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
        // ✅ Sanitize each part
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

    // White box behind QR
    page2.drawRectangle({
      x: qrX - 10,
      y: qrY - 40,
      width: qrSize + 20,
      height: qrSize + 100,
      color: rgb(1, 1, 1),
    });

    // QR from CSV image path
    let qrImage = null;
    try {
      let qrPath = qrSource;

      console.log("Attempting to load QR from:", qrPath);

      if (qrPath && !qrPath.startsWith("http") && !qrPath.startsWith("/")) {
        qrPath = `/images/${qrPath}`;
      }

      qrImage = await embedImage(pdfDoc, qrPath);

      if (!qrImage) {
        console.error("QR image failed to load from path:", qrPath);
      }
    } catch (err) {
      console.error(
        "QR image error (CSV only module):",
        err,
        "Path was:",
        qrSource,
      );
    }

    if (qrImage) {
      const dims = qrImage.scale(1);
      const scale = qrSize / dims.width;
      page2.drawImage(qrImage, {
        x: qrX,
        y: qrY + 40,
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

    // Logo
    let logoImg = null;
    try {
      if (logoFileTop instanceof File) {
        const buffer = await logoFileTop.arrayBuffer();
        if (logoFileTop.type.includes("png")) {
          logoImg = await pdfDoc.embedPng(buffer);
        } else if (
          logoFileTop.type.includes("jpeg") ||
          logoFileTop.type.includes("jpg")
        ) {
          logoImg = await pdfDoc.embedJpg(buffer);
        }
      } else {
        logoImg = await embedImage(pdfDoc, "/images/logo.png");
      }
    } catch (err) {
      console.warn("Logo not found (CSV only module):", err);
    }

    if (logoImg) {
      const dims = logoImg.scale(1);
      const scale = Math.min(100 / dims.width, 40 / dims.height);
      const lw = dims.width * scale;
      const lh = dims.height * scale;
      const lx = (page2.getWidth() - lw) / 2;
      const ly = qrY - 15;
      page2.drawImage(logoImg, { x: lx, y: ly, width: lw, height: lh });
    }

    // ICC ID under logo
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
      "Helpline: +91-9810266776",
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;

    drawWrapped(
      page4,
      "WhatsApp: +91-9810266776",
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;

    drawWrapped(
      page4,
      `Email: ravi@eSimNow.ai`,
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

    const socialIcons = [
      {
        url: "https://www.eSimNow.ai",
        icon: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
      },
      {
        url: "https://www.facebook.com/eSimNow.ai",
        icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      },
      {
        url: "https://www.instagram.com/eSimNow.ai",
        icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
      },
      {
        url: "https://www.linkedin.com/company/esimnow",
        icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
      },
      {
        url: "https://x.com/eSimNow",
        icon: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
      },
    ];

    const iconSize = 32;
    const spacing = 20;
    const totalWidthIcons = socialIcons.length * (iconSize + spacing) - spacing;
    let iconStartX = (pageSize[0] - totalWidthIcons) / 2;
    const iconY = 80;
    const annots = [];

    for (const s of socialIcons) {
      const resp = await fetch(s.icon);
      const bytes = await resp.arrayBuffer();
      const img = await pdfDoc.embedPng(bytes);

      page4.drawImage(img, {
        x: iconStartX,
        y: iconY,
        width: iconSize,
        height: iconSize,
      });

      const annotRef = pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: [iconStartX, iconY, iconStartX + iconSize, iconY + iconSize],
          Border: [0, 0, 0],
          A: pdfDoc.context.obj({ Type: "Action", S: "URI", URI: s.url }),
        }),
      );

      annots.push(annotRef);
      iconStartX += iconSize + spacing;
    }

    const pageAnnots =
      page4.node.lookup(PDFName.of("Annots")) || pdfDoc.context.obj([]);
    annots.forEach((a) => pageAnnots.push(a));
    page4.node.set(PDFName.of("Annots"), pageAnnots);

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
    let iccId = vendorRow?.icc_id || "";

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

    console.log("   Final vendorName:", JSON.stringify(vendorName));
    console.log("   Has spaces:", vendorName.includes(" "));

    const qrSource =
      vendorRow?.["qr_img"]?.trim() ||
      `/images/${vendorName.replace(/\s+/g, "_")}_qr.png`;

    // ---------- PAGE 1 ----------
    const page1 = pdfDoc.addPage(pageSize);
    page1.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: yellowBg,
    });
    page1.drawText("Welcome to the world of ESim powered by", {
      x: marginLeft,
      y: 760,
      size: 24,
      font: fontBold,
      color: blue,
    });
    page1.drawText(companyName, {
      x: marginLeft,
      y: 724,
      size: 24,
      font: fontBold,
      color: blue,
    });
    page1.drawText(`Dear ${vendorName},`, {
      x: marginLeft,
      y: 684,
      size: 14,
      font: fontBold,
    });

    let yPos = 656;
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

    // ---------- PAGE 2 (similar sanitization applied throughout) ----------
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

    page2.drawRectangle({
      x: qrX - 10,
      y: qrY - 40,
      width: qrSize + 20,
      height: qrSize + 100,
      color: rgb(1, 1, 1),
    });

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
      page2.drawImage(qrImage, {
        x: qrX,
        y: qrY + 40,
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

    let logoImg = null;

    try {
      if (logoFile instanceof File) {
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
      const scale = Math.min(100 / dims.width, 40 / dims.height);
      const lw = dims.width * scale;
      const lh = dims.height * scale;
      const lx = (page2.getWidth() - lw) / 2;
      const ly = qrY - 15;
      page2.drawImage(logoImg, { x: lx, y: ly, width: lw, height: lh });
    }

    const displayIccId = iccId || "N/A";
    const iccWidth = fontRegular.widthOfTextAtSize(displayIccId, 12);
    page2.drawText(displayIccId, {
      x: qrX + qrSize / 2 - iccWidth / 2,
      y: qrY - 60,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

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
      "Helpline: +91-9810266776",
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;
    drawWrapped(
      page4,
      "WhatsApp: +91-9810266776",
      marginLeft,
      y4,
      contentWidth,
      12,
      fontRegular,
    );
    y4 -= 22;
    drawWrapped(
      page4,
      `Email: ravi@eSimNow.ai`,
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

    const socialIcons = [
      {
        url: "https://www.eSimNow.ai",
        icon: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
      },
      {
        url: "https://www.facebook.com/eSimNow.ai",
        icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      },
      {
        url: "https://www.instagram.com/eSimNow.ai",
        icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
      },
      {
        url: "https://www.linkedin.com/company/esimnow",
        icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
      },
      {
        url: "https://x.com/eSimNow",
        icon: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
      },
    ];
    const iconSize = 32;
    const spacing = 20;
    const totalWidth = socialIcons.length * (iconSize + spacing) - spacing;
    let iconStartX = (pageSize[0] - totalWidth) / 2;
    const iconY = 80;
    const annots = [];
    for (const s of socialIcons) {
      const resp = await fetch(s.icon);
      const bytes = await resp.arrayBuffer();
      const img = await pdfDoc.embedPng(bytes);
      page4.drawImage(img, {
        x: iconStartX,
        y: iconY,
        width: iconSize,
        height: iconSize,
      });
      const annotRef = pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: [iconStartX, iconY, iconStartX + iconSize, iconY + iconSize],
          Border: [0, 0, 0],
          A: pdfDoc.context.obj({ Type: "Action", S: "URI", URI: s.url }),
        }),
      );
      annots.push(annotRef);
      iconStartX += iconSize + spacing;
    }
    const pageAnnots =
      page4.node.lookup(PDFName.of("Annots")) || pdfDoc.context.obj([]);
    annots.forEach((a) => pageAnnots.push(a));
    page4.node.set(PDFName.of("Annots"), pageAnnots);

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
          name: `${row.vendor_user_name || "Vendor"}.pdf`,
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

      console.log("\n🚀 Starting PDF generation...");
      console.log("Total CSV rows:", rows.length);
      console.log("Total ZIP QR codes:", zipQrList.length);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        console.log(`\n📄 Processing row ${i + 1}: ${row.vendor_user_name}`);
        console.log("   CSV ICC ID:", row.icc_id);

        // ✅ FIX: Match QR by ICC ID instead of array index
        const qrData = zipQrList.find((qr) => qr.iccId === row.icc_id);

        if (!qrData) {
          console.warn(`⚠️ No matching QR found for ICC: ${row.icc_id}`);
          continue;
        }

        console.log("   ✅ Matched with ZIP QR:", qrData.iccId);

        const bytes = await buildPdfBytes(row, {
          logoFile: uploadedLogo,
          qrBuffer: qrData.buffer,
          qrType: qrData.type,
          iccFromZip: qrData.iccId, // This should match row.icc_id now
        });

        const blob = new Blob([bytes], { type: "application/pdf" });

        generated.push({
          name: `${row.vendor_user_name || "Vendor"}_${row.icc_id}.pdf`,
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

        {/* BOTTOM CARD : CSV + ZIP */}
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
