"use client";

import { useState } from "react";

export default function TestPage() {
  const [test, setTest] = useState("hello");

  const handleClick = () => {
    setTest("world");
  };

  return (
    <div className="test">
      <h1>Test</h1>
      <button onClick={handleClick}>{test}</button>
    </div>
  );
}

