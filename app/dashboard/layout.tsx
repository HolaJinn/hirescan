import { Toaster } from "@/components/ui/sonner";
import Navbar from "../components/Navbar";
import { requireUser } from "../utils/hooks";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await requireUser();

    return (
        <html lang="en">
            <body>
                <Navbar session={session} />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
