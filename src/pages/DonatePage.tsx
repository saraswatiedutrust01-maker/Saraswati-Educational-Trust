import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Landmark,
  Printer,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { DonationRecord } from '../types/cms';

const PRESET_AMOUNTS = [500, 1500, 3000, 5000, 15000, 25000];
const PURPOSES = [
  'Education & Bright Kids English Medium School',
  'School Kit Distribution for Rural Children',
  'Women Empowerment & SHG Livelihoods',
  'Natural Farming & Kitchen Garden Promotion',
  'Health, Nutrition & Sanitation Awareness',
  'Environmental Plantation & Climate Resilience',
  'General Charitable Corpus',
];
const PAYMENT_METHODS = ['UPI', 'Card', 'Net Banking', 'Bank Transfer (NEFT/RTGS)'];

export function DonatePage() {
  const [amountInr, setAmountInr] = useState<number>(1500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>(PURPOSES[0]);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [paymentReference, setPaymentReference] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);

  const [lookupNo, setLookupNo] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    receiptNumber: string;
    donorName: string;
    amountInr: number;
    purpose: string;
    paymentMethod: string;
    eligible80g: boolean;
    status: string;
    createdAt: string;
  } | null>(null);
  const [lookupError, setLookupError] = useState('');

  const effectiveAmount = customAmount ? Number(customAmount) || 0 : amountInr;
  const cleanPan = panNumber.trim().toUpperCase();
  const isValidPan = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPan);
  const meets80gPreview =
    isValidPan && address.trim().length >= 10 && paymentReference.trim().length >= 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (effectiveAmount < 100) {
      setErrorMsg('Minimum contribution amount is ₹100.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName,
          email,
          phone,
          panNumber: cleanPan,
          address,
          amountInr: effectiveAmount,
          purpose,
          paymentMethod,
          paymentReference,
          websiteHoneypot: honeypot,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Unable to record donation');
      }
      setReceipt(json.donation);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);
    if (!lookupNo.trim()) return;
    try {
      const res = await fetch(`/api/public/donations/${encodeURIComponent(lookupNo.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Receipt not found');
      }
      setLookupResult(json.donation);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Receipt not found');
    }
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;
    const esc = (val: unknown) =>
      String(val ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${esc(receipt.receiptNumber)}</title>
<style>body{font-family:Arial,sans-serif;max-width:720px;margin:32px auto;padding:24px;color:#1c241e;border:1px solid #d6d3d1;}
h1{color:#14452F;margin:0 0 4px;} .meta{font-size:12px;color:#57534e;margin-bottom:20px;}
table{width:100%;border-collapse:collapse;margin:16px 0;} td{padding:8px 10px;border-bottom:1px solid #e7e5e4;font-size:13px;}
.badge{padding:10px;background:#f3f5f0;border:1px solid #d6d3d1;font-size:12px;margin-top:16px;}</style></head>
<body><h1>SARASWATI EDUCATIONAL TRUST</h1>
<div class="meta">Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025 · Reg. No: 1602001948 · PAN: ABBTS6380F · 12A: ABBTS6380FE20241 · 80G: ABBTS6380FF20241</div>
<h2>${receipt.eligible80g ? 'DONATION ACKNOWLEDGEMENT & 80G ELIGIBILITY RECORD' : 'GENERAL DONATION ACKNOWLEDGEMENT RECEIPT'}</h2>
<table>
<tr><td><strong>Receipt Number</strong></td><td>${esc(receipt.receiptNumber)}</td></tr>
<tr><td><strong>Date</strong></td><td>${esc(new Date(receipt.createdAt).toLocaleDateString('en-IN'))}</td></tr>
<tr><td><strong>Donor Name</strong></td><td>${esc(receipt.donorName)}</td></tr>
<tr><td><strong>Email / Phone</strong></td><td>${esc(receipt.email)} / ${esc(receipt.phone)}</td></tr>
<tr><td><strong>PAN Provided</strong></td><td>${esc(receipt.panNumber || 'Not Provided')}</td></tr>
<tr><td><strong>Address</strong></td><td>${esc(receipt.address || 'Not Provided')}</td></tr>
<tr><td><strong>Amount (INR)</strong></td><td>₹${esc(receipt.amountInr.toLocaleString('en-IN'))}</td></tr>
<tr><td><strong>Purpose</strong></td><td>${esc(receipt.purpose)}</td></tr>
<tr><td><strong>Payment Mode</strong></td><td>${esc(receipt.paymentMethod)}</td></tr>
<tr><td><strong>Transaction Reference</strong></td><td>${esc(receipt.paymentReference || 'Pending Verification')}</td></tr>
<tr><td><strong>Receipt Status</strong></td><td>${esc(receipt.status)}</td></tr>
</table>
<div class="badge">${
      receipt.eligible80g
        ? 'Subject to realization of funds in DCB Bank A/c 24713600000198, this contribution satisfies donor PAN and address requirements for Section 80G (Reg. ABBTS6380FF20241) reporting.'
        : 'Note: This is a general donation acknowledgement. An 80G tax-exemption certificate is NOT issued unless valid Indian PAN, complete address, and verified digital/bank realization details are on record.'
    }</div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.receiptNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-3xl border-b border-stone-200 pb-8 no-print">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Support Grassroots Development in Odisha
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Donate Now
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Your generosity supports rural children&apos;s education, Women Self Help Groups, natural farming, and community health initiatives across Rayagada.
          </p>
        </div>

        {receipt ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-6">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Saraswati_Logo_New_20a426b0.jpeg"
                  alt="Saraswati Educational Trust"
                  className="w-12 h-12 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h2 className="font-display text-xl font-bold text-[#14452F]">
                    Saraswati Educational Trust
                  </h2>
                  <p className="text-xs text-stone-500">
                    Reg. No: 1602001948 · PAN: ABBTS6380F · 80G: ABBTS6380FF20241
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500">Receipt No.</p>
                <p className="font-mono text-sm font-bold text-stone-900">{receipt.receiptNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                {receipt.eligible80g
                  ? 'Donation Recorded — Preliminary 80G Criteria Met (Pending Bank Realization)'
                  : 'General Donation Acknowledgement Recorded (80G Tax Certificate Not Issued)'}
              </span>
            </div>

            <dl className="divide-y divide-stone-200 text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-stone-600">Donor Name</dt>
                <dd className="font-semibold text-stone-900">{receipt.donorName}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-stone-600">Amount</dt>
                <dd className="font-mono font-bold text-[#14452F] tabular-nums">
                  ₹{receipt.amountInr.toLocaleString('en-IN')}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-stone-600">Purpose</dt>
                <dd className="text-stone-900">{receipt.purpose}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-stone-600">Payment Mode / Ref</dt>
                <dd className="font-mono text-stone-900">
                  {receipt.paymentMethod} · {receipt.paymentReference || 'Pending'}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-stone-600">PAN Status</dt>
                <dd className="font-mono text-stone-900">
                  {receipt.panNumber || 'Not Provided (80G Unavailable)'}
                </dd>
              </div>
            </dl>

            <div className="p-4 rounded-lg bg-[#F3F5F0] border border-stone-200 text-xs text-stone-700 leading-relaxed">
              {receipt.eligible80g
                ? 'Your valid PAN, address, and transaction reference are recorded. Upon bank realization verification by Trust accounts, this receipt qualifies for Section 80G(5)(vi) reporting under Registration ABBTS6380FF20241.'
                : 'Legal Notice: Under Income Tax Rules, an 80G tax-deduction receipt cannot be issued unless a valid Indian PAN, complete residential address, and verified traceable payment reference are submitted and realized.'}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 no-print">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="px-5 py-2.5 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-sm font-semibold"
              >
                Download Receipt
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-800 text-sm font-semibold hover:bg-stone-100"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="text-sm font-semibold text-[#14452F] hover:underline ml-auto"
              >
                Make Another Contribution
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Donation Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-7 sm:p-9 space-y-6"
            >
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <h2 className="font-display text-xl font-bold text-stone-900 mb-3">
                  1. Select Contribution Amount (INR)
                </h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const active = !customAmount && amountInr === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmountInr(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 px-3 rounded-lg text-sm font-semibold tabular-nums border transition-colors ${
                          active
                            ? 'bg-[#14452F] text-white border-[#14452F]'
                            : 'bg-[#FBFBF8] text-stone-800 border-stone-200 hover:bg-[#F3F5F0]'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <label htmlFor="don-custom" className="block text-xs font-semibold text-stone-600 mb-1">
                    Or Enter Custom Amount (₹)
                  </label>
                  <input
                    id="don-custom"
                    type="number"
                    min={100}
                    placeholder="Minimum ₹100"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm tabular-nums focus:outline-none focus:border-[#14452F]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="don-purpose" className="block text-xs font-semibold text-stone-700 mb-1.5">
                  2. Purpose of Donation
                </label>
                <select
                  id="don-purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14452F]"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 pt-2 border-t border-stone-200">
                <h2 className="font-display text-xl font-bold text-stone-900">
                  3. Donor Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="don-name" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Full Name / Organization *
                    </label>
                    <input
                      id="don-name"
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="don-email" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="don-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="don-phone" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      id="don-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="don-pan" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      PAN Number (Required for 80G Certificate)
                    </label>
                    <input
                      id="don-pan"
                      type="text"
                      maxLength={10}
                      placeholder="e.g., ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-mono uppercase focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="don-addr" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Residential / Billing Address (Required for 80G Certificate)
                  </label>
                  <input
                    id="don-addr"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full postal address with PIN code"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-stone-200">
                <h2 className="font-display text-xl font-bold text-stone-900">
                  4. Payment Mode &amp; Transaction Reference
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                        paymentMethod === pm
                          ? 'bg-[#14452F] text-white border-[#14452F]'
                          : 'bg-[#FBFBF8] text-stone-700 border-stone-200 hover:bg-[#F3F5F0]'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="don-ref" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    UTR / UPI Reference / Transaction ID
                  </label>
                  <input
                    id="don-ref"
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Enter UTR / Transaction ID after completing NEFT, RTGS, or UPI transfer"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#14452F]"
                  />
                </div>
              </div>

              {/* 80G Live Status Indicator */}
              <div className="p-4 rounded-lg bg-[#F3F5F0] border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
                {meets80gPreview ? (
                  <ShieldCheck className="w-4 h-4 text-[#14452F] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
                <span>
                  {meets80gPreview
                    ? 'Valid PAN, address, and transaction reference detected. Eligible for 80G verification upon bank realization.'
                    : '80G Tax Benefit Notice: Without a valid Indian PAN, complete address, and verified digital/bank payment reference, only a General Acknowledgement Receipt will be issued (no 80G tax certificate).'}
                </span>
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {submitting
                  ? 'Recording Contribution...'
                  : `Submit Contribution & Generate Receipt (₹${effectiveAmount.toLocaleString('en-IN')})`}
              </button>
            </form>

            {/* Right Sidebar: Official DCB Bank Details, 80G Rules & Receipt Lookup */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-5 h-5 text-[#14452F]" />
                  <h2 className="font-display text-lg font-bold text-stone-900">
                    Direct Bank Transfer (NEFT / RTGS / IMPS)
                  </h2>
                </div>
                <dl className="divide-y divide-stone-200 text-xs sm:text-sm">
                  <div className="py-2 flex justify-between gap-2">
                    <dt className="text-stone-600">Account Name</dt>
                    <dd className="font-semibold text-stone-900">SARASWATI EDUCATIONAL TRUST</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-2">
                    <dt className="text-stone-600">Bank</dt>
                    <dd className="font-medium text-stone-900">DCB Bank Limited</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-2">
                    <dt className="text-stone-600">Branch</dt>
                    <dd className="font-medium text-stone-900">Khaliguda (247), Khaliguda – 765001</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-2">
                    <dt className="text-stone-600">Account No.</dt>
                    <dd className="font-mono font-bold text-stone-900 tabular-nums">24713600000198</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-2">
                    <dt className="text-stone-600">IFSC Code</dt>
                    <dd className="font-mono font-bold text-stone-900">DCBL0000247</dd>
                  </div>
                </dl>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-2">
                  <img
                    src="/assets/aistudio/DCB_Cencel_Cheque_b5b0e69f.jpeg"
                    alt="Official DCB Bank Cheque Specimen"
                    className="w-full h-36 object-contain"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  UPI / Cards / Net Banking gateway settlements are subject to payment provider activation. Direct NEFT/RTGS transfers to the verified DCB Bank account above are immediately accepted; please enter your UTR reference on the left to generate your receipt.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
                <h2 className="font-display text-lg font-bold text-stone-900">
                  80G Tax Exemption Conditions
                </h2>
                <ul className="space-y-2 text-xs text-stone-600 leading-relaxed list-disc pl-4">
                  <li>Trust 80G Approval: <span className="font-mono font-semibold text-stone-800">ABBTS6380FF20241</span></li>
                  <li>Trust 12A Approval: <span className="font-mono font-semibold text-stone-800">ABBTS6380FE20241</span></li>
                  <li>Cash donations above ₹2,000 do not qualify for deduction under Section 80G of the Income Tax Act, 1961.</li>
                  <li>Donor PAN and complete residential address are mandatory for Form 10BD / Form 10BE reporting.</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
                <h2 className="font-display text-lg font-bold text-stone-900">
                  Verify Existing Receipt
                </h2>
                <form onSubmit={handleLookup} className="flex gap-2">
                  <input
                    type="text"
                    value={lookupNo}
                    onChange={(e) => setLookupNo(e.target.value)}
                    placeholder="e.g., SET-2026-XXXXXX"
                    className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono uppercase focus:outline-none focus:border-[#14452F]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-[#14452F] text-white text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" /> Verify
                  </button>
                </form>
                {lookupError && <p className="text-xs text-red-700">{lookupError}</p>}
                {lookupResult && (
                  <div className="p-3 rounded-lg bg-[#F3F5F0] text-xs space-y-1">
                    <p className="font-semibold text-stone-900">
                      {lookupResult.receiptNumber} · ₹{lookupResult.amountInr.toLocaleString('en-IN')}
                    </p>
                    <p className="text-stone-600">
                      Donor: {lookupResult.donorName} · Status: {lookupResult.status}
                    </p>
                    <p className="text-stone-600">
                      80G Eligible: {lookupResult.eligible80g ? 'Yes (Subject to Realization)' : 'General Acknowledgement Only'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
