import { Link, useParams } from 'react-router-dom';

const POLICY_MAP: Record<string, { title: string; sections: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      'Saraswati Educational Trust respects the privacy of all donors, volunteers, partners, students, and website visitors. Personal information collected via donation, volunteer, or contact forms—such as name, email address, phone number, postal address, and PAN (where provided for 80G reporting)—is used solely for statutory compliance, receipt issuance, and programme communication.',
      'We do not sell, rent, or trade donor or stakeholder personal data to third parties. Access to administrative records is restricted through role-based authentication.',
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    sections: [
      'This official website is operated by Saraswati Educational Trust (Registered under the Indian Trust Act, 1882, Reg. No. 1602001948), headquartered at Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India.',
      'By accessing or submitting enquiries on this website, users agree to provide accurate information and refrain from unauthorized automated submissions or misuse of published Trust materials.',
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    sections: [
      'All programme descriptions, reports, and registration disclosures published on www.saraswatiedutrust.online are maintained in good faith for public, institutional, and CSR evaluation.',
      'Location map features on the Contact Us page integrate Google Maps Platform services and are subject to Google Maps End User Additional Terms of Service and Google Privacy Policy.',
    ],
  },
  donation: {
    title: 'Donation Policy',
    sections: [
      'Contributions made to Saraswati Educational Trust support charitable activities aligned with our Trust Deed across education, livelihoods, sustainable agriculture, women empowerment, health, and environmental conservation.',
      'Tax exemption receipts under Section 80G (Registration ABBTS6380FF20241) are issued strictly in accordance with the Income Tax Act, 1961—only upon verified receipt of funds into the Trust bank account along with valid Indian PAN and complete donor postal address.',
    ],
  },
  'child-protection': {
    title: 'Child Protection Policy',
    sections: [
      'Saraswati Educational Trust maintains a zero-tolerance commitment against all forms of child abuse, exploitation, neglect, or discrimination across Bright Kids English Medium School and every community learning initiative.',
      'All staff, teachers, volunteers, and visitors interacting with children must adhere to strict safeguarding standards, informed consent protocols for photography, and immediate escalation procedures.',
    ],
  },
  safeguarding: {
    title: 'Safeguarding Policy',
    sections: [
      'Our Safeguarding Policy protects children, women, Scheduled Tribe and Scheduled Caste community members, persons with disabilities, and programme staff from harassment, coercion, or unsafe conduct.',
      'Concerns or grievances may be reported directly to the Office of the Secretary at secratary@saraswatiedutrust.online or +91 9777110362.',
    ],
  },
};

export function PoliciesPage() {
  const { slug } = useParams();
  const policy = POLICY_MAP[slug || 'privacy'] || POLICY_MAP.privacy;

  return (
    <div className="bg-[#FBFBF8] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-stone-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#14452F]">
            Governance &amp; Policies · Saraswati Educational Trust
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            {policy.title}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-7 sm:p-10 space-y-5">
          {policy.sections.map((sec, idx) => (
            <p key={idx} className="text-base text-stone-700 leading-relaxed">
              {sec}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(POLICY_MAP).map(([key, item]) => (
            <Link
              key={key}
              to={`/policies/${key}`}
              className={`px-3 py-1.5 rounded-lg border ${
                (slug || 'privacy') === key
                  ? 'bg-[#14452F] text-white border-[#14452F]'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-[#F3F5F0]'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
