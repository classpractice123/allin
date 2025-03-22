"use client"

import { useState } from "react"
import "./PDFViewer.css"

const PDFViewer = ({ pdfUrl, title }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [loading, setLoading] = useState(true)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25)
    }
  }

  const handleDocumentLoad = ({ numPages }) => {
    setTotalPages(numPages)
    setLoading(false)
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h2 className="pdf-title">{title}</h2>
        <div className="pdf-controls">
          <div className="page-navigation">
            <button className="nav-button" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button className="nav-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
          <div className="zoom-controls">
            <button className="zoom-button" onClick={handleZoomOut} disabled={zoom <= 50}>
              -
            </button>
            <span className="zoom-level">{zoom}%</span>
            <button className="zoom-button" onClick={handleZoomIn} disabled={zoom >= 200}>
              +
            </button>
          </div>
        </div>
      </div>

      <div className="pdf-container" style={{ transform: `scale(${zoom / 100})` }}>
        {loading ? (
          <div className="pdf-loading">
            <div className="loading-spinner"></div>
            <p>Loading PDF...</p>
          </div>
        ) : (
          <iframe src={`${pdfUrl}#page=${currentPage}`} title={title} className="pdf-iframe"></iframe>
        )}
      </div>

      <div className="pdf-footer">
        <p>This is a preview. Purchase the book to access the full content.</p>
      </div>
    </div>
  )
}

export default PDFViewer

