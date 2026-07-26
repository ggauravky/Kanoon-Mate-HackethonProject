import mongoose from 'mongoose'
import User from '../models/user.model.js'
import AdvocateProfile from '../models/advocateProfile.model.js'

const SAMPLE_ADVOCATES = [
  {
    fullName: 'Adv. Rahul Sharma',
    email: 'rahul.sharma@advocate.in',
    phone: '+91 9876543210',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    barCouncilNumber: 'D/1234/2012',
    practiceAreas: ['Property Lawyer', 'Real Estate Lawyer', 'Civil Lawyer'],
    experience: 12,
    officeAddress: 'Chamber 402, High Court Lawyers Block, New Delhi',
    languages: ['Hindi', 'English'],
    consultationFee: 1500,
    rating: 4.9,
    totalReviews: 88,
    totalCasesHandled: 340,
    bio: 'Senior Property & Real Estate litigation specialist with 12+ years experience handling rent disputes, sale deed verification, land acquisition, and High Court appeals.',
    onlineAvailable: true,
    offlineAvailable: true,
  },
  {
    fullName: 'Adv. Priya Malhotra',
    email: 'priya.malhotra@advocate.in',
    phone: '+91 9812345678',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110003',
    barCouncilNumber: 'D/5678/2015',
    practiceAreas: ['Family Lawyer', 'Divorce Lawyer', 'Women Rights Lawyer'],
    experience: 9,
    officeAddress: 'Patiala House Court Chambers, New Delhi',
    languages: ['Hindi', 'English', 'Punjabi'],
    consultationFee: 1200,
    rating: 4.8,
    totalReviews: 64,
    totalCasesHandled: 210,
    bio: 'Specializing in matrimonial disputes, mutual consent divorce, domestic violence protection, child custody, and family mediation.',
    onlineAvailable: true,
    offlineAvailable: true,
  },
  {
    fullName: 'Adv. Vikramaditya Singh',
    email: 'vikram.singh@advocate.in',
    phone: '+91 9711223344',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110017',
    barCouncilNumber: 'D/8901/2010',
    practiceAreas: ['Criminal Lawyer', 'Banking Lawyer', 'Civil Lawyer'],
    experience: 14,
    officeAddress: 'Saket District Court Lawyers Enclave, New Delhi',
    languages: ['Hindi', 'English'],
    consultationFee: 2000,
    rating: 4.9,
    totalReviews: 105,
    totalCasesHandled: 480,
    bio: 'Lead counsel for Section 138 Cheque Bounce cases, BNSS bail proceedings, criminal notices, and financial dispute litigations.',
    onlineAvailable: true,
    offlineAvailable: true,
  },
  {
    fullName: 'Adv. Ananya Roy',
    email: 'ananya.roy@advocate.in',
    phone: '+91 9833445566',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    barCouncilNumber: 'MAH/2345/2014',
    practiceAreas: ['Corporate Lawyer', 'Startup Lawyer', 'Trademark Lawyer'],
    experience: 10,
    officeAddress: 'Fort Chambers, Commercial Hub, Nariman Point, Mumbai',
    languages: ['English', 'Marathi', 'Hindi'],
    consultationFee: 2500,
    rating: 4.9,
    totalReviews: 72,
    totalCasesHandled: 190,
    bio: 'Corporate counsel advising tech startups and enterprises on NDAs, employment contracts, founder agreements, and trademark filings.',
    onlineAvailable: true,
    offlineAvailable: true,
  },
  {
    fullName: 'Adv. Rajesh Kulkarni',
    email: 'rajesh.kulkarni@advocate.in',
    phone: '+91 9822001122',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    barCouncilNumber: 'MAH/8765/2011',
    practiceAreas: ['Consumer Lawyer', 'Cyber Crime Lawyer', 'Civil Lawyer'],
    experience: 13,
    officeAddress: 'Bandra Family & District Court Annex, Mumbai',
    languages: ['English', 'Marathi', 'Hindi'],
    consultationFee: 1800,
    rating: 4.7,
    totalReviews: 53,
    totalCasesHandled: 260,
    bio: 'Consumer Forum practitioner & cyber fraud legal specialist. Assisting citizens with e-commerce fraud refunds, cyber complaints, and service defects.',
    onlineAvailable: true,
    offlineAvailable: true,
  },
  {
    fullName: 'Adv. Suresh Reddy',
    email: 'suresh.reddy@advocate.in',
    phone: '+91 9900112233',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    barCouncilNumber: 'KAR/3456/2013',
    practiceAreas: ['Employment Lawyer', 'Labour Lawyer', 'Corporate Lawyer'],
    experience: 11,
    officeAddress: 'M.G. Road Advocates Plaza, Bengaluru',
    languages: ['English', 'Kannada', 'Hindi'],
    consultationFee: 1600,
    rating: 4.8,
    totalReviews: 48,
    totalCasesHandled: 175,
    bio: 'Employment law authority helping IT professionals & organizations with severance disputes, non-compete clauses, and workplace harassment claims.',
    onlineAvailable: true,
    offlineAvailable: true,
  },
]

export const seedAdvocates = async () => {
  try {
    const existingCount = await AdvocateProfile.countDocuments()
    if (existingCount > 0) return

    console.log('🌱 Seeding sample Advocates and Advocate Profiles...')

    for (const adv of SAMPLE_ADVOCATES) {
      let user = await User.findOne({ email: adv.email })
      if (!user) {
        user = await User.create({
          fullName: adv.fullName,
          email: adv.email,
          password: 'AdvocatePass@123',
          phone: adv.phone,
          city: adv.city,
          state: adv.state,
          pincode: adv.pincode,
          role: 'advocate',
          isVerified: true,
        })
      }

      await AdvocateProfile.create({
        user: user._id,
        barCouncilNumber: adv.barCouncilNumber,
        practiceAreas: adv.practiceAreas,
        experience: adv.experience,
        officeAddress: adv.officeAddress,
        city: adv.city,
        state: adv.state,
        pincode: adv.pincode,
        languages: adv.languages,
        consultationFee: adv.consultationFee,
        bio: adv.bio,
        verified: true,
        rating: adv.rating,
        totalReviews: adv.totalReviews,
        totalCasesHandled: adv.totalCasesHandled,
        onlineAvailable: adv.onlineAvailable,
        offlineAvailable: adv.offlineAvailable,
      })
    }

    console.log('✅ Advocates seeded successfully!')
  } catch (err) {
    console.warn('Failed to seed advocates:', err.message)
  }
}
