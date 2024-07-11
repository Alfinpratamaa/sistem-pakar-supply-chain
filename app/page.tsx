'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { symptoms } from '../constant/data';

export default function Home() {
  const [answers, setAnswers] = useState<any>({});
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
    router.push(`/diagnosis?answers=${JSON.stringify(answers)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Supply Chain Diagnosis</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {symptoms.map((symptom, index) => (
          <div key={symptom.code} className="mb-4">
            <p className="font-semibold mb-2">{index + 1}. {symptom.name}</p>
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
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full lg:w-auto mx-auto block">
          Diagnose
        </button>
      </form>
    </div>
  );
}
