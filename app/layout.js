import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AnyTime Bank",
  description: "A modern banking app",
};

function Navbar() {
  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 shadow-lg py-4 px-8 flex items-center justify-between">
      <span className="text-xl font-bold text-blue-400">AnyTime Bank</span>
      {/* Add nav links or user menu here */}
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-gray-100 min-h-screen`}
      >
        <div className="min-h-screen flex flex-col">
          
          <main className="flex-1 flex flex-col items-center py-8 bg-black">
            <div className="w-full max-w-4xl px-4">{children}</div>
          </main>
          {/* Optionally add a footer here */}
        </div>
      </body>
    </html>
  );
}