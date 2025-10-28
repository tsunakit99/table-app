type FormFieldErrorProps = {
  message?: string;
};

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-red-600 text-sm">{message}</p>;
}
