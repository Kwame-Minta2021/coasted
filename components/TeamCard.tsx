export type TeamMember = {
    name: string
    role: string
    bio: string
    photo?: string         // /team/filename.jpg (put images in public/team/)
    socials?: { label: string; href: string }[]
  }
  
  export default function TeamCard({ m }: { m: TeamMember }) {
    return (
      <article className="group overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <img
            src={m.photo || "/team/placeholder.png"}
            alt={m.name}
            className="h-20 w-20 flex-none rounded-2xl object-cover"
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-semibold">{m.name}</h3>
            <p className="text-sm text-slate-500">{m.role}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{m.bio}</p>
  
            {m.socials && m.socials.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.socials.map(s => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }
  