export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: "white", margin: 0 }}>

        {/* TOP BAR WITH LEFT + RIGHT LOGO ONLY */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* LEFT LOGO */}
          <img
            src="/logo-left.png"
            alt="Left Logo"
            style={{ height: 45 }}
          />

          {/* RIGHT LOGO */}
          <img
            src="/logo-right.png"
            alt="Right Logo"
            style={{ height: 45 }}
          />
        </header>

        {children}
      </body>
    </html>
  );
}
