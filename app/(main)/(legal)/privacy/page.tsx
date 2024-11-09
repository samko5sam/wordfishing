import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        At our company, we take the privacy of our users very seriously. This privacy policy outlines how we collect, use, and protect your personal information.
      </p>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Information We Collect</h2>
      <p className="text-gray-700 mb-4">
        We may collect the following types of information from you:
        <ul className="list-disc pl-6 mb-4">
          <li>Name and contact information</li>
          <li>Usage data, such as pages visited and actions taken on our website</li>
          <li>Device and browser information</li>
          <li>Location data (if you choose to share it)</li>
        </ul>
      </p>
      <h2 className="text-xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
      <p className="text-gray-700 mb-4">
        We use the information we collect to:
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and improve our products and services</li>
          <li>Personalize your experience on our website</li>
          <li>Communicate with you about our products and services</li>
          <li>Comply with legal and regulatory requirements</li>
        </ul>
      </p>
      <h2 className="text-xl font-bold text-gray-900 mb-4">How We Protect Your Information</h2>
      <p className="text-gray-700 mb-4">
        We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. This includes using encryption, access controls, and other security measures.
      </p>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Rights</h2>
      <p className="text-gray-700 mb-4">
        You have the right to access, correct, or delete your personal information. You can also opt-out of certain data collection and usage practices. If you have any questions or concerns, please contact us at apps@sk5s.com.
      </p>
    </div>
  );
}
