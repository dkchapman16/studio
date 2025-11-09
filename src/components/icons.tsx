import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M128 128H40a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h88l32 32Z" />
        <path d="M168 128h24a8 8 0 0 0 8-8V88l-32-32" />
        <circle cx="60" cy="168" r="20" />
        <circle cx="188" cy="168" r="20" />
        <path d="M168 168h-88m-20-20v-48" />
        <path d="M188 148v-44.8a8 8 0 0 1 4.9-7.4l20.2-7.2" />
      </g>
    </svg>
  );
}
