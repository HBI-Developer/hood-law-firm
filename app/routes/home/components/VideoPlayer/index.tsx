import { useRef, useState } from "react";
import { Icon as Iconify } from "@iconify/react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onClose: () => void;
}

export default function VideoPlayer({
  src,
  poster,
  onClose,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null),
    [isPlaying, setIsPlaying] = useState(true),
    togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
        setIsPlaying(!isPlaying);
      }
    };

  return (
    <div className="absolute inset-0 z-20 bg-black animate-[fade-in_0.5s_ease-out]">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        className="w-full h-full object-contain"
        poster={poster}
      />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        <button
          onClick={togglePlay}
          className="text-white hover:text-side-2 transition-colors"
        >
          <Iconify
            icon={
              isPlaying ? "heroicons:pause-16-solid" : "heroicons:play-16-solid"
            }
            fontSize={28}
          />
        </button>

        <button
          onClick={onClose}
          className="text-white hover:text-red-400 transition-colors"
        >
          <Iconify icon="heroicons:x-mark-16-solid" fontSize={28} />
        </button>
      </div>
    </div>
  );
}
