import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
};

export default function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-base-300 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {value}
          </h3>

          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
          {icon}
        </div>
      </div>
    </div>
  );
}