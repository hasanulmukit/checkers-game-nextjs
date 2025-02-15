import "../styles/globals.css";
import ClientProviders from "../components/ClientProviders";

export const metadata = {
  title: "Checkers",
  description:
    "Classic checkers with drag-and-drop built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
