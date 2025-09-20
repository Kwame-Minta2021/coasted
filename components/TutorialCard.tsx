export default function TutorialCard({ title, videoUrl, description }: { title: string; videoUrl: string; description: string }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={videoUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
        
      </div>
      <div className="p-4">
        <div className="font-semibold">{title}</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </article>
  )
}
