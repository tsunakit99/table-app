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
import { postSignUp } from "../endpoints";
import type { SignUpFormData } from "@/utils/validation/auth-schemas";
import { signUpSchema } from "@/utils/validation/auth-schemas";

type SignUpFormProps = {
  callbackUrl?: string;
};

export default function SignUpForm({ callbackUrl }: SignUpFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpFormData) {
    setError(null);

    const result = await postSignUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    // 登録成功後、サインインページにリダイレクト
    router.push(
      `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl ?? "/")}`
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label className="font-medium text-sm" htmlFor="name">
          名前
        </Label>
        <Input
          {...register("name")}
          autoComplete="name"
          className="mt-2 h-12 text-base"
          id="name"
          type="text"
        />
        <FormFieldError message={errors.name?.message} />
      </div>
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
          autoComplete="new-password"
          className="mt-2 h-12 text-base"
          id="password"
          type="password"
        />
        <FormFieldError message={errors.password?.message} />
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor="confirmPassword">
          パスワード（確認）
        </Label>
        <Input
          {...register("confirmPassword")}
          autoComplete="new-password"
          className="mt-2 h-12 text-base"
          id="confirmPassword"
          type="password"
        />
        <FormFieldError message={errors.confirmPassword?.message} />
      </div>
      <ErrorAlert message={error} />
      <Button
        className="h-12 w-full font-semibold text-base"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "登録中..." : "新規登録"}
      </Button>
    </form>
  );
}
