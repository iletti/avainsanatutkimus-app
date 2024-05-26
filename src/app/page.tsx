'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useForm, ValidationError } from '@formspree/react';
import './styles.css'; // Make sure to import the CSS file

export default function Page() {
  const { messages, setInput, handleSubmit } = useChat();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [services, setServices] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [cookieConsent, setCookieConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [formState, handleFormSubmit] = useForm("mnqeylve");

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!companyName || !email || !services || !cookieConsent) {
      alert('Täytä vaadittavat kohdat ja hyväksy markkinointilupa');
      return;
    }

    const prompt = `Your job is to generate a keyword list based on the company's services or products. Create a professional-looking keyword research report based on the message the user submits. Focus on keywords and at the end give 3 tips how to use keywords. Keep any other text minimal. Keep the text style passive and professional. Default language: Finnish.
    
    My company: ${companyName}
    Services or products for keyword research:
    ${services.split('\n').map((service) => `- ${service}`).join('\n')}
    Specifications: ${guidelines}`;

    setInput(prompt);
    setIsSubmitted(true);

    await handleFormSubmit(e);
  };

  useEffect(() => {
    if (isSubmitted) {
      const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
      handleSubmit(syntheticEvent as unknown as React.FormEvent<HTMLFormElement>);
      setShowResults(true); // Show the results container
    }
  }, [isSubmitted, handleSubmit]);

  return (
    <div className="max-w-xl mx-auto p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Tee ilmainen avainsanatutkimus</h2>
      {!isSubmitted ? (
        <form className="space-y-4" onSubmit={handleCustomSubmit}>
          <div>
            <label className="block font-medium mb-1 dark:text-white" htmlFor="company-name">
              Yrityksen nimi
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              id="company-name"
              placeholder="Yrityksen nimi"
              type="text"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-white" htmlFor="email">
              Sähköposti
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              id="email"
              placeholder="Sähköposti"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={formState.errors}
            />
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-white" htmlFor="services">
              Lista tuotteista tai palveluistasi
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              id="services"
              placeholder="Esim. Autohuolto, kolarikorjaus, lasien tummennukset"
              rows={3}
              name="services"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              required
            />
            <ValidationError 
              prefix="Services" 
              field="services"
              errors={formState.errors}
            />
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-white" htmlFor="guidelines">
              Tarkennukset
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              id="guidelines"
              placeholder="Esim. Toimialue Satakunta"
              rows={3}
              name="guidelines"
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
            />
            <ValidationError 
              prefix="Guidelines" 
              field="guidelines"
              errors={formState.errors}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cookie-consent"
              name="cookieConsent"
              checked={cookieConsent}
              onChange={() => setCookieConsent(!cookieConsent)}
              className="mr-2"
              required
            />
            <label htmlFor="cookie-consent dark:text-white" className="text-sm">
              Hyväksyn, että saan avainsanatutkimuksen tulokset sähköpostiini.
            </label>
            <ValidationError 
              prefix="CookieConsent" 
              field="cookieConsent"
              errors={formState.errors}
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="submit"
            disabled={formState.submitting}
          >
            Tee avainsanatutkimus
          </button>
        </form>
      ) : (
        <div className="text-center text-xl font-semibold mt-4 dark:text-white">Tässä avainsanatutkimus ole hyvä!</div>
      )}
      {showResults && (
        <div className={`results-container mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md transition-all duration-500 ease-out ${showResults ? 'show' : 'hide'}`}>
          <h3 className="text-lg font-bold mb-2 dark:text-white">Avainsanatutkimuksen tulokset</h3>
          <p className='dark:text-white'>Tässä on tekoälyn luoma avainsanatutkimus, joka on laadittu täyttämäsi tietojen perusteella:</p>
          <div className="results-content mt-4 prose dark:prose-invert">
            {messages.filter(m => m.role !== 'user').map((m: { id: string; content: string }) => (
              <div key={m.id} className="whitespace-pre-wrap dark:text-white">
                {m.content}
              </div>
            ))}
          </div>
          <div className="scroll-arrow">⬇️</div> {/* Add arrow indicator */}
        </div>
      )}
    </div>
  );
}
