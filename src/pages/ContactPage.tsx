import React, { useState } from 'react';
import { CheckCircle2, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { HeadOfficeMap } from '../components/HeadOfficeMap';

export function ContactPage() {
  const { data } = useSite();
  const contact = data?.settings?.contact_info;

  const orgName = contact?.organizationName || 'Saraswati Educational Trust';
  const address =
    contact?.address || 'Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India';
  const phone = contact?.phone || '+91 9777110362';
  const whatsapp = contact?.whatsapp || '919777110362';
  const email = contact?.email || 'secratary@saraswatiedutrust.online';
  const website = contact?.website || 'www.saraswatiedutrust.online';
  const lat = contact?.latitude || 19.1712;
  const lng = contact?.longitude || 83.4165;

  const [fullName, setFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: 'contact',
          fullName,
          email: formEmail,
          phone: formPhone,
          subject: subject || 'General Website Enquiry',
          message,
          websiteHoneypot: honeypot,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Could not send message');
      }
      setSubmitted(true);
      setFullName('');
      setFormEmail('');
      setFormPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-3xl border-b border-stone-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Reach Our Head Office
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            Contact Us
          </h1>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Connect with Saraswati Educational Trust for community programmes, CSR evaluations, donor support, or volunteering in Rayagada, Odisha.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-7 space-y-5">
              <h2 className="font-display text-xl font-bold text-stone-900">{orgName}</h2>
              <div className="space-y-4 text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#14452F] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-stone-900">Head Office</p>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#14452F] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-stone-900">Phone</p>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-[#14452F] hover:underline tabular-nums"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#14452F] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-stone-900">Official Email</p>
                    <a href={`mailto:${email}`} className="text-[#14452F] hover:underline break-all">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#14452F] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-stone-900">Website</p>
                    <p className="text-stone-600">{website}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                    'Hello Saraswati Educational Trust, I would like to enquire about your programmes.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#14452F] hover:bg-[#1E5B3F] text-white text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-7 sm:p-9">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              All messages are stored securely in our Trust administration system for timely follow-up.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Your message has been received.</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Thank you for contacting Saraswati Educational Trust. Our office in Kenduguda, Rayagada will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#14452F] underline pt-1"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-phone" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-subject" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="c-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-msg" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="c-msg"
                    rows={5}
                    required
                    minLength={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#14452F]"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Platform Location Map */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Head Office Location Map (Kenduguda, Rayagada)
          </h2>
          <HeadOfficeMap
            latitude={lat}
            longitude={lng}
            organizationName={orgName}
            address={address}
          />
        </section>
      </div>
    </div>
  );
}
