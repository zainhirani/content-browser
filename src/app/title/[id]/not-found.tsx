import Link from "next/link";

const TitleNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Title not found</h1>
      <p className="text-neutral-400">
        We couldn&apos;t find the title you were looking for.
      </p>
      <Link
        href="/"
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
      >
        Back to browse
      </Link>
    </div>
  );
}

export default TitleNotFound;