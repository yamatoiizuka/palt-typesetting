declare module 'linebreak' {
  class LineBreaker {
    constructor(text: string);
    nextBreak(): { position: number } | null;
  }
  export = LineBreaker;
}