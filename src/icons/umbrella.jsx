import { twMerge } from "tailwind-merge";

export default function Umbrella({ className }) {
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
      <path className="fill-current" d="M4 12a8 8 0 0 1 16 0z" />
      <path d="M12 12v6a2 2 0 0 0 4 0" />
    </svg>
  );
}
