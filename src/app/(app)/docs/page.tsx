"use client";

import { useState } from "react";

export default function DocsPage() {
  const [test, setTest] = useState("hello");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Documentation</h1>
      <p className="text-gray-400">Documentation page - {test}</p>
      <button 
        onClick={() => setTest("world")}
        className="mt-4 px-4 py-2 bg-brand-500 text-white rounded"
      >
        Test
      </button>
    </div>
  );
}

