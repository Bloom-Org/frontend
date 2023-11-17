'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { LensProvider } from "@/components/lens-provider"
import { Nav } from "@/components/nav"
import "@rainbow-me/rainbowkit/styles.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apolloClient/client";
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { httpProvider } from "@/config/config";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai, polygon } from "wagmi/chains";


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    const appInfo = {
        appName: "Bloom",
    };

    const { chains, publicClient, webSocketPublicClient } = configureChains(
        [polygonMumbai, polygon],
        [
            jsonRpcProvider({
                rpc: () => ({
                  http: httpProvider,
                }),
            }),
            publicProvider()
        ]
    );

    const { connectors } = getDefaultWallets({
        appName: "Bloom",
        projectId: "11d13c2e90415299d07c23700aabdb53",
        chains
    });
      
    const config = createConfig({
        autoConnect: true,
        publicClient,
        webSocketPublicClient,
        connectors
    });
      

    return (
        <html lang="en">
        {/* PWA config */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" /> 
        <meta name="apple-mobile-web-app-title" content="Lens PWA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/icons/iconmain-512x512.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <body className={inter.className}>
            <ApolloProvider client={apolloClient}>
                <WagmiConfig config={config}>
                    <RainbowKitProvider appInfo={appInfo} chains={chains}>
                        <LensProvider>
                            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            <Nav />
                            {children}
                            </ThemeProvider>
                        </LensProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            </ApolloProvider>
        </body>
        </html>
    );
}

