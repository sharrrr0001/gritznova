import Image from "next/image";
import { clientLogos } from "@/content/home";

/** Slow logo marquee. Pauses on hover/focus and becomes a static row under reduced motion. */
export function TrustedBy() {
  const loop = [...clientLogos, ...clientLogos];

  return (
    <section aria-label="Clients" className="border-border bg-surface/50 border-y py-10">
      <div className="container-page flex flex-col items-center gap-7">
        <p className="text-fg-subtle text-center text-sm">
          Trusted by teams building what&apos;s next
        </p>
        <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <ul className="animate-marquee flex w-max gap-4 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
            {loop.map((client, i) => (
              <li
                key={`${client.name}-${i}`}
                aria-hidden={i >= clientLogos.length}
                className="flex h-12 min-w-40 items-center justify-center motion-reduce:[&:nth-child(n+9)]:hidden"
              >
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={140}
                    height={40}
                    className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="placeholder-chip rounded-lg px-4 py-2.5 text-[0.6875rem] tracking-wider">
                    {client.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
