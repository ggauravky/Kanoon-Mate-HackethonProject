import { useState } from 'react'
import { Star, Award, ThumbsUp, MessageSquare, ShieldCheck } from 'lucide-react'

export default function AdvocateReviews() {
  const reviews = [
    {
      id: 1,
      clientName: 'Sanjay Gupta',
      rating: 5,
      date: '12 July 2026',
      caseType: 'Property Sale Deed',
      comment: 'Adv. Rahul provided excellent guidance regarding property registration in Delhi High Court. Highly professional and thorough.',
    },
    {
      id: 2,
      clientName: 'Meenakshi Rao',
      rating: 5,
      date: '02 June 2026',
      caseType: 'Consumer Protection',
      comment: 'Quick turnaround time for legal notice. Resolved our consumer dispute within 15 days.',
    },
    {
      id: 3,
      clientName: 'Karan Mehra',
      rating: 4,
      date: '18 May 2026',
      caseType: 'Cheque Dishonour',
      comment: 'Clear explanation of Section 138 statutory notice timelines. Highly recommended for commercial legal issues.',
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Star className="text-amber-400 fill-amber-400" /> Client Reviews & Ratings
        </h1>
        <p className="text-xs text-slate-400">
          Client feedback, star rating breakdown, and verified client testimonials.
        </p>
      </div>

      {/* Summary Score Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-center space-y-1">
          <p className="text-3xl font-extrabold text-white">4.8 ★</p>
          <p className="text-xs font-semibold text-amber-400">Average Rating</p>
          <p className="text-[11px] text-slate-400">Based on 15 verified reviews</p>
        </div>

        <div className="sm:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Star Rating Breakdown</h3>
          {[
            { star: 5, pct: 80, count: 12 },
            { star: 4, pct: 15, count: 2 },
            { star: 3, pct: 5, count: 1 },
          ].map((item) => (
            <div key={item.star} className="flex items-center gap-3 text-xs">
              <span className="w-10 font-bold text-slate-300">{item.star} Stars</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="w-6 text-slate-400 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{rev.clientName}</h4>
                <p className="text-[11px] text-indigo-400 font-semibold">{rev.caseType}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400">{rev.rating}.0 ★</span>
                <p className="text-[10px] text-slate-500">{rev.date}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
