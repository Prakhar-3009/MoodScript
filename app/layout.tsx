import Header from '@/components/Header'
import './globals.css'
import { Lora, Nunito } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import ConditionalFooter from '@/components/ConditionalFooter';
import { checkUser } from '@/lib/checkuser';
import { Toaster } from 'sonner';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '700'],
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'MoodScript',
 
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Check and sync user to database
  await checkUser();
  
  return (
    <ClerkProvider>
      <html lang="en" className={`${lora.variable} ${nunito.variable}`}>
        <body>
          <div className="fixed inset-0 -z-10 bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat opacity-50" />
          <Header />
          <main className='min-h-screen'>
            {children}
          </main>
          <Toaster richColors />
          <ConditionalFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
