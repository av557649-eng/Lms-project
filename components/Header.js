"use client";

import Image from "next/image";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 20,
        borderBottom: "1px solid #ccc"
      }}
    >
      <Image src="/logo-left.png" alt="logo" width={100} height={50} />
      <Image src="/logo-right.png" alt="logo" width={100} height={50} />
    </div>
  );
}
