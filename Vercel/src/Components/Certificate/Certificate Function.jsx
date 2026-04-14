// import { useState } from "react";
// import * as XLSX from "xlsx";
// import html2pdf from "html2pdf.js";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// // import Format1 from "./POSP Certificate";
// // import Format2 from "./Tellcalers Certificate";
// import Format3 from "./IC 38 Life-General Certificate";
// // import Format4 from "./AML Certificate";

// const CertificateFunction = () => {
//   const [CertificateData, setCertificateData] = useState([]);
//   const [showCertificate, setShowCertificate] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState("");

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);
//       setCertificateData(jsonData);
//       setShowCertificate(false);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const Generator = () => {
//     setShowCertificate(true);
//   };

//   const downloadAllCertificates = () => {
//   CertificateData.forEach((student, index) => {
//     const element = document.getElementById(`certificate-${index}`);
//     if (!element) return;

//     element.classList.add("pdf-shift-up");

//     html2canvas(element, {
//       scale: 1,
//       useCORS: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/jpeg", 1.0);
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: [canvas.width, canvas.height],
//       });

//       pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
//       pdf.save(`${student.Name || "Student"}_${student.Pan_ID}.pdf`);

//       element.classList.remove("pdf-shift-up");
//     });
//   });
// };

//   const downloadAsImage = (index, student) => {
//     const element = document.getElementById(`certificate-${index}`);
//     if (!element) return;

//     html2canvas(element, {
//       scale: 1, // Higher scale = better quality
//       useCORS: true, // If using background images
//     }).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = `${student.Name}_${student.Pan_ID}.jpg`;
//       link.href = canvas.toDataURL("image/jpeg", 1.0);
//       link.click();
//     });
//   };

//   const downloadAllAsImages = () => {
//     CertificateData.forEach((student, index) => {
//       downloadAsImage(index, student);
//     });
//   };

//   const excelDateToJSDate = (serial) => {
//     if (!serial) return "N/A";
//     const utc_days = Math.floor(serial - 25569);
//     const utc_value = utc_days * 86400;
//     const date = new Date(utc_value * 1000);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const getFormatComponent = (student, index) => {
//     const props = { student, index, excelDateToJSDate };
//     switch (selectedFormat) {
//       // case "Format1":
//       //   return <Format1 {...props} />;
//       // case "Format2":
//       //   return <Format2 {...props} />;
//       case "Format3":
//         return <Format3 {...props} />;
//       // case "Format4":
//       //   return <Format4 {...props} />;
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="shadow-lg p-5">
//         <h1 className="text-center fw-bolder">Certificate Generator</h1>

//         <div className="mt-3">
//           <label htmlFor="formatSelect" className="form-label fw-bold">
//             Select Certificate Format
//           </label>
//           <select
//             id="formatSelect"
//             className="form-select"
//             value={selectedFormat}
//             onChange={(e) => setSelectedFormat(e.target.value)}
//           >
//             <option value="">-- Choose Format --</option>
//             {/* <option value="Format1">POSP Certificate</option>
//             <option value="Format2">Tellcalers Certificate</option> */}
//             <option value="Format3">IC 38 Life/General Certificate</option>
//             {/* <option value="Format4">AML Certificate</option> */}
//           </select>
//         </div>

//         {selectedFormat && (
//           <input
//             className="form-control fw-bold fs-5 mt-3"
//             type="file"
//             accept=".xlsx, .xls"
//             onChange={handleFileUpload}
//           />
//         )}

//         <div className="d-flex flex-nowrap">

//           {selectedFormat && (
//             <>
//               <button
//                 className="btn btn-primary d-block mx-auto mt-3 fw-bold col-3 p-3"
//                 onClick={Generator}
//               >
//                 Generate Certificate
//               </button>
//             </>
//           )}

//           {showCertificate && (
//             <>
//               <button
//                 className="btn btn-success d-block mx-auto mt-3 fw-bold col-3 p-3"
//                 onClick={downloadAllCertificates}
//               >
//                 Download All Certificates
//               </button>
//             </>
//           )}

//           {showCertificate && (
//             <>
//               <button
//                 className="btn btn-secondary d-block mx-auto mt-3 fw-bold col-3 p-3"
//                 onClick={downloadAllAsImages} // or for all: downloadAllAsImages()
//               >
//                 Download as JPEG
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {showCertificate &&
//         CertificateData.map((student, index) => (
//           <div key={index}
//           >{getFormatComponent(student, index)}</div>
//         ))}
//     </div>
//   );
// };

// export default CertificateFunction;
// =========================================
// import { useState } from "react";
// import * as XLSX from "xlsx";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import Format1 from "./POSP Certificate";
// import Format2 from "./Tellcalers Certificate";
// import Format3 from "./IC 38 Life-General Certificate";
// import Format4 from "./AML Certificate";

// const CertificateFunction = () => {
//   const [CertificateData, setCertificateData] = useState([]);
//   const [showCertificate, setShowCertificate] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState("");

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);
//       setCertificateData(jsonData);
//       setShowCertificate(false);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const Generator = () => {
//     setShowCertificate(true);
//   };

