// const Format4 = ({ student, index, excelDateToJSDate }) => {
//   return (
//     <>

//       <div key={index} className="my-4 d-flex justify-content-center" >

//         <div id={`certificate-${index}`} className="background-div">
//           <div className="certificate-heading">
//             <p className="">Certificate of Completion</p>
//           </div>

//           <div className="certificate-data">
//             <p className="fs-5">
//               This is to certify that Mr./Ms. <span className="text-uppercase"><strong>{student.name} </strong></span>
//                sponsored by <span className="text-uppercase"><strong>{student.Company_name}</strong></span> has completed
//               through{" "}
//               <span>
//                 <a href="#">www.hbitscollege.com</a>
//               </span>{" "}
//               the Online Training of 15 hours for Point of {student.position} as
//               per the syllabus prescribed by the Insurance Regulatory &
//               Development Authority of India Guidelines Ref:
//               IRDAI/INT/CIR/PSP160/09/2018. Dated: 25 Sep 2018.
//             </p>

//           </div>

//           <div className="person-details fs-5">
//             <strong>
//               <p className="my-0">APPL No: {student.application_number}</p>
//               <p className="my-0">PAN No. : {student.Pan_ID}</p>
//               <p className="my-0">HBITS Ref No. : {student.HBITS_Ref}</p>
//               <p className="my-0">
//                 Training Period: {excelDateToJSDate(student.training_start)} to{" "}
//                 {excelDateToJSDate(student.training_end)}
//               </p>
//             </strong>
//           </div>
//           <div className="Certificate-footer">
//             <p className="fs-6">
//               102, Ground Floor, Pocket-1, Sector-20, Rohini – 110086 Phone:
//               +91-9318422511, E-mail:{" "}
//               <span>
//                 <a href="#">info@hbitscollege.com </a>
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Format4;

const Format4 = ({ student, index, excelDateToJSDate }) => {
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
        {/* Certificate Heading */}
        <div
          className="absolute top-[200px] left-[-50px] w-[900px] text-center font-semibold"
          style={{ fontSize: "40px", fontFamily: "'Times New Roman', serif" }}
        >
          <p>Certificate of Completion</p>
        </div>

        {/* Certificate Data */}
        <div
          className="absolute top-[340px] left-[110px] w-[580px] text-base text-justify"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          <p className="text-xl">
            This is to certify that Mr./Ms.{" "}
            <span className="uppercase">
              <strong>{student.name} </strong>
            </span>
            sponsored by{" "}
            <span className="uppercase">
              <strong>{student.Company_name}</strong>
            </span>{" "}
            has completed through{" "}
            <a href="#" className="text-blue-600 hover:underline">
              www.hbitscollege.com
            </a>{" "}
            the Online Training of 15 hours for Point of {student.position} as
            per the syllabus prescribed by the Insurance Regulatory &
            Development Authority of India Guidelines Ref:
            IRDAI/INT/CIR/PSP160/09/2018. Dated: 25 Sep 2018.
          </p>
        </div>

        {/* Person Details */}
        <div
          className="absolute top-[600px] left-[110px] w-[580px] text-base text-justify"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          <strong className="text-xl">
            <p className="my-0">APPL No: {student.application_number}</p>
            <p className="my-0">PAN No. : {student.Pan_ID}</p>
            <p className="my-0">HBITS Ref No. : {student.HBITS_Ref}</p>
            <p className="my-0">
              Training Period: {excelDateToJSDate(student.training_start)} to{" "}
              {excelDateToJSDate(student.training_end)}
            </p>
          </strong>
        </div>

        {/* Certificate Footer */}
        <div
          className="absolute top-[1020px] left-[-55px] w-[900px] text-center font-semibold"
          style={{ fontFamily: "Calibri" }}
        >
          <p className="text-sm">
            102, Ground Floor, Pocket-1, Sector-20, Rohini – 110086 Phone:
            +91-9318422511, E-mail:{" "}
            <a href="#" className="text-blue-600 hover:underline">
              info@hbitscollege.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Format4;
