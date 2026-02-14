import { useEffect, useState } from "react";

export default function ReadingProgressBar({
  articleRef,
}: {
  articleRef: React.RefObject<HTMLElement>;
}) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!articleRef.current) {
            ticking = false;
            return;
          }

          const articleTop = articleRef.current.offsetTop;
          const articleHeight = articleRef.current.offsetHeight;
          const windowHeight = window.innerHeight;
          const scrollY = window.scrollY;

          const articleStart = articleTop;
          const articleEnd = articleTop + articleHeight - windowHeight;

          if (scrollY < articleStart) {
            setScroll(0);
          } else if (scrollY > articleEnd) {
            setScroll(100);
          } else {
            const progress =
              ((scrollY - articleStart) / (articleEnd - articleStart)) * 100;
            setScroll(Math.min(100, Math.max(0, progress)));
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [articleRef]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200">
      <div
        className="h-full bg-side-2 transition-all duration-300 ease-out"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
}
