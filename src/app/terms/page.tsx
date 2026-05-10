'use client'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function TermsPage() {
  const accent = { color: '#C68B3A', fontFamily: 'Georgia, serif' }
  const body = { color: 'rgba(245,240,232,0.65)', fontFamily: 'Georgia, serif', lineHeight: '1.7', fontSize: '14px' }
  const heading = { color: '#F5F0E8', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', marginTop: '24px' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <Link href="/" className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
          &larr; Back
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-16 max-w-2xl mx-auto w-full">
        <div className="panel p-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Terms &amp; Conditions</h1>
          <p style={{ ...body, marginBottom: '8px' }}>Diesel Dude by WastedApe &mdash; dieseldude.thewastedape.com</p>
          <p style={{ ...body, marginBottom: '24px' }}>Last updated: May 2026</p>

          <p style={heading}>1. Acceptance of Terms</p>
          <p style={body}>By accessing or using Diesel Dude (&ldquo;the Service&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use the Service.</p>

          <p style={heading}>2. Description of Service</p>
          <p style={body}>Diesel Dude is an AI-powered diesel diagnostic assistant designed to provide informational guidance about diesel engine symptoms, fault codes, and maintenance procedures. The Service is intended as a supplementary reference tool only. <strong style={{ color: '#F5F0E8' }}>Diesel Dude is NOT a substitute for a qualified diesel mechanic or professional diagnosis.</strong> Always consult a certified technician for any repair work, especially for safety-critical systems.</p>

          <p style={heading}>3. Safety Warning</p>
          <p style={body}>Diesel engines, heavy equipment, and fleet vehicles involve high-pressure fuel systems, high-voltage components, and heavy machinery that can cause serious injury or death if improperly serviced. AI-generated diagnostic information may be incomplete or inaccurate. <strong style={{ color: '#e87070' }}>Always have qualified personnel perform mechanical repairs. Never rely solely on AI guidance for safety-critical work.</strong></p>

          <p style={heading}>4. User Accounts</p>
          <p style={body}>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must provide accurate information when creating your account.</p>

          <p style={heading}>5. Subscriptions and Payments</p>
          <p style={body}>Paid plans are billed monthly through Stripe. Subscriptions auto-renew unless cancelled before the renewal date. You may cancel at any time through your account settings. Refunds are not provided for partial billing periods. Prices may change with 30 days notice.</p>

          <p style={heading}>6. Disclaimer of Warranties</p>
          <p style={body}>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND. WASTEDAPE DOES NOT WARRANT THAT AI RESPONSES ARE ACCURATE, COMPLETE, OR SUITABLE FOR YOUR SPECIFIC SITUATION. DIESEL DIAGNOSTIC INFORMATION IS PROVIDED FOR REFERENCE PURPOSES ONLY.</p>

          <p style={heading}>7. Limitation of Liability</p>
          <p style={body}>WastedApe shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the Service, including but not limited to vehicle damage, equipment failure, personal injury, or property damage arising from reliance on AI-generated diagnostic information.</p>

          <p style={heading}>8. Intellectual Property</p>
          <p style={body}>All content, features, and functionality of Diesel Dude are owned by WastedApe and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.</p>

          <p style={heading}>9. Privacy</p>
          <p style={body}>Your use of the Service is also governed by our Privacy Policy. We collect minimal data necessary to provide the Service. We do not sell your personal information to third parties.</p>

          <p style={heading}>10. Changes to Terms</p>
          <p style={body}>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will notify users of material changes via email or in-app notification.</p>

          <p style={heading}>11. Contact</p>
          <p style={body}>Questions about these Terms? Contact us at: <a href="mailto:thewastedape@gmail.com" style={{ color: '#C68B3A' }}>thewastedape@gmail.com</a></p>

          <div className="mt-8 pt-4" style={{ borderTop: '1px solid rgba(198,139,58,0.2)' }}>
            <p style={{ ...body, fontSize: '12px' }}>
              &copy; 2026 WastedApe. All rights reserved. Diesel Dude by WastedApe.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

