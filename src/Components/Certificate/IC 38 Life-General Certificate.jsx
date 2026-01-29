// const Format3 = ({ student, index, excelDateToJSDate }) => {
//   return (
//     <>
//       <div key={index} className="my-4 d-flex justify-content-center">
//         <div id={`certificate-${index}`} className="background-div">
//           <div className="certificate-header d-flex ms-2">
//             <p>Ref: CIT/LIFE/Online</p>
//             <p style={{ marginLeft: "250px" }}>Ref No.: {student.Ref_No}</p>
//           </div>

//           <div className="company-name-container">
//             {" "}
//             <p className="company-name"><span style={{ color: "#bb020d" }}>Consult</span>IT</p>
//             <p className="company-tag">Technology Partners For Your Enterprise</p>
//           </div>
//           <div className="certificate-heading">
//             <p className="text-decoration-underline">
//               Training Completion Certificate
//             </p>
//           </div>

//           <div className="certificate-data">
//             <p className="fs-5">
//               This is to certify that Mr./Ms.{" "}
//               <span className="text-uppercase">
//                 <strong>{student.Name} </strong>
//               </span>
//               sponsored for Training by{" "}
//               <span className="text-uppercase">
//                 <strong>{student.Company_Name}.</strong>
//               </span>{" "}
//               <br />
//               The training was held online through{" "}
//               <a href="#">www.tng.consultit.co.in</a> from{" "}
//               <strong>
//                 {excelDateToJSDate(student.Training_Start)} to{" "}
//                 {excelDateToJSDate(student.Training_End)}.{" "}
//               </strong>
//               He/She has completed 25 Hours Life Insurance Agents. Training
//               course as stipulated under Insurance Regulatory and Development
//               Authority (IRDA) Agency regulations.
//             </p>
//           </div>

//           <div className="person-details fs-5">
//             <strong>
//               {/* <p className="my-0">Location : {student.location}</p>
//               <p className="my-0">Code : {student.code}</p> */}
//               {/* <p className="my-0">APPL No. : {student.application_number}</p> */}
//               {/* <p className="my-0">PAN No. : {student.Pan_ID}</p> */}
//               {/* <p className="my-0">HBITS Ref No. : {student.HBITS_Ref}</p> */}
//               <p className="my-0">IRDA URN No. : {student.URN_Number}</p>
//             </strong>
//           </div>
//           <div className="Certificate-footer">
//             <p className="fs-6">
//               ConsultIT House, Plot no 20, TechZone 07, Greater Noida, Gautam
//               Buddha Nagar, Uttar Pardesh, 203207
//               <br />
//               Telephone No: +91-120-6253576/75{" "}
//               <span className="ms-2">
//                 Email:
//                 <a href="#">info@consultit.co.in </a>
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Format3;

const Format3 = ({ student, index, excelDateToJSDate }) => {
  return (
    <div key={index} className="my-4 flex justify-center">
      <div
        id={`certificate-${index}`}
        className="relative w-[794px] h-[1123px] border border-gray-300 overflow-hidden"
        style={{
          backgroundImage: "url('/ConsultIT Certificate Template.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {/* Certificate Header */}
        <div className="absolute top-[50px] left-[50px] flex text-lg font-bold ml-2">
          <p>Ref: CIT/LIFE/Online</p>
          <p className="ml-[250px]">Ref No.: {student.Ref_No}</p>
        </div>
        {/* ============================== */}
        {/* Company Name Container */}
        {/* <div className="absolute top-[60px] left-[250px] text-center">
          <p
            className="mb-[-25px] font-semibold"
            style={{ fontSize: "75px", fontFamily: "Calibri" }}
          >
            <span style={{ color: "#bb020d" }}>Consult</span>IT
          </p>
          <p
            className="text-base font-semibold"
            style={{ fontFamily: "Calibri" }}
          >
            Technology Partners For Your Enterprise
          </p>
        </div> */}

        {/* Certificate Heading */}
        {/* <div
          className="absolute top-[200px] left-[-50px] w-[900px] text-center font-semibold"
          style={{ fontSize: "40px", fontFamily: "'Times New Roman', serif" }}
        >
          <p className="underline">Training Completion Certificate</p>
        </div> */}
        {/* ===================================== */}
        {/* Company Name Container - WITH MORE TOP SPACE */}
        <div className="absolute top-[100px] left-0 right-0 text-center">
          <p
            className="mb-0 font-semibold leading-none"
            style={{
              fontSize: "75px",
              fontFamily: "Calibri",
              lineHeight: "1",
            }}
          >
            <span style={{ color: "#bb020d" }}>Consult</span>IT
          </p>
          <p
            className="text-base font-semibold mt-4" // ✅ Changed from mt-1 to mt-4
            style={{ fontFamily: "Calibri" }}
          >
            Technology Partners For Your Enterprise
          </p>
        </div>

        {/* Certificate Heading - Adjust if needed */}
        <div
          className="absolute top-[230px] left-0 right-0 text-center font-semibold" // ✅ Adjusted from 220px to 230px
          style={{ fontSize: "40px", fontFamily: "'Times New Roman', serif" }}
        >
          <p className="underline">Training Completion Certificate</p>
        </div>
        {/* Certificate Data */}
        <div
          className="absolute top-[340px] left-[110px] w-[580px] text-base text-justify"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          <p className="text-xl">
            This is to certify that Mr./Ms.{" "}
            <span className="uppercase">
              <strong>{student.Name} </strong>
            </span>
            sponsored for Training by{" "}
            <span className="uppercase">
              <strong>{student.Company_Name}.</strong>
            </span>{" "}
            <br />
            The training was held online through{" "}
            <a href="#" className="text-blue-600 hover:underline">
              www.tng.consultit.co.in
            </a>{" "}
            from{" "}
            <strong>
              {excelDateToJSDate(student.Training_Start)} to{" "}
              {excelDateToJSDate(student.Training_End)}.{" "}
            </strong>
            He/She has completed 25 Hours Life Insurance Agents. Training course
            as stipulated under Insurance Regulatory and Development Authority
            (IRDA) Agency regulations.
          </p>
        </div>

        {/* Person Details */}
        <div
          className="absolute top-[600px] left-[110px] w-[580px] text-base text-justify"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          <strong className="text-xl">
            <p className="my-0">IRDA URN No. : {student.URN_Number}</p>
          </strong>
        </div>

        {/* Certificate Footer */}
        <div
          className="absolute top-[1020px] left-[-55px] w-[900px] text-center font-semibold"
          style={{ fontFamily: "Calibri" }}
        >
          <p className="text-sm">
            ConsultIT House, Plot no 20, TechZone 07, Greater Noida, Gautam
            Buddha Nagar, Uttar Pardesh, 203207
            <br />
            Telephone No: +91-120-6253576/75{" "}
            <span className="ml-2">
              Email:
              <a href="#" className="text-blue-600 hover:underline">
                info@consultit.co.in
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Format3;
