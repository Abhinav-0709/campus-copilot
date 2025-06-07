import fs from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function createSamplePdf() {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([550, 750]);
  
  // Get the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  
  // Add a title
  page.drawText('Sample University Document', {
    x: 50,
    y: 700,
    size: 20,
    font,
    color: rgb(0, 0, 0.8),
  });

  // Add some content
  const content = [
    'University of Sampleville',
    '123 Education Street',
    'Sampleville, SV 12345',
    '\n',
    'Student Information:',
    '------------------',
    '• Student ID: S12345678',
    '• Name: Sample Student',
    '• Program: Computer Science',
    '• Enrollment Date: Fall 2024',
    '\n',
    'Academic Policies:',
    '-----------------',
    '1. All assignments must be submitted by the due date.',
    '2. Attendance is mandatory for all lectures.',
    '3. Plagiarism will result in disciplinary action.',
    '\n',
    'Contact Information:',
    '-------------------',
    'Email: info@sampleuniv.edu',
    'Phone: (123) 456-7890',
    'Website: www.sampleuniv.edu',
  ];

  // Draw the content
  let y = 650;
  for (const line of content) {
    page.drawText(line, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('documents/sample_document.pdf', pdfBytes);
  console.log('Sample PDF created at documents/sample_document.pdf');
}

createSamplePdf().catch(console.error);
