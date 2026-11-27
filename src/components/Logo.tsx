import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold tracking-tight text-slate-900">
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
      >
        P
      </span>
      <span className="text-lg">Postula</span>
    </Link>
  );
}
