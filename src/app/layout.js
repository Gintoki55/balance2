import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '../components/Footer';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Balance Desalination Simulator',
  description: 'Simulate the Future of Desalination - Advanced desalination training tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.className } >
        {children}
        <Footer />
      </body>
    </html>
  );
}