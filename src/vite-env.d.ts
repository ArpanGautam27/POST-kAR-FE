/// <reference types="vite/client" />

// Asset module declarations for media imports
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.mov' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}
