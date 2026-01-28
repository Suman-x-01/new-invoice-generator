// import React, { useState } from "react";
// import { FileText, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);

//   const navItems = [
//     { label: "Home", onClick: () => alert("Home Clicked") },
//     { label: "Invoices", onClick: () => alert("Invoices Clicked") },
//     { label: "Settings", onClick: () => alert("Settings Clicked") },
//   ];

//   return (
//     <nav className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="h-16 flex items-center justify-between">
//           {/* Left Brand */}
//           <div className="flex items-center gap-2">
//             <FileText className="text-blue-600" size={28} />
//             <div className="flex flex-col leading-tight">
//               <span className="font-bold text-lg text-gray-900">
//                 GST Invoice Generator
//               </span>
//               <span className="text-xs text-gray-500 hidden sm:block">
//                 Generate Professional Tax Invoices
//               </span>
//             </div>
//           </div>

//           {/* Desktop Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             {navItems.map((item, idx) => (
//               <button
//                 key={idx}
//                 onClick={item.onClick}
//                 className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//               >
//                 {item.label}
//               </button>
//             ))}
//           </div>

//           {/* Mobile Burger */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setOpen(!open)}
//               className="p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               {open ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Dropdown Menu */}
//         {open && (
//           <div className="md:hidden pb-4">
//             <div className="flex flex-col gap-2 mt-2">
//               {navItems.map((item, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => {
//                     item.onClick();
//                     setOpen(false);
//                   }}
//                   className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//                 >
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Invoice", path: "/invoice" },
    { label: "PDF Generator", path: "/kitDownload" },
    { label: "Certificate", path: "/certificate" },
  ];

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" size={28} />
            <span className="font-bold text-lg text-gray-900">
              {/* GST Invoice Generator */}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Burger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2 mt-2">
              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
