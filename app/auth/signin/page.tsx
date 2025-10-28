import Link from "next/link";
import SignInForm from "../../../features/routes/auth/components/sign-in-form";
import { NEXTAUTH_ERROR_CODES } from "../../../features/routes/auth/errors";

type SignInPageProps = {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
};

export default function SignIn({ searchParams }: SignInPageProps) {
  const errorKey = searchParams?.error;
  const callbackUrl = searchParams?.callbackUrl;
  const initialError =
    errorKey && errorKey in NEXTAUTH_ERROR_CODES
      ? NEXTAUTH_ERROR_CODES[errorKey as keyof typeof NEXTAUTH_ERROR_CODES]
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-lg bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-2xl text-gray-900 sm:text-3xl">
              居食屋たーぶる
            </h1>
            <p className="text-gray-600 text-sm">
              メールアドレスとパスワードでログインしてください
            </p>
          </div>
          <SignInForm callbackUrl={callbackUrl} initialError={initialError} />
          <div className="text-center text-sm">
            <span className="text-gray-600">
              アカウントをお持ちでないですか？
            </span>{" "}
            <Link
              className="font-medium text-blue-600 hover:text-blue-500"
              href="/auth/signup"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
