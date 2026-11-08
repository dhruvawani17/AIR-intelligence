import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mumbai Air Intelligence — Environmental Geospatial AI",
  description: "See the pollution. Predict the risk. Understand the city. Precision AI forecasting and geospatial environmental intelligence for the Google Mumbai Data Challenge.",
  keywords: ["Mumbai", "Air Quality", "PM2.5", "Machine Learning", "Forecast", "Geospatial", "Zindi", "Google Mumbai Data Challenge"],
  authors: [{ name: "Mumbai Air Intelligence Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-midnight-950 text-slate-100 font-sans antialiased selection:bg-cyanAccent selection:text-midnight-950">
        {children}
      </body>
    </html>
  );
}
