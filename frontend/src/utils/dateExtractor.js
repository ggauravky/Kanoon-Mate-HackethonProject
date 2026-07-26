/**
 * Utility: Calculates days remaining and urgency status code for a due date
 * Status Colors:
 *  - Green:  7+ days ('normal')
 *  - Yellow: 3–7 days ('warning')
 *  - Red:    < 3 days ('urgent')
 *  - Gray:   Expired ('expired')
 */
export function calculateDeadlineMetrics(dueDateStr) {
  if (!dueDateStr) return { daysRemaining: 0, urgencyCode: 'expired', badgeColor: 'gray' }

  const now = new Date()
  const due = new Date(dueDateStr)

  // Reset time portions for accurate date-diff
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)

  const diffTime = due.getTime() - now.getTime()
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let urgencyCode = 'normal'
  let badgeColor = 'green'

  if (daysRemaining < 0) {
    urgencyCode = 'expired'
    badgeColor = 'gray'
  } else if (daysRemaining <= 3) {
    urgencyCode = 'urgent'
    badgeColor = 'red'
  } else if (daysRemaining <= 7) {
    urgencyCode = 'warning'
    badgeColor = 'yellow'
  }

  return { daysRemaining, urgencyCode, badgeColor }
}

/**
 * Utility: Automatically extract dates & deadlines from AI analysis findings
 */
export function extractDeadlinesFromAI(analysisData, documentId = null) {
  const extractedReminders = []
  const today = new Date()

  // 1. Reply Notice Deadlines (e.g. 15 or 30 days from notice)
  if (analysisData?.legalDeadlines?.replyWindow) {
    const days = parseInt(analysisData.legalDeadlines.replyWindow) || 15
    const due = new Date(today.setDate(today.getDate() + days))

    extractedReminders.push({
      title: 'Reply to Legal Notice',
      description: `Mandatory written reply window extracted from ${analysisData.documentType || 'Legal Document'}.`,
      category: 'Reply Deadline',
      dueDate: due.toISOString().split('T')[0],
      priority: 'high',
      status: 'pending',
      documentId,
      extractedFromAI: true,
    })
  }

  // 2. Hearing Dates
  if (analysisData?.hearingDate) {
    extractedReminders.push({
      title: 'Court / Forum Hearing',
      description: `Hearing date identified in AI analysis.`,
      category: 'Hearing',
      dueDate: new Date(analysisData.hearingDate).toISOString().split('T')[0],
      priority: 'high',
      status: 'pending',
      documentId,
      extractedFromAI: true,
    })
  }

  // 3. Rent Renewal / Payment Due Dates
  if (analysisData?.keyDates?.length > 0) {
    analysisData.keyDates.forEach((kd) => {
      extractedReminders.push({
        title: kd.label || 'Legal Action Deadline',
        description: kd.note || 'Extracted from AI document audit.',
        category: kd.type || 'Filing Date',
        dueDate: kd.date,
        priority: 'medium',
        status: 'pending',
        documentId,
        extractedFromAI: true,
      })
    })
  }

  return extractedReminders
}
