import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CardItem from "./CardItem";
import { data } from "@/data"; 
import type { VideoItem } from "@/types";

export default function ThreeDSection() {
  const [uiSelectedId, setUiSelectedId] = useState<number>(data[0].id);
  const [videoActiveId, setVideoActiveId] = useState<number>(data[0].id);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Ref map to hold all <video> elements
  const videoRefs = useRef<Record<number, HTMLVideoElement>>({});

  // Helper to play a segment from startTime to endTime
  const playSegment = useCallback(
    (video: HTMLVideoElement, startTime: number, endTime: number) => {
      return new Promise<void>((resolve) => {
        video.currentTime = startTime;
        video.play().catch(console.error);
        const onTimeUpdate = () => {
          if (video.currentTime >= endTime) {
            video.removeEventListener("timeupdate", onTimeUpdate);
            resolve();
          }
        };
        video.addEventListener("timeupdate", onTimeUpdate);
      });
    },
    []
  );

  const handleButtonClick = useCallback(
    async (item: VideoItem) => {
      if (isTransitioning || item.id === videoActiveId) return;

      // 1. Update UI CardItem immediately
      setUiSelectedId(item.id);
      setIsTransitioning(true);

      const current = videoRefs.current[videoActiveId];
      const next = videoRefs.current[item.id];

      // 2. Play second half of current video
      if (current) {
        const half = current.duration / 2;
        await playSegment(current, half, current.duration);
        current.style.display = "none";
      }

      // 3. Show and play first half of next video
      if (next) {
        next.style.display = "block";
        const halfNext = next.duration / 2;
        await playSegment(next, 0, halfNext);
        next.pause();
      }

      // 4. Activate next video and end transition
      setVideoActiveId(item.id);
      setIsTransitioning(false);
    },
    [isTransitioning, videoActiveId, playSegment]
  );

  return (
    <div className="p-4 flex items-center justify-evenly gap-4 h-screen w-screen overflow-hidden">
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={uiSelectedId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <CardItem
              name={data.find((d) => d.id === uiSelectedId)!.name}
              description={data.find((d) => d.id === uiSelectedId)!.description}
              data={data}
              selectedItemId={uiSelectedId}
              onButtonClick={handleButtonClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center">
        {data.map((item) => (
          <video
            key={item.id}
            ref={(el) => {
              if (el) videoRefs.current[item.id] = el;
            }}
            src={item.src}
            preload="auto"
            muted
            className="w-5/6 h-10/12 object-cover"
            style={{ display: item.id === videoActiveId ? "block" : "none" }}
          />
        ))}
      </div>
    </div>
  );
}