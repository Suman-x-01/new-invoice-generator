// import { useState } from "react";

// import GSTInvoiceGenerator from "./Components/GSTInvoiceGenerator";
// import Portfolio from "./Components/Portfolio";
// import { Route } from "lucide-react";
// import { BrowserRouter, Routes } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import KitDownload from "./Components/KitDownload";
// import Home from "./Components/Home";
// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/invoice" element={<GSTInvoiceGenerator />} />
//         <Route path="/kitDownload" element={<KitDownload />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import GSTInvoiceGenerator from "./Components/GSTInvoiceGenerator";
import KitDownload from "./Components/KitDownload";
import Certificate from "./Components/Certificate/Certificate";
import "./index.css";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoice" element={<GSTInvoiceGenerator />} />
        <Route path="/kitDownload" element={<KitDownload />} />
        <Route path="/certificate" element={<Certificate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
