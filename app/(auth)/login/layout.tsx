
'use client'
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >     
            <main className="">
              {children}
            </main>    
      </body>
    </html>
  );
}