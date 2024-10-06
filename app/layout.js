import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

const RootLayout = ({ children }) => (
  <ClerkProvider>
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://stijndv.com" />
        <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
      </head>
      <body>{children}</body>
    </html>
  </ClerkProvider>
);

export default RootLayout;