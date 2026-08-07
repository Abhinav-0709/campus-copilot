declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFData {
    text: string;
    info: any;
    metadata: any;
    version: string;
  }

  function pdfParse(data: Buffer | ArrayBuffer | string, options?: any): Promise<PDFData>;
  
  export = pdfParse;
}
