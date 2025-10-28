"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorAlert } from "@/components/error-alert";
import { FormFieldError } from "@/components/form-field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignInFormData } from "@/utils/validation/auth-schemas";
import { signInSchema } from "@/utils/validation/auth-schemas";
import { postSignIn } from "../endpoints";

type SignInFormProps = {
  callbackUrl?: string;
  initialError?: string | null;
};

export default function SignInForm({
  callbackUrl,
  initialError,
}: SignInFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInFormData) {
    setError(null);

    const result = await postSignIn({
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(result.redirectUrl);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label className="font-medium text-sm" htmlFor="email">
          メールアドレス
        </Label>
        <Input
          {...register("email")}
          autoComplete="email"
          className="mt-2 h-12 text-base"
          id="email"
          type="email"
        />
        <FormFieldError message={errors.email?.message} />
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor="password">
          パスワード
        </Label>
        <Input
          {...register("password")}
          autoComplete="current-password"
          className="mt-2 h-12 text-base"
          id="password"
          type="password"
        />
        <FormFieldError message={errors.password?.message} />
      </div>
      <ErrorAlert message={error} />
      <Button
        className="h-12 w-full font-semibold text-base"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "ログイン中..." : "ログイン"}
      </Button>
    </form>
  );
}
