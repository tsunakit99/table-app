import Link from "next/link";
import SignUpForm from "../../../features/routes/auth/components/sign-up-form";

type SignUpPageProps = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default function SignUp({ searchParams }: SignUpPageProps) {
  const callbackUrl = searchParams?.callbackUrl;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-lg bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-2xl text-gray-900 sm:text-3xl">
              居食屋たーぶる
            </h1>
            <p className="text-gray-600 text-sm">
              アカウントを作成してください
            </p>
          </div>
          <SignUpForm callbackUrl={callbackUrl} />
          <div className="text-center text-sm">
            <span className="text-gray-600">
              既にアカウントをお持ちですか？
            </span>{" "}
            <Link
              className="font-medium text-blue-600 hover:text-blue-500"
              href="/auth/signin"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
