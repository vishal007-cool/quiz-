import React, { useState, useRef, useCallback } from 'react';
// Note: PDFDocument is now loaded dynamically from a CDN in the mergePdfs function.
import { Upload, FileText, X, Move, Download, Loader2, FileCheck2 } from 'lucide-react';

// Main application component
export default function App() {
  // State management for various parts of the application
  const [files, setFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Refs to track drag-and-drop items
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  /**
   * Handles file selection from the file input or drag-and-drop.
   * Filters for PDF files and updates the files state.
   */
  const handleFileChange = (e) => {
    setError('');
    setMergedPdfUrl(null);
    const selectedFiles = Array.from(e.target.files || e.dataTransfer.files);
    
    // Filter out non-PDF files
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== selectedFiles.length) {
        setError('Only PDF files are accepted. Non-PDF files have been ignored.');
    }

    if (pdfFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    }
  };

  /**
   * Removes a file from the list based on its index.
   */
  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };
  
  /**
   * Handles the start of a drag operation for reordering.
   */
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  /**
   * Handles dragging over another item, preparing for a potential drop.
   */
  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };
  
  /**
   * Handles the drop event to reorder the files array.
   */
  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newFiles = [...files];
    const dragItemContent = newFiles[dragItem.current];
    newFiles.splice(dragItem.current, 1);
    newFiles.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;

    setFiles(newFiles);
  };

  /**
   * Core function to merge the uploaded PDF files using the pdf-lib library.
   * It now dynamically imports pdf-lib from a CDN.
   */
  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please upload at least two PDF files to merge.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMergedPdfUrl(null);

    try {
      // Dynamically import the PDFDocument class from the pdf-lib library via a CDN.
      // This resolves the issue of the library not being found during compilation.
      const { PDFDocument } = await import('https://cdn.skypack.dev/pdf-lib');

      // Create a new PDFDocument
      const mergedPdf = await PDFDocument.create();

      // Iterate over the files
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Copy pages from the source PDF to the merged PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const mergedPdfBytes = await mergedPdf.save();

      // Create a blob and a URL for the merged PDF
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);

    } catch (err) {
      console.error(err);
      setError('An error occurred while merging the PDFs. Please check the files and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for the drag-and-drop upload area visual feedback
  const handleDragOverUpload = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeaveUpload = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDropUpload = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleFileChange(e);
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">PDF Merger by vishal </h1>
          <p className="text-md text-gray-500 mt-2">Combine your PDFs into one single document—fast and easy.</p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* File Upload Section */}
          <div 
            onDragOver={handleDragOverUpload}
            onDragLeave={handleDragLeaveUpload}
            onDrop={handleDropUpload}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
          >
            <div className="flex flex-col items-center text-gray-500">
                <Upload className="w-12 h-12 mb-4" />
                <p className="font-semibold">Drag & drop your PDFs here</p>
                <p className="text-sm mt-1">or</p>
                <label htmlFor="file-upload" className="mt-2 cursor-pointer font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Browse Files
                </label>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              multiple 
              accept="application/pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          {/* Error Message Display */}
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

          {/* File List Section */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">Files to Merge ({files.length})</h2>
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center space-x-3">
                      <Move className="w-5 h-5 text-gray-400" />
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={mergePdfs}
              disabled={isLoading || files.length < 2}
              className="flex-1 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Merging...
                </>
              ) : (
                'Merge PDFs'
              )}
            </button>

            {mergedPdfUrl && (
              <a
                href={mergedPdfUrl}
                download="merged.pdf"
                className="flex-1 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                <Download className="-ml-1 mr-3 h-5 w-5" />
                Download Merged PDF
              </a>
            )}
          </div>
          
          {mergedPdfUrl && (
            <div className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-md text-sm">
                <FileCheck2 className="w-5 h-5 mr-2" />
                Your merged PDF is ready for download!
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8">
            <p className="text-sm text-gray-500">
                All processing is done in your browser. Your files are never sent to a server.
            </p>
        </footer>
      </div>
    </div>
  );
}
