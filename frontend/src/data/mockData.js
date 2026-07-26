// ─── Mock User ────────────────────────────────────────────────────────────────
export const mockUser = {
  id: 'usr_001',
  name: 'Gaurav Sharma',
  email: 'gaurav.sharma@example.com',
  phone: '+91 98765 43210',
  avatar: null, // will fall back to initials avatar
  role: 'Individual',
  plan: 'Pro',
  joinedAt: '2024-01-15',
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const mockStats = [
  {
    id: 'stat_docs',
    label: 'Documents Uploaded',
    value: 24,
    trend: +12,
    icon: 'FileText',
    color: 'primary',
  },
  {
    id: 'stat_ai',
    label: 'AI Analyses',
    value: 18,
    trend: +5,
    icon: 'Bot',
    color: 'accent',
  },
  {
    id: 'stat_deadlines',
    label: 'Upcoming Deadlines',
    value: 3,
    trend: 0,
    icon: 'CalendarClock',
    color: 'warning',
  },
  {
    id: 'stat_reports',
    label: 'Saved Reports',
    value: 9,
    trend: +3,
    icon: 'BookMarked',
    color: 'purple',
  },
]

// ─── Recent Documents ─────────────────────────────────────────────────────────
export const mockDocuments = [
  {
    id: 'doc_001',
    name: 'Rent Agreement – Sector 21, Noida',
    type: 'Contract',
    status: 'Analysed',
    uploadedOn: '2025-07-20',
    size: '1.2 MB',
  },
  {
    id: 'doc_002',
    name: 'Legal Notice – Consumer Forum',
    type: 'Notice',
    status: 'Pending Review',
    uploadedOn: '2025-07-18',
    size: '340 KB',
  },
  {
    id: 'doc_003',
    name: 'Employment Agreement – TechCorp Ltd.',
    type: 'Agreement',
    status: 'Analysed',
    uploadedOn: '2025-07-15',
    size: '2.1 MB',
  },
  {
    id: 'doc_004',
    name: 'Property Sale Deed – Plot 44B',
    type: 'Deed',
    status: 'Flagged',
    uploadedOn: '2025-07-10',
    size: '4.8 MB',
  },
  {
    id: 'doc_005',
    name: 'FIR Copy – Cyber Fraud Case',
    type: 'FIR',
    status: 'Analysed',
    uploadedOn: '2025-07-08',
    size: '500 KB',
  },
  {
    id: 'doc_006',
    name: 'Cheque Bounce Notice u/s 138 NI Act',
    type: 'Notice',
    status: 'Pending Review',
    uploadedOn: '2025-07-05',
    size: '280 KB',
  },
]

// ─── Upcoming Deadlines ───────────────────────────────────────────────────────
export const mockDeadlines = [
  {
    id: 'dl_001',
    title: 'Reply to Consumer Forum Notice',
    dueDate: '2025-07-30',
    daysRemaining: 4,
    status: 'Urgent',
    document: 'Legal Notice – Consumer Forum',
  },
  {
    id: 'dl_002',
    title: 'Rent Agreement Renewal Deadline',
    dueDate: '2025-08-10',
    daysRemaining: 15,
    status: 'Upcoming',
    document: 'Rent Agreement – Sector 21, Noida',
  },
  {
    id: 'dl_003',
    title: 'Cheque Bounce Response Submission',
    dueDate: '2025-08-20',
    daysRemaining: 25,
    status: 'Upcoming',
    document: 'Cheque Bounce Notice u/s 138 NI Act',
  },
]

// ─── Legal Tips ───────────────────────────────────────────────────────────────
export const legalTips = [
  {
    id: 'tip_001',
    tip: 'Never ignore a legal notice. Always respond within the specified time frame, even if you disagree.',
    category: 'General',
  },
  {
    id: 'tip_002',
    tip: 'Under Section 138 of the Negotiable Instruments Act, a bounced cheque is a criminal offence.',
    category: 'Banking',
  },
  {
    id: 'tip_003',
    tip: "A rent agreement registered with the sub-registrar's office is legally more enforceable than a notarised one.",
    category: 'Property',
  },
  {
    id: 'tip_004',
    tip: 'Consumer complaints can be filed online at consumerhelpline.gov.in for goods or services disputes.',
    category: 'Consumer',
  },
  {
    id: 'tip_005',
    tip: 'Always keep a written record of all property-related transactions. Oral agreements have limited legal standing.',
    category: 'Property',
  },
  {
    id: 'tip_006',
    tip: 'An employer cannot withhold your full and final settlement for more than 45 days after resignation.',
    category: 'Employment',
  },
]

// ─── AI Chat History ──────────────────────────────────────────────────────────
export const mockChatHistory = [
  {
    id: 'chat_001',
    title: 'Understanding Section 138 NI Act',
    lastMessage: 'What is the penalty for cheque dishonour?',
    date: '2025-07-20',
    messages: 8,
  },
  {
    id: 'chat_002',
    title: 'Rent Agreement Clauses Explained',
    lastMessage: 'What clauses protect the tenant?',
    date: '2025-07-18',
    messages: 12,
  },
  {
    id: 'chat_003',
    title: 'Consumer Forum Filing Guide',
    lastMessage: 'How do I file a complaint against a builder?',
    date: '2025-07-15',
    messages: 6,
  },
]
