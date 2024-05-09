import { twMerge } from "tailwind-merge";

export default function Fog({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("size-6", className)}
      width="44"
      height="44"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="inherit"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 16a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12" />
      <path d="M5 20l14 0" />
    </svg>
  );
}
