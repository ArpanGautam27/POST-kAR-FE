import { useEffect, useState } from "react";

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

interface EncryptedTextProps {
  text: string;
  className?: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
}

export const EncryptedText = ({
  text,
  className = "",
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-black dark:text-white",
  revealDelayMs = 50,
}: EncryptedTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    let intervalRef: ReturnType<typeof setInterval>;

    const scramble = async () => {
      setIsRevealing(true);
      let pos = 0;

      intervalRef = setInterval(() => {
        const scrambled = text
          .split("")
          .map((char, index) => {
            if (pos / CYCLES_PER_LETTER > index) {
              return char;
            }

            const randomCharIndex = Math.floor(Math.random() * CHARS.length);
            const randomChar = CHARS[randomCharIndex];

            return randomChar;
          })
          .join("");

        setDisplayText(scrambled);
        pos++;

        if (pos >= text.length * CYCLES_PER_LETTER) {
          clearInterval(intervalRef);
          setDisplayText(text);
          setIsRevealing(false);
        }
      }, SHUFFLE_TIME);
    };

    const timer = setTimeout(() => {
      scramble();
    }, revealDelayMs);

    return () => {
      clearTimeout(timer);
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [text, revealDelayMs]);

  return (
    <span
      className={`${className} ${
        isRevealing ? encryptedClassName : revealedClassName
      } transition-colors duration-300`}
    >
      {displayText}
    </span>
  );
};
