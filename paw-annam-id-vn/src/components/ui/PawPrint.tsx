import React from "react";

type PawPrintProps = {
  className?: string;
};

export default function PawPrint({ className = "" }: PawPrintProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pad */}
      <path d="M12 10a4 4 0 0 0-4 4c0 2.2 1.8 4 4 4s4-1.8 4-4a4 4 0 0 0-4-4Z" />
      {/* Toe 1 */}
      <circle cx="6.5" cy="9.5" r="1.8" />
      {/* Toe 2 */}
      <circle cx="10" cy="7" r="1.8" />
      {/* Toe 3 */}
      <circle cx="14" cy="7" r="1.8" />
      {/* Toe 4 */}
      <circle cx="17.5" cy="9.5" r="1.8" />
    </svg>
  );
}
