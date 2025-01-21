interface MathJax {
    texReset: () => void;
    tex2svg: (text: string, options: { display: boolean }) => HTMLElement;
  }
  
declare global {
interface Window {
    MathJax: MathJax;
}
}

export {}
