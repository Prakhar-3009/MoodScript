import { SignIn } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export default function SignInPage() {
  return (
    <Card className="shadow-2xl border-0 w-full max-w-md">
      <CardHeader className="flex flex-col items-center text-center pt-0 pb-0">
        <Image src="/Logo.png" alt="MoodScript Logo" width={100} height={28} className="mb-2" />
        <CardTitle className="text-2xl font-bold text-orange-600/70">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to your MoodScript account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pt-0 pb-0 w-full">
        <div className="w-full flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
                card: 'shadow-none border-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500 text-sm',
                formFieldInput: 'border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                formFieldLabel: 'text-gray-700 font-medium text-sm',
                footerActionLink: 'text-green-600 hover:text-green-700 font-medium',
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}