import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSession } from "@/lib/auth";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: {
    default: "StudyShare - Platform Catatan ITAF",
    template: "%s | StudyShare",
  },
  description:
    "Platform berbagi catatan pembelajaran siswa. Belajar bersama, berkembang bersama untuk masa depan yang lebih cerah.",
  keywords: [
    "catatan sekolah",
    "belajar",
    "pendidikan",
    "siswa",
    "pelajaran",
    "study",
    "notes",
  ],
  authors: [{ name: "StudyShare" }],
  creator: "StudyShare",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "StudyShare",
    title: "StudyShare - Platform Catatan Sekolah",
    description:
      "Platform berbagi catatan pembelajaran siswa. Belajar bersama, berkembang bersama.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyShare - Platform Catatan Sekolah",
    description: "Platform berbagi catatan pembelajaran siswa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06b6d4",
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const user = session?.user || null;

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
