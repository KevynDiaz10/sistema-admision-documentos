"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./../../../public/hero-img-2.png";
function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
       router.push(`/auth/complete-profile?email=${encodeURIComponent(data.email)}`);
    }
  });

  console.log(errors);

  return (
    <main className="min-h-screen grid grid-cols-2 justify-items-center items-center h-screen bg-linear-to-br from-blue-800 via-blue-900 to-blue-950">
      <div className="w-full items-center justify-center flex">
        <img
          src="/hero-img-2.png"
          alt="Register image"
          className="w-2/3 object-cover rounded-md"
        />
      </div>
      <div className="flex justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow"
        >
          <h1 className=" font-bold text-4xl mb-4">Register</h1>

          <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
            Email:
          </label>
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            placeholder="user@email.com"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">
              {errors.email.message as string}
            </span>
          )}

          <label
            htmlFor="password"
            className="text-slate-500 mb-2 block text-sm"
          >
            Password:
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            placeholder="********"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message as string}
            </span>
          )}

          <label
            htmlFor="confirmPassword"
            className="text-slate-500 mb-2 block text-sm"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            placeholder="********"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message as string}
            </span>
          )}
          <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
            Register
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/auth/login"
                className="font-medium text-blue-500 hover:text-blue-600"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
export default RegisterPage;
