"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./../../../public/login-image.jpg";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-2 justify-items-center items-center bg-sky-950">
      <div className="w-full items-center justify-center flex">
        <img
          src="/login-image.jpg"
          alt="Login"
          className="w-2/3 object-cover rounded-md"
        />
      </div>
      <div>
        <div className="mx-auto w-full max-w-xl p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold ">Iniciar Sesión</h1>
          <p className="text-gray-600 mb-6 text-xs">
            Inicia sesión para acceder a tu cuenta.
          </p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a
                href="/auth/register"
                className="font-medium text-blue-500 hover:text-blue-600"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