//   const downloadAllCertificates = () => {
//     CertificateData.forEach((student, index) => {
//       const element = document.getElementById(`certificate-${index}`);
//       if (!element) return;

//       html2canvas(element, {
//         scale: 1,
//         useCORS: true,
//       }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/jpeg", 1.0);
//         const pdf = new jsPDF({
//           orientation: "portrait",
//           unit: "px",
//           format: [canvas.width, canvas.height],
//         });

//         pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
//         pdf.save(
//           `${student.Name || student.name || "Student"}_${student.Pan_ID}.pdf`,
//         );
//       });
//     });
//   };

//   const downloadAsImage = (index, student) => {
//     const element = document.getElementById(`certificate-${index}`);
//     if (!element) return;

//     html2canvas(element, {
//       scale: 1,
//       useCORS: true,
//     }).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = `${student.Name || student.name}_${student.Pan_ID}.jpg`;
//       link.href = canvas.toDataURL("image/jpeg", 1.0);
//       link.click();
//     });
//   };

//   const downloadAllAsImages = () => {
//     CertificateData.forEach((student, index) => {
//       downloadAsImage(index, student);
//     });
//   };

//   const excelDateToJSDate = (serial) => {
//     if (!serial) return "N/A";
//     const utc_days = Math.floor(serial - 25569);
//     const utc_value = utc_days * 86400;
//     const date = new Date(utc_value * 1000);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1,
//     ).padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const getFormatComponent = (student, index) => {
//     const props = { student, index, excelDateToJSDate };
//     switch (selectedFormat) {
//       case "Format1":
//         return <Format1 {...props} />;
//       case "Format2":
//         return <Format2 {...props} />;
//       case "Format3":
//         return <Format3 {...props} />;
//       case "Format4":
//         return <Format4 {...props} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto mt-4 px-4">
//       <div className="shadow-lg p-5 rounded-lg">
//         <h1 className="text-center font-bold text-3xl">
//           Certificate Generator
//         </h1>

//         <div className="mt-3">
//           <label htmlFor="formatSelect" className="block mb-2 font-bold">
//             Select Certificate Format
//           </label>
//           <select
//             id="formatSelect"
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             value={selectedFormat}
//             onChange={(e) => setSelectedFormat(e.target.value)}
//           >
//             <option value="">-- Choose Format --</option>
//             <option value="Format1">POSP Certificate</option>
//             <option value="Format2">Tellcalers Certificate</option>
//             <option value="Format3">IC 38 Life/General Certificate</option>
//             <option value="Format4">AML Certificate</option>
//           </select>
//         </div>

//         {selectedFormat && (
//           <input
//             className="w-full border border-gray-300 rounded px-3 py-2 mt-3 font-bold text-lg"
//             type="file"
//             accept=".xlsx, .xls"
//             onChange={handleFileUpload}
//           />
//         )}

//         <div className="flex flex-wrap gap-3 justify-center">
//           {selectedFormat && (
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mt-3"
//               onClick={Generator}
//             >
//               Generate Certificate
//             </button>
//           )}

//           {showCertificate && (
//             <>
//               <button
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mt-3"
//                 onClick={downloadAllCertificates}
//               >
//                 Download All Certificates
//               </button>

//               <button
//                 className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded mt-3"
//                 onClick={downloadAllAsImages}
//               >
//                 Download as JPEG
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {showCertificate &&
//         CertificateData.map((student, index) => (
//           <div key={index}>{getFormatComponent(student, index)}</div>
//         ))}
//     </div>
//   );
// };

// export default CertificateFunction;

// import { useState } from "react";
// import * as XLSX from "xlsx";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// // import Format1 from "./POSP Certificate";
// // import Format2 from "./Tellcalers Certificate";
// import Format3 from "./IC 38 Life-General Certificate";
// // import Format4 from "./AML Certificate";

// const CertificateFunction = () => {
//   const [CertificateData, setCertificateData] = useState([]);
//   const [showCertificate, setShowCertificate] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState("");

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);
//       setCertificateData(jsonData);
//       setShowCertificate(false);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const Generator = () => {
//     setShowCertificate(true);
//   };

//   const downloadAllCertificates = () => {
//     CertificateData.forEach((student, index) => {
//       const element = document.getElementById(`certificate-${index}`);
//       if (!element) return;

