// const Format2 = ({ student, index, excelDateToJSDate }) => {
//   return (
//     <>
//       <div key={index} className="my-4 d-flex justify-content-center">
//         <div id={`certificate-${index}`} className="background-div">
//           <div className="certificate-heading">
//             <p className="">Certificate of Completion</p>
//           </div>

//           <div className="certificate-data">
//             <p className="fs-5">
//               This is to certify that Mr./Ms.{" "}
//               <span className="text-uppercase">
//                 <strong>{student.name} </strong>
//               </span>
//               has completed 25 Hours of Online Training in Distance Marketing of
//               Insurance Products prescribed vide IRDAI Guidelines Ref:
//               IRDA/ADMN/GDL/MISC/059/04/2011 DT. 05/04/2011 <br/>
//               Through
//                <span> <a href="#">www.hbitscollege.com</a></span> from <strong> {excelDateToJSDate(student.training_start)}</strong> to <strong> {excelDateToJSDate(student.training_end)} </strong><br/>

//               The candidate appeared for the Online Examination on{" "}
//               <strong>{excelDateToJSDate(student.date)}</strong> and has been
//               declared successful by securing <strong>{student.marks}</strong>{" "}
//               marks.
//             </p>
//           </div>

//           <div className="person-details fs-5" style={{top:"460px"}} >
//             <strong>
//               <p className="my-0">Location: {student.location}</p>
//               <p className="my-0">APPL No. : {student.application_number}</p>
//               <p className="my-0">PAN No. : {student.Pan_ID}</p>
//               <p className="my-0">Aadhar No. : {student.aadhar_no}</p>
//               <p className="my-0">HBITS Ref No. : {student.HBITS_Ref}</p>
//               <div className="row">
//   <div className="col text-start">
//     <p className="mb-0">TRIA No. : {student.TRIA_No}</p>
//   </div>
//   <div className="col text-end">
//     <p className="mb-0">Dated : {excelDateToJSDate(student.date)}</p>
//   </div>
// </div>
//               <p className="my-0">Name of Company : {student.Company_name}</p>
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

// export default Format2;

const Format2 = ({ student, index, excelDateToJSDate }) => {
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
            has completed 25 Hours of Online Training in Distance Marketing of
            Insurance Products prescribed vide IRDAI Guidelines Ref:
            IRDA/ADMN/GDL/MISC/059/04/2011 DT. 05/04/2011 <br />
            Through{" "}
            <a href="#" className="text-blue-600 hover:underline">
              www.hbitscollege.com
            </a>{" "}
            from <strong>{excelDateToJSDate(student.training_start)}</strong> to{" "}
            <strong>{excelDateToJSDate(student.training_end)}</strong>
            <br />
            The candidate appeared for the Online Examination on{" "}
            <strong>{excelDateToJSDate(student.date)}</strong> and has been
            declared successful by securing <strong>{student.marks}</strong>{" "}
            marks.
          </p>
        </div>

        {/* Person Details */}
        <div
          className="absolute top-[460px] left-[110px] w-[580px] text-base text-justify"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          <strong className="text-xl">
            <p className="my-0">Location: {student.location}</p>
            <p className="my-0">APPL No. : {student.application_number}</p>
            <p className="my-0">PAN No. : {student.Pan_ID}</p>
            <p className="my-0">Aadhar No. : {student.aadhar_no}</p>
            <p className="my-0">HBITS Ref No. : {student.HBITS_Ref}</p>
            <div className="grid grid-cols-2">
              <div className="text-left">
                <p className="mb-0">TRIA No. : {student.TRIA_No}</p>
              </div>
              <div className="text-right">
                <p className="mb-0">
                  Dated : {excelDateToJSDate(student.date)}
                </p>
              </div>
            </div>
            <p className="my-0">Name of Company : {student.Company_name}</p>
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

export default Format2;
