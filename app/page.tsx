'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { symptoms } from '../constant/data';

export default function Home() {
  const [answers, setAnswers] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const skala = [
    { value: 0, label: 'Tidak pernah' },
    { value: 2, label: 'Sangat jarang' },
    { value: 4, label: 'Jarang' },
    { value: 6, label: 'Cukup sering' },
    { value: 8, label: 'Sering' },
    { value: 10, label: 'Selalu' },
  ];

  const handleAnswer = (code: string, value: number) => {
    setAnswers((prev: any) => ({ ...prev, [code]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for unfilled symptoms
    const missingAnswers = symptoms.filter(symptom => answers[symptom.code] === undefined);
    if (missingAnswers.length > 0) {
      setErrors(missingAnswers.map(symptom => symptom.code));
    } else {
      const allSameValue = Object.values(answers).every(val => val === Object.values(answers)[0]);
      if (allSameValue) {
        alert('Semua jawaban memiliki nilai yang sama. Hasil diagnosa tidak valid.');
      } else {
        setLoading(true);
        setErrors([]);
        setTimeout(() => {
          router.push(`/diagnosis?answers=${JSON.stringify(answers)}`);
        }, 5000);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold text-center mb-8">Sistem Pakar Supply Chain</h1>
      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        {symptoms.map((symptom, index) => (
          <div key={symptom.code} className={`mb-4 border ${errors.includes(symptom.code) ? 'border-red-500 bg-red-100' : 'border-black bg-gray-100'} px-3 py-5 rounded-lg`}>
            <h5 className="font-semibold text-lg mb-5">{index + 1}. {symptom.name}</h5>
            <div className="flex px-4 left-4 space-x-4 space-y-2 lg:space-y-0">
              <div className="flex flex-col md:flex-row gap-4">
                {skala.map(percent => (
                  <label key={percent.label} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={symptom.code}
                      value={percent.value}
                      checked={answers[symptom.code] === percent.value}
                      onChange={() => handleAnswer(symptom.code, percent.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-sm">{percent.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
        {errors.length > 0 && (
          <div className="text-red-500 text-center mb-4">
            Harap isi semua form sebelum melanjutkan.
          </div>
        )}
        <button
          type="submit"
          className={`bg-slate-950 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 w-full lg:w-auto mx-auto block ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'
            }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Mendiagnosa...</span>
            </div>
          ) : (
            'Diagnosa'
          )}
        </button>
      </form>
    </div>
  );
}