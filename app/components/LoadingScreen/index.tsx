import { useEffect, useRef, useState } from "react";
import logo from "~/assets/icon.svg";
import { ANIMATION_DURATION } from "~/constants";

export default function LoadingScreen({ open }: { open: boolean }) {
  const [shouldRender, setShouldRender] = useState(open),
    [ripples, setRipples] = useState<number[]>([]),
    isFirstTime = useRef(true);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const interval = setInterval(() => {
        setRipples((prev) => [...prev.slice(-2), Date.now()]);
      }, 700);
      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setRipples([]);
        isFirstTime.current = false;
      }, ANIMATION_DURATION());
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-200 flex items-center justify-center bg-primary 
        ${open ? (isFirstTime.current ? "" : "animate-fade-in") : "animate-fade-out"}`}
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        {ripples.map((id) => (
          <div
            key={id}
            className="absolute inset-0 rounded-full border-2 border-side-1/50 animate-[ripple-effect_2s_cubic-bezier(0,0,0.2,1)_forwards]"
          />
        ))}

        <img
          src={logo}
          alt="Hood bin Adel Logo"
          className="w-22 h-22 relative z-10 object-contain animate-[pulse-logo_1.4s_infinite_ease-in-out]"
        />
      </div>
    </div>
  );
}
