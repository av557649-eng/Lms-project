export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ background: 'white', margin: 0 }}>
        <header
          style={{
            padding: '15px',
            borderBottom: '1px solid #ddd',
            color: '#2E3A63',
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          AL SHIRAWI EQUIPMENT CO
        </header>

        {children}
      </body>
    </html>
  );
}
