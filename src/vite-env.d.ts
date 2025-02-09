/// <reference types="vite/client" />

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.json' {
  const value: { [key: string]: string };
  export default value;
}