//       html2canvas(element, {
//         scale: 1,
//         useCORS: true,
//       }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/jpeg", 1.0);
//         const pdf = new jsPDF({
//           orientation: "portrait",
//           unit: "px",
//           format: [canvas.width, canvas.height],
//         });

//         pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
//         pdf.save(
//           `${student.Name || student.name || "Student"}_${student.Pan_ID}.pdf`,
//         );
//       });
//     });
//   };

//   const downloadAsImage = (index, student) => {
//     const element = document.getElementById(`certificate-${index}`);
//     if (!element) return;

//     html2canvas(element, {
//       scale: 1,
//       useCORS: true,
//     }).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = `${student.Name || student.name}_${student.Pan_ID}.jpg`;
//       link.href = canvas.toDataURL("image/jpeg", 1.0);
//       link.click();
//     });
//   };

//   const downloadAllAsImages = () => {
//     CertificateData.forEach((student, index) => {
//       downloadAsImage(index, student);
//     });
//   };

//   const excelDateToJSDate = (serial) => {
//     if (!serial) return "N/A";
//     const utc_days = Math.floor(serial - 25569);
//     const utc_value = utc_days * 86400;
//     const date = new Date(utc_value * 1000);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1,
//     ).padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const getFormatComponent = (student, index) => {
//     const props = { student, index, excelDateToJSDate };
//     switch (selectedFormat) {
//       // case "Format1":
//       //   return <Format1 {...props} />;
//       // case "Format2":
//       //   return <Format2 {...props} />;
//       case "Format3":
//         return <Format3 {...props} />;
//       // case "Format4":
//       //   return <Format4 {...props} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto mt-4 px-4">
//       <div className="shadow-lg p-5 rounded-lg">
//         <h1 className="text-center font-bold text-3xl">
//           Certificate Generator
//         </h1>

//         <div className="mt-3">
//           <label htmlFor="formatSelect" className="block mb-2 font-bold">
//             Select Certificate Format
//           </label>
//           <select
//             id="formatSelect"
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             value={selectedFormat}
//             onChange={(e) => setSelectedFormat(e.target.value)}
//           >
//             <option value="">-- Choose Format --</option>
//             {/* <option value="Format1">POSP Certificate</option>
//             <option value="Format2">Tellcalers Certificate</option> */}
//             <option value="Format3">IC 38 Life/General Certificate</option>
//             {/* <option value="Format4">AML Certificate</option> */}
//           </select>
//         </div>

//         {selectedFormat && (
//           <input
//             className="w-full border border-gray-300 rounded px-3 py-2 mt-3 font-bold text-lg"
//             type="file"
//             accept=".xlsx, .xls"
//             onChange={handleFileUpload}
//           />
//         )}

//         <div className="flex flex-wrap gap-3 justify-center">
//           {selectedFormat && (
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mt-3"
//               onClick={Generator}
//             >
//               Generate Certificate
//             </button>
//           )}

//           {showCertificate && (
//             <>
//               <button
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mt-3"
//                 onClick={downloadAllCertificates}
//               >
//                 Download All Certificates
//               </button>

