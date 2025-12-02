"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export interface HoverBorderGradientProps
  extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
}

export const HoverBorderGradient: React.FC<
  React.PropsWithChildren<HoverBorderGradientProps>
> = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT:
      "radial-gradient(16.6% 43.1% at 0% 50%, rgba(255,255,255,0.9) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, rgba(255,255,255,0.9) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, rgba(255,255,255,0.9) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181% at 50% 50%, rgba(229,231,235,1) 0%, rgba(255,255,255,0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border-2 border-neutral-500 content-center bg-transparent hover:bg-transparent transition duration-500 items-center flex-row flex-nowrap justify-center overflow-visible w-full h-[50px]",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-full text-white text-sm font-semibold z-10 bg-transparent px-5 flex items-center justify-center h-full rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction], opacity: 0 }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
          opacity: hovered ? 1 : 0,
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
    </Tag>
  );
};

export default HoverBorderGradient;
