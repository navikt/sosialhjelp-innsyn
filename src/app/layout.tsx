import { ReactNode } from "react";

import "./globals.css";

type Props = {
    children: ReactNode;
};

// Må ha tom layout for å kunne bruke not-found.tsx
export default function RootLayout({ children }: Props) {
    return children;
}
