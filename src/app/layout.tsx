'use client';
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "./globals.css";

// Define the type for the props
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