//               <button
//                 className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded mt-3"
//                 onClick={downloadAllAsImages}
//               >
//                 Download as JPEG
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {showCertificate &&
//         CertificateData.map((student, index) => (
//           <div key={index}>{getFormatComponent(student, index)}</div>
//         ))}
//     </div>
//   );
// };

// export default CertificateFunction;
// !==================
import { useState } from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Format3 from "./IC 38 Life-General Certificate";

const CertificateFunction = () => {
  const [CertificateData, setCertificateData] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setCertificateData(jsonData);
      setShowCertificate(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const Generator = () => {
    setShowCertificate(true);
  };

  // ✅ NEW: Download all PDFs as ZIP
  const downloadAllCertificatesAsZip = async () => {
    setIsDownloading(true);
    const zip = new JSZip();
    const folder = zip.folder("Certificates");

    try {
      for (let index = 0; index < CertificateData.length; index++) {
        const student = CertificateData[index];
        const element = document.getElementById(`certificate-${index}`);

        if (!element) {
          console.warn(`Element not found for index ${index}`);
          continue;
        }

        // Generate canvas from HTML
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // Create PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

        // Get PDF as ArrayBuffer
        const pdfBlob = pdf.output("arraybuffer");

        // Add to ZIP with filename
        const fileName = `${student.Name || student.name || "Student"}_${student.Pan_ID || index}.pdf`;
        folder.file(fileName, pdfBlob);

        console.log(`Added ${fileName} to ZIP`);
      }

      // Generate ZIP file
      console.log("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Download ZIP
      saveAs(zipBlob, `Certificates_${new Date().getTime()}.zip`);

      alert(
        `Successfully downloaded ${CertificateData.length} certificates as ZIP!`,
      );
    } catch (error) {
      console.error("Error generating ZIP:", error);
      alert("Error generating ZIP file. Check console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Keep individual download function
  const downloadSingleCertificate = async (index, student) => {
    const element = document.getElementById(`certificate-${index}`);
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${student.Name || student.name}_${student.Pan_ID}.pdf`);
  };

  const downloadAsImage = (index, student) => {
    const element = document.getElementById(`certificate-${index}`);
    if (!element) return;

    html2canvas(element, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${student.Name || student.name}_${student.Pan_ID}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.click();
    });
  };

  // const downloadAllAsImages = () => {
  //   CertificateData.forEach((student, index) => {
  //     setTimeout(() => {
  //       downloadAsImage(index, student);
  //     }, index * 500); // Stagger downloads
  //   });
  // };
  // ✅ NEW: Download all Images as ZIP
  const downloadAllAsImagesZip = async () => {
    setIsDownloading(true);
    const zip = new JSZip();
    const folder = zip.folder("Certificate_Images");

    try {
      for (let index = 0; index < CertificateData.length; index++) {
        const student = CertificateData[index];
        const element = document.getElementById(`certificate-${index}`);

        if (!element) {
          console.warn(`Element not found for index ${index}`);
          continue;
        }

        // Generate canvas from HTML
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        // Convert canvas to JPEG blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", 1.0);
        });

        // Add to ZIP with filename
        const fileName = `${student.Name || student.name || "Student"}_${student.Pan_ID || index}.jpg`;
        folder.file(fileName, blob);

        console.log(`Added ${fileName} to ZIP`);
      }

      // Generate ZIP file
      console.log("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Download ZIP
      saveAs(zipBlob, `Certificate_Images_${new Date().getTime()}.zip`);

      alert(`Successfully downloaded ${CertificateData.length} images as ZIP!`);
    } catch (error) {
      console.error("Error generating ZIP:", error);
      alert("Error generating ZIP file. Check console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Keep old function for individual downloads (optional)
  // const downloadAsImage = (index, student) => {
  //   const element = document.getElementById(`certificate-${index}`);
  //   if (!element) return;

  //   html2canvas(element, {
  //     scale: 2,
  //     useCORS: true,
  //   }).then((canvas) => {
  //     const link = document.createElement("a");
  //     link.download = `${student.Name || student.name}_${student.Pan_ID}.jpg`;
  //     link.href = canvas.toDataURL("image/jpeg", 1.0);
  //     link.click();
  //   });
  // };
  const excelDateToJSDate = (serial) => {
    if (!serial) return "N/A";
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date = new Date(utc_value * 1000);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getFormatComponent = (student, index) => {
    const props = { student, index, excelDateToJSDate };
    switch (selectedFormat) {
      case "Format3":
        return <Format3 {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      <div className="shadow-lg p-5 rounded-lg">
        <h1 className="text-center font-bold text-3xl">
          Certificate Generator
        </h1>

        <div className="mt-3">
          <label htmlFor="formatSelect" className="block mb-2 font-bold">
            Select Certificate Format
          </label>
          <select
            id="formatSelect"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">-- Choose Format --</option>
            <option value="Format3">IC 38 Life/General Certificate</option>
          </select>
        </div>

        {selectedFormat && (
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mt-3 font-bold text-lg"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {selectedFormat && CertificateData.length > 0 && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mt-3"
              onClick={Generator}
            >
              Generate Certificates
            </button>
          )}

          {/* {showCertificate && (
            <>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={downloadAllCertificatesAsZip}
                disabled={isDownloading}
              >
                {isDownloading
                  ? `Generating ZIP... (${CertificateData.length} files)`
                  : "📦 Download All as ZIP"}
              </button>

              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded mt-3"
                onClick={downloadAllAsImages}
              >
                🖼️ Download All as JPEG
              </button>
            </>
          )} */}
          {showCertificate && (
            <>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={downloadAllCertificatesAsZip}
                disabled={isDownloading}
              >
                {isDownloading
                  ? `Generating ZIP... (${CertificateData.length} files)`
                  : "📦 Download All PDFs as ZIP"}
              </button>

              {/* ✅ UPDATED BUTTON */}
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={downloadAllAsImagesZip}
                disabled={isDownloading}
              >
                {isDownloading
                  ? `Generating ZIP... (${CertificateData.length} images)`
                  : "🖼️ Download All JPEGs as ZIP"}
              </button>
            </>
          )}
        </div>

        {isDownloading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">
              Generating {CertificateData.length} certificates... Please wait.
            </p>
          </div>
        )}
      </div>

      {showCertificate &&
        CertificateData.map((student, index) => (
          <div key={index}>{getFormatComponent(student, index)}</div>
        ))}
    </div>
  );
};

export default CertificateFunction;
