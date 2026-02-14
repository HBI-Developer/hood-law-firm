import { Icon } from "@iconify/react";

interface DataEmptyStateProps {
  message: string;
  className?: string;
}

export default function DataEmptyState({
  message,
  className = "",
}: DataEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/5 backdrop-blur-sm border border-dashed border-stone-300 ${className}`}
    >
      <div className="bg-stone-100 p-6 rounded-full mb-4">
        <Icon
          icon="solar:box-minimalistic-linear"
          className="w-16 h-16 text-stone-400"
        />
      </div>
      <p className="text-xl font-secondary text-stone-500 max-w-md italic">
        {message}
      </p>
    </div>
  );
}
