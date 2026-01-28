import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Zap, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          {/* Left Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              Generate <span className="text-blue-600">GST Invoices</span>{" "}
              <br />
              Fast, Clean & Professional ✨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 text-gray-600 text-base sm:text-lg"
            >
              Create professional tax invoices and export PDF instantly.
              Designed for speed, simplicity, and real-world use.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => navigate("/invoice")}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Create Invoice
              </button>

              <button
                onClick={() => navigate("/pdf-generator")}
                className="px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold border border-gray-200 shadow-sm hover:bg-gray-50 transition"
              >
                Go to PDF Generator
              </button>
            </motion.div>

            {/* Small Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-4 text-sm text-gray-500"
            >
              ✔ No complicated setup • ✔ Works smoothly • ✔ Easy export
            </motion.div>
          </div>

          {/* Right Card / Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Invoice Preview</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                  Live
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 border">
                    <p className="text-xs text-gray-500">Invoice No</p>
                    <p className="font-semibold text-gray-900">INV-1024</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-semibold text-gray-900">₹ 12,450</p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-sm text-blue-700 font-semibold">
                    PDF Export Ready 🚀
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Download invoice instantly in one click.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Glow */}
            <div className="absolute -top-8 -right-8 h-32 w-32 bg-blue-300 opacity-20 blur-3xl rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <FeatureCard
            icon={<Zap className="text-blue-600" />}
            title="Fast Generation"
            desc="Create invoices in seconds with clean UI."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-green-600" />}
            title="Accurate Format"
            desc="Professional structure & GST-friendly layout."
          />
          <FeatureCard
            icon={<Download className="text-purple-600" />}
            title="Instant Download"
            desc="Export PDF quickly with one click."
          />
          <FeatureCard
            icon={<FileText className="text-orange-600" />}
            title="Reusable"
            desc="Use again & again for multiple clients."
          />
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
    >
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-3 font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
};

export default Home;
