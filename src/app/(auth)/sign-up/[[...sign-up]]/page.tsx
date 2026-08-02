import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-white/80 dark:bg-black/50 backdrop-blur-xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl",
          headerTitle: "text-zinc-900 dark:text-zinc-100",
          headerSubtitle: "text-zinc-500 dark:text-zinc-400",
          socialButtonsBlockButton: "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors",
          socialButtonsBlockButtonText: "font-medium",
          dividerLine: "bg-zinc-200 dark:bg-zinc-800",
          dividerText: "text-zinc-400 dark:text-zinc-500",
          formFieldLabel: "text-zinc-700 dark:text-zinc-300",
          formFieldInput: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-indigo-500 focus:border-indigo-500 transition-all rounded-lg",
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all rounded-lg",
          footerActionText: "text-zinc-500 dark:text-zinc-400",
          footerActionLink: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
        },
      }}
    />
  );
}
