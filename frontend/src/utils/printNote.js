/**
 * printNote(html, title)
 * Opens a clean, professional print window containing only the note content.
 * Works for Save as PDF as well. Does NOT trigger window.print() on the main app.
 */
export function printNote(html = '', title = 'Untitled Note') {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // Create a hidden iframe instead of opening a new background window
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';

  // Append iframe to body
  document.body.appendChild(iframe);

  // When the iframe finishes loading its content (fonts, images), trigger print
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Cleanup the iframe after printing is done
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 500); // Short delay to ensure visual rendering is complete
  };

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A4;
      margin: 10mm 12mm 10mm 12mm;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.75;
      color: #1a1a1a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Page wrapper ── */
    .page {
      max-width: 100%;
    }

    /* ── Header ── */
    .note-header {
      padding-bottom: 10pt;
      margin-bottom: 14pt;
      border-bottom: 2px solid #111;
    }
    .note-header .brand {
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #aaa;
      margin-bottom: 8pt;
    }
    .note-header h1 {
      font-size: 24pt;
      font-weight: 700;
      color: #111;
      line-height: 1.15;
      margin: 0 0 5pt 0;
      border: none !important;
      padding: 0 !important;
    }
    .note-header .date {
      font-size: 8pt;
      color: #888;
    }

    /* ── Content ── */
    .note-body {
      /* no extra padding – @page margins handle spacing */
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', sans-serif;
      color: #111;
      page-break-after: avoid;
      page-break-inside: avoid;
      margin-top: 14pt;
      margin-bottom: 4pt;
    }
    h1 { font-size: 18pt; font-weight: 700; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 4pt; }
    h2 { font-size: 14pt; font-weight: 700; }
    h3 { font-size: 12pt; font-weight: 600; }
    h4 { font-size: 11pt; font-weight: 600; }
    h5, h6 { font-size: 10.5pt; font-weight: 600; }

    /* Paragraph */
    p { margin: 0 0 7pt; }

    /* Links */
    a { color: #1d4ed8; text-decoration: underline; }

    /* Bold / italic / underline */
    strong { font-weight: 700; }
    em { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }

    /* Lists */
    ul, ol { margin: 3pt 0 7pt 18pt; padding: 0; }
    li { margin: 2pt 0; line-height: 1.65; }
    ul { list-style-type: disc; }
    ol { list-style-type: decimal; }
    ul ul { list-style-type: circle; margin-top: 1pt; }
    ul ul ul { list-style-type: square; }

    /* Task list */
    ul[data-type="taskList"] {
      list-style: none !important;
      margin-left: 0 !important;
    }
    ul[data-type="taskList"] > li {
      display: flex;
      align-items: flex-start;
      gap: 7pt;
      margin: 3pt 0;
    }
    ul[data-type="taskList"] > li > label {
      display: flex;
      align-items: center;
      gap: 5pt;
      flex-shrink: 0;
      margin-top: 2pt;
    }
    ul[data-type="taskList"] > li > label > input[type="checkbox"] {
      width: 10pt;
      height: 10pt;
      accent-color: #4f46e5;
      cursor: default;
    }
    ul[data-type="taskList"] > li[data-checked="true"] > div {
      text-decoration: line-through;
      color: #9ca3af;
    }

    /* Blockquote */
    blockquote {
      border-left: 3pt solid #374151;
      margin: 10pt 0 10pt 0;
      padding: 4pt 0 4pt 13pt;
      font-style: italic;
      color: #4b5563;
      background: transparent;
    }

    /* Inline code */
    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt;
      background: #f3f4f6;
      color: #b91c1c;
      padding: 1pt 4pt;
      border-radius: 3pt;
      border: 0.5pt solid #e5e7eb;
    }

    /* Code block */
    pre {
      font-family: 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      background: #f8fafc;
      color: #1e293b;
      border: 1pt solid #e2e8f0;
      border-radius: 4pt;
      padding: 9pt 12pt;
      margin: 8pt 0;
      white-space: pre-wrap;
      word-break: break-word;
      page-break-inside: avoid;
    }
    pre code {
      background: none;
      border: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }

    /* Highlight */
    mark {
      background: #fef08a;
      color: #1a1a1a;
      padding: 0 2pt;
      border-radius: 2pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Horizontal rule */
    hr {
      border: none;
      border-top: 1pt solid #d1d5db;
      margin: 13pt 0;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 8pt 0;
      page-break-inside: avoid;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
      page-break-inside: auto;
      font-size: 9.5pt;
    }
    thead { display: table-header-group; }
    th {
      background: #f3f4f6;
      color: #111;
      font-weight: 700;
      border: 1pt solid #cbd5e1;
      padding: 6pt 10pt;
      text-align: left;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    td {
      border: 1pt solid #e2e8f0;
      padding: 5pt 10pt;
      vertical-align: top;
      color: #1a1a1a;
    }
    tr { page-break-inside: avoid; }
    tbody tr:nth-child(even) td {
      background: #fafafa;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Page break helpers */
    img, figure, pre, blockquote, table { page-break-inside: avoid; }
    p, li { orphans: 3; widows: 3; }

    /* Text alignment */
    [style*="text-align: center"], .text-center { text-align: center; }
    [style*="text-align: right"], .text-right { text-align: right; }

    /* Subscript / Superscript */
    sub { vertical-align: sub; font-size: smaller; }
    sup { vertical-align: super; font-size: smaller; }
  </style>
</head>
<body>
  <div class="page">
    <div class="note-header">
      <div class="brand">Smart Notes</div>
      <h1>${escHtml(title)}</h1>
      <div class="date">Printed on ${date}</div>
    </div>
    <div class="note-body">
      ${html}
    </div>
  </div>
</body>
</html>`);
  doc.close();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
