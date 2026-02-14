import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface StatCardProps {
  stat: number;
  label: string;
  icon: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function StatCard({
  stat,
  label,
  icon,
  prefix = "",
  suffix = "",
  duration = 2000,
}: StatCardProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const countRef = useRef(0);

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const nextCount = Math.floor(progress * stat);

        setCount(nextCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, stat, duration]);

  return (
    <div
      ref={ref}
      className={`bg-white p-8 rounded-sm shadow-sm border-b-4 border-side-2 flex flex-col items-center text-center transition-all duration-700 transform hover:-translate-y-2 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 text-side-1">
        <Icon icon={icon} width="32" />
      </div>
      <div className="text-4xl md:text-5xl font-primary font-bold text-secondary mb-2">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-side-3 font-secondary text-lg opacity-80 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
