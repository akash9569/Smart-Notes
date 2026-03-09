import React, { useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { printNote as printNoteUtil } from '../utils/printNote';

/**
 * PrintPreviewModal
 * Shows an in-app A4 print preview. When the user clicks Print / Save as PDF,
 * @media print CSS hides the modal chrome and prints only the paper content.
 */
const PrintPreviewModal = ({ isOpen, onClose, html = '', title = 'Untitled Note' }) => {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Prevent background scroll while modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePrint = () => printNoteUtil(html, title);

    return (
        <>
            {/* No @media print styles needed — printNoteUtil opens a clean dedicated window */}

            {/* Modal portal wrapper */}
            <div id="print-portal" style={{ display: 'block' }}>
                {/* Overlay */}
                <div
                    className="print-modal-overlay fixed inset-0 z-[9999] flex flex-col bg-gray-900/80 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    {/* Toolbar */}
                    <div className="print-modal-toolbar flex items-center justify-between px-6 py-3 bg-gray-900/95 border-b border-gray-700 shrink-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Printer className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm leading-tight">{title}</p>
                                <p className="text-gray-400 text-xs">{date} · A4 Portrait</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print / Save as PDF</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                title="Close preview"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable preview area */}
                    <div className="print-modal-scroll flex-1 overflow-y-auto py-8 px-4 bg-gray-800/60">
                        {/* A4 paper */}
                        <div
                            className="print-paper mx-auto bg-white shadow-2xl rounded-sm"
                            style={{
                                width: '250mm',
                                maxWidth: '100%',
                                minHeight: '250mm',
                                padding: '10mm 12mm 10mm 12mm',
                                boxSizing: 'border-box',
                                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                                fontSize: '10.5pt',
                                lineHeight: '1.75',
                                color: '#1a1a1a',
                            }}
                        >
                            {/* Note header */}
                            <div style={{ borderBottom: '2px solid #111', paddingBottom: '10pt', marginBottom: '14pt' }}>
                                <div style={{
                                    fontSize: '7pt', fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.15em', color: '#aaa', marginBottom: '8pt',
                                }}>
                                    Smart Notes
                                </div>
                                <h1 style={{
                                    fontSize: '22pt', fontWeight: 700, color: '#111',
                                    lineHeight: 1.15, margin: '0 0 5pt', border: 'none', padding: 0,
                                }}>
                                    {title}
                                </h1>
                                <div style={{ fontSize: '8pt', color: '#888' }}>Printed on {date}</div>
                            </div>

                            {/* Note body */}
                            <style>{noteBodyCSS}</style>
                            <div
                                className="note-print-body"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

/* CSS applied to the note content inside the preview */
const noteBodyCSS = `
  .note-print-body h1, .note-print-body h2, .note-print-body h3,
  .note-print-body h4, .note-print-body h5, .note-print-body h6 {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    color: #111; page-break-after: avoid; page-break-inside: avoid;
    margin-top: 14pt; margin-bottom: 4pt;
  }
  .note-print-body h1 { font-size: 18pt; font-weight: 700; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 4pt; }
  .note-print-body h2 { font-size: 14pt; font-weight: 700; }
  .note-print-body h3 { font-size: 12pt; font-weight: 600; }
  .note-print-body h4, .note-print-body h5, .note-print-body h6 { font-size: 10.5pt; font-weight: 600; }
  .note-print-body p { margin: 0 0 7pt; }
  .note-print-body a { color: #1d4ed8; text-decoration: underline; }
  .note-print-body strong { font-weight: 700; }
  .note-print-body em { font-style: italic; }
  .note-print-body u { text-decoration: underline; }
  .note-print-body s { text-decoration: line-through; }
  .note-print-body ul, .note-print-body ol { margin: 3pt 0 7pt 18pt; padding: 0; }
  .note-print-body li { margin: 2pt 0; line-height: 1.65; }
  .note-print-body ul { list-style-type: disc; }
  .note-print-body ol { list-style-type: decimal; }
  .note-print-body ul ul { list-style-type: circle; }
  .note-print-body ul[data-type="taskList"] { list-style: none !important; margin-left: 0 !important; }
  .note-print-body ul[data-type="taskList"] > li { display: flex; align-items: flex-start; gap: 7pt; margin: 3pt 0; }
  .note-print-body ul[data-type="taskList"] > li > label { display: flex; align-items: center; gap: 5pt; flex-shrink: 0; margin-top: 2pt; }
  .note-print-body ul[data-type="taskList"] > li > label > input[type="checkbox"] { width: 10pt; height: 10pt; accent-color: #4f46e5; cursor: default; }
  .note-print-body ul[data-type="taskList"] > li[data-checked="true"] > div { text-decoration: line-through; color: #9ca3af; }
  .note-print-body blockquote { border-left: 3pt solid #374151; margin: 10pt 0; padding: 4pt 0 4pt 13pt; font-style: italic; color: #4b5563; }
  .note-print-body code { font-family: 'Courier New', monospace; font-size: 9pt; background: #f3f4f6; color: #b91c1c; padding: 1pt 4pt; border-radius: 3pt; border: 0.5pt solid #e5e7eb; }
  .note-print-body pre { font-family: 'Courier New', monospace; font-size: 8.5pt; background: #f8fafc; color: #1e293b; border: 1pt solid #e2e8f0; border-radius: 4pt; padding: 9pt 12pt; margin: 8pt 0; white-space: pre-wrap; word-break: break-word; }
  .note-print-body pre code { background: none; border: none; padding: 0; color: inherit; }
  .note-print-body mark { background: #fef08a; color: #1a1a1a; padding: 0 2pt; border-radius: 2pt; }
  .note-print-body hr { border: none; border-top: 1pt solid #d1d5db; margin: 13pt 0; }
  .note-print-body img { max-width: 100%; height: auto; display: block; margin: 8pt 0; page-break-inside: avoid; }
  .note-print-body table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 9.5pt; }
  .note-print-body thead { display: table-header-group; }
  .note-print-body th { background: #f3f4f6; color: #111; font-weight: 700; border: 1pt solid #cbd5e1; padding: 6pt 10pt; text-align: left; }
  .note-print-body td { border: 1pt solid #e2e8f0; padding: 5pt 10pt; vertical-align: top; }
  .note-print-body tbody tr:nth-child(even) td { background: #fafafa; }
  .note-print-body sub { vertical-align: sub; font-size: smaller; }
  .note-print-body sup { vertical-align: super; font-size: smaller; }

  @media print {
    .note-print-body mark { background: #fef08a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .note-print-body th { background: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .note-print-body tbody tr:nth-child(even) td { background: #fafafa !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export default PrintPreviewModal;
