export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">
        Contraloria de Zamora · Estado Aragua
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Gestion comunal y censo poblacional
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Plataforma base para organizar comunidades, calles, familias y habitantes.
      </p>
      <a
        className="mt-8 w-fit rounded bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
        href="/login"
      >
        Iniciar sesion
      </a>
    </main>
  );
}