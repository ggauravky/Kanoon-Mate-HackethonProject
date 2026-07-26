import PDFDocument from 'pdfkit'
import { uploadToCloudinary } from './upload.service.js'

/**
 * Generates a styled, multi-page PDF Legal Analysis Report using PDFKit
 * and streams it directly to Cloudinary.
 * 
 * @param {Object} document - Document Mongoose model populated with analysis
 * @param {Object} user - User Mongoose model (fullName, email)
 * @returns {Promise<{ filePath: string, fileUrl: string, publicId: string, fileSize: number, reportName: string }>}
 */
export const buildLegalReportPDF = async (document, user) => {
  const sanitizedTitle = (document.title || 'Legal_Document').replace(/[^a-zA-Z0-9]/g, '_')
  const reportName = `Legal_Report_${sanitizedTitle}.pdf`

  const analysis = document.analysis || {}
  const userName = user?.fullName || user?.email || 'Citizen User'
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true })
    const buffers = []

    doc.on('data', (chunk) => buffers.push(chunk))
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers)
        const uploadRes = await uploadToCloudinary(pdfBuffer, {
          folder: 'kanoon_mate/reports',
          fileName: `report-${document._id}-${Date.now()}`,
          resource_type: 'raw',
        })

        resolve({
          filePath: uploadRes.url,
          fileUrl: uploadRes.url,
          publicId: uploadRes.publicId,
          fileSize: pdfBuffer.length,
          pdfBuffer,
          reportName,
        })
      } catch (err) {
        reject(err)
      }
    })

    // Primary Colors
    const primaryColor = '#312E81' // Indigo-900
    const secondaryColor = '#4F46E5' // Indigo-600
    const darkTextColor = '#1E293B' // Slate-800
    const lightBgColor = '#F8FAFC' // Slate-50
    const borderGray = '#E2E8F0' // Slate-200

    // Risk Colors
    const riskLevel = analysis.riskLevel || 'Medium'
    const riskColors = {
      High: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
      Medium: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
      Low: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    }
    const currentRisk = riskColors[riskLevel] || riskColors.Medium

    // ─── COVER HEADER BANNER ──────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 100).fill(primaryColor)

    doc
      .fillColor('#FFFFFF')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('Kanoon-Mate', 40, 25)

    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#C7D2FE')
      .text('AI-Powered Legal Analysis & Compliance Report', 40, 52)

    doc
      .fontSize(9)
      .fillColor('#E0E7FF')
      .text(`Generated: ${generatedDate}`, 40, 70, { align: 'right', width: doc.page.width - 80 })

    doc.moveDown(4)

    // ─── DOCUMENT METADATA BOX ────────────────────────────────────────────────
    let y = 120
    doc.rect(40, y, doc.page.width - 80, 75).fillAndStroke(lightBgColor, borderGray)

    doc
      .fillColor(primaryColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(document.title || 'Legal Document Analysis', 55, y + 12)

    doc
      .fillColor(darkTextColor)
      .fontSize(9)
      .font('Helvetica')
      .text(`Original File: ${document.originalFileName || 'N/A'}`, 55, y + 32)
      .text(`Document Type: ${analysis.documentType || 'Legal Document'}`, 55, y + 46)
      .text(`Prepared For: ${userName}`, 320, y + 32)
      .text(`Language: ${analysis.language || 'English'}`, 320, y + 46)

    y += 90

    // Helper: Add Section Header
    const addSectionHeader = (title) => {
      if (y > 700) {
        doc.addPage()
        y = 40
      }
      doc
        .fillColor(secondaryColor)
        .fontSize(13)
        .font('Helvetica-Bold')
        .text(title, 40, y)
      
      doc
        .moveTo(40, y + 16)
        .lineTo(doc.page.width - 40, y + 16)
        .strokeColor(borderGray)
        .stroke()

      y += 24
    }

    // Helper: Draw Multi-line Text Box
    const addParagraphBox = (title, text) => {
      if (!text) return
      addSectionHeader(title)

      doc
        .fillColor(darkTextColor)
        .fontSize(9.5)
        .font('Helvetica')
        .text(text, 40, y, { width: doc.page.width - 80, align: 'justify', lineGap: 3 })

      y = doc.y + 15
    }

    // ─── EXECUTIVE SUMMARY ────────────────────────────────────────────────────
    addParagraphBox('Executive Summary', analysis.summary)

    // ─── CITIZEN-FRIENDLY EXPLANATION ─────────────────────────────────────────
    addParagraphBox('Simple Legal Explanation', analysis.simpleExplanation)

    // ─── RISK ASSESSMENT BADGE ────────────────────────────────────────────────
    if (y > 680) {
      doc.addPage()
      y = 40
    }
    addSectionHeader('Risk Assessment')

    doc
      .rect(40, y, doc.page.width - 80, 45)
      .fillAndStroke(currentRisk.bg, currentRisk.border)

    doc
      .fillColor(currentRisk.text)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(`Overall Risk Level: ${riskLevel.toUpperCase()}`, 55, y + 10)

    doc
      .fontSize(8.5)
      .font('Helvetica')
      .text(
        riskLevel === 'High'
          ? 'Requires immediate attention. Contains strict liability, critical deadlines, or penalty clauses.'
          : riskLevel === 'Medium'
          ? 'Moderate risk profile. Contains standard obligations and enforceable terms.'
          : 'Low risk profile. Standard informational or low-liability legal document.',
        55,
        y + 26
      )

    y += 60

    // ─── DETECTED LAWS TABLE ──────────────────────────────────────────────────
    if (analysis.detectedLaws && analysis.detectedLaws.length > 0) {
      if (y > 650) {
        doc.addPage()
        y = 40
      }
      addSectionHeader('Detected Laws & Applicable Acts')

      // Table Header
      doc.rect(40, y, doc.page.width - 80, 20).fill('#EEF2FF')
      doc
        .fillColor(primaryColor)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text('Act / Code', 48, y + 5)
        .text('Section', 185, y + 5)
        .text('Legal Context & Reason', 270, y + 5)

      y += 20

      analysis.detectedLaws.forEach((item, index) => {
        if (y > 720) {
          doc.addPage()
          y = 40
        }

        const bg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
        doc.rect(40, y, doc.page.width - 80, 22).fillAndStroke(bg, borderGray)

        doc
          .fillColor(darkTextColor)
          .fontSize(8.5)
          .font('Helvetica')
          .text(item.act || 'Indian Law', 48, y + 6, { width: 130, height: 14 })
          .text(item.section || 'General', 185, y + 6, { width: 80, height: 14 })
          .text(item.reason || '-', 270, y + 6, { width: 280, height: 14 })

        y += 22
      })

      y += 15
    }

    // ─── IMPORTANT DATES TIMELINE ─────────────────────────────────────────────
    if (analysis.importantDates && analysis.importantDates.length > 0) {
      if (y > 650) {
        doc.addPage()
        y = 40
      }
      addSectionHeader('Important Dates & Timelines')

      analysis.importantDates.forEach((item) => {
        if (y > 720) {
          doc.addPage()
          y = 40
        }

        doc.circle(48, y + 6, 4).fill(secondaryColor)
        doc
          .fillColor(primaryColor)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(item.date || 'Key Date', 60, y + 2)

        doc
          .fillColor(darkTextColor)
          .fontSize(8.5)
          .font('Helvetica')
          .text(item.description || '', 150, y + 2, { width: doc.page.width - 200 })

        y += 20
      })

      y += 15
    }

    // ─── RECOMMENDED ACTIONS CHECKLIST ────────────────────────────────────────
    if (analysis.requiredActions && analysis.requiredActions.length > 0) {
      if (y > 650) {
        doc.addPage()
        y = 40
      }
      addSectionHeader('Recommended Citizen Action Plan')

      analysis.requiredActions.forEach((action) => {
        if (y > 720) {
          doc.addPage()
          y = 40
        }

        doc
          .rect(48, y + 2, 10, 10)
          .strokeColor(secondaryColor)
          .stroke()

        doc
          .fillColor(darkTextColor)
          .fontSize(8.5)
          .font('Helvetica')
          .text(action, 66, y + 2, { width: doc.page.width - 110 })

        y += 18
      })

      y += 15
    }

    // ─── SUGGESTED QUESTIONS ──────────────────────────────────────────────────
    if (analysis.questionsYouMayAsk && analysis.questionsYouMayAsk.length > 0) {
      if (y > 650) {
        doc.addPage()
        y = 40
      }
      addSectionHeader('Suggested Questions for Advocates')

      analysis.questionsYouMayAsk.forEach((q, idx) => {
        if (y > 720) {
          doc.addPage()
          y = 40
        }

        doc
          .fillColor(secondaryColor)
          .fontSize(8.5)
          .font('Helvetica-Bold')
          .text(`Q${idx + 1}:`, 48, y)

        doc
          .fillColor(darkTextColor)
          .fontSize(8.5)
          .font('Helvetica')
          .text(q, 72, y, { width: doc.page.width - 115 })

        y += 18
      })

      y += 15
    }

    // ─── DISCLAIMER FOOTER ────────────────────────────────────────────────────
    if (y > 680) {
      doc.addPage()
      y = 40
    } else {
      y += 10
    }

    doc
      .rect(40, y, doc.page.width - 80, 50)
      .fillAndStroke('#FFFBEB', '#FCD34D')

    doc
      .fillColor('#B45309')
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('LEGAL DISCLAIMER', 50, y + 8)

    doc
      .fillColor('#92400E')
      .fontSize(7.5)
      .font('Helvetica')
      .text(
        analysis.disclaimer ||
          'This report is generated by Kanoon-Mate for informational purposes only. It is not legal advice and does not replace consultation with a qualified legal professional.',
        50,
        y + 20,
        { width: doc.page.width - 100 }
      )

    // ─── PAGE NUMBERS FOOTER ─────────────────────────────────────────────────
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i)
      doc
        .fontSize(8)
        .fillColor('#94A3B8')
        .text(
          `Page ${i + 1} of ${range.count}  •  Kanoon-Mate Official Report`,
          40,
          doc.page.height - 30,
          { align: 'center', width: doc.page.width - 80 }
        )
    }

    doc.end()
  })
}
