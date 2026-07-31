import { ProfileWizard } from "@/components/complete-profile/profile-wizard"

export default function Page() {
  return (
    <main className="min-h-svh px-4 py-10 sm:py-16 bg-sky-950">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center text-white">
          <p className="text-sm font-medium">Registro de estudiante</p>
          <h1 className="mt-1 text-balance text-2xl font-bold sm:text-3xl">
            Completa tu perfil
          </h1>
          <p className="mx-auto mt-2 max-w-md  text-sm ">
            Sube los documentos requeridos y completa tus datos personales en unos sencillos pasos.
          </p>
        </header>

        <ProfileWizard />
      </div>
    </main>
  )
}
