import { Poppins } from "next/font/google";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";
import SessionProvider from "@/components/SessionProvider";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <head>
                <link rel="preload" href="/assets/background-splash.svg" as="image" />
            </head>
            <body>
                <SessionProvider>
                <LenisScroll />
                {children}
                </SessionProvider>
            </body>
        </html>
    );
}