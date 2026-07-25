import { ProfileWizard } from "@/components/complete-profile/profile-wizard"

export default function Page() {
  return (
    <main className="min-h-svh bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-medium text-primary">Registro de estudiante</p>
          <h1 className="mt-1 text-balance text-2xl font-bold text-foreground sm:text-3xl">
            Completa tu perfil
          </h1>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground">
            Sube los documentos requeridos y completa tus datos personales en unos sencillos pasos.
          </p>
        </header>

        <ProfileWizard />
      </div>
    </main>
  )
}
