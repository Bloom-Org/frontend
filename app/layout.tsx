import AppLayout from "./appLayout";

export const metadata = {
    title: "Bloom",
    description: "Bloom official website",
    icons: {
        icon: {url: "/favicon.ico"},
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1
    }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <AppLayout>
            {children}
        </AppLayout>
  )
}
