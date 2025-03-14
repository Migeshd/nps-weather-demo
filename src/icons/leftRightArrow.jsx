import { twMerge } from "tailwind-merge";

export default function LeftRightArrow({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("size-6", className)}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="inherit"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M21 17l-18 0" />
      <path d="M6 10l-3 -3l3 -3" />
      <path d="M3 7l18 0" />
      <path d="M18 20l3 -3l-3 -3" />
    </svg>
  );
}
