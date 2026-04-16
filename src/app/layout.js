import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'FitPulse | Your Personal AI Fitness Coach',
  description: 'AI-based personalized workout systems, progress tracking, and professional fitness guidance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
