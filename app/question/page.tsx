'use client';;
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { causes, symptoms } from '@/constant/data';
import { AnswerType } from '@/types';
import { performDiagnosis } from '@/lib/performDiagnosis';
import { useSession } from 'next-auth/react';

export default function QuestionPage() {
    const [answers, setAnswers] = useState<any>({});
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { data: session, status } = useSession();

    if (!session) router.push('/login')

    const userId = session?.user?.id;

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

    const parsedAnswers: AnswerType = answers;

    async function addToDb() {
        const diagnosis = performDiagnosis(parsedAnswers);
        const highestProbability = Math.max(...Object.values(diagnosis));
        const highestResults = Object.entries(diagnosis)
            .filter(([, value]) => value === highestProbability)
            .map(([key]) => key);

        const conclusion = highestResults.map(code => causes.find(c => c.code === code)?.name).join(', ');
        console.log(conclusion);

        // Add to database
        try {
            const response = await fetch('/api/save-consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    conclusion,
                }),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Failed to save consultation');
            }

            const data = await response.json();
            console.log('Consultation saved:', data);
            if (response.ok) router.push(`/diagnosis?answers=${JSON.stringify(answers)}`);
        } catch (error) {
            console.error('Error saving consultation:', error);
        } finally {
            setLoading(false);
        }
    }



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
                addToDb()
                setErrors([]);

            }
        }
    };

    return (
        <div className="container max-w-3xl mx-auto p-4 h-screen">
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
                    className={`bg-primary text-white px-6 py-3 rounded-lg shadow-md transition duration-300 w-full lg:w-auto mx-auto block ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'
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