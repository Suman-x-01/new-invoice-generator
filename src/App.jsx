import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import GSTInvoiceGenerator from "./Components/GSTInvoicegenerator";
import GSTInvoiceGenerator from "./Components/GSTInvoiceGenerator";

function App() {
  const [count, setCount] = useState(0);

  return <GSTInvoiceGenerator />;
}

export default App;
