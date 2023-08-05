declare function getTracer(): any;

declare module '@auth-example/trace' {
  export = getTracer;
}