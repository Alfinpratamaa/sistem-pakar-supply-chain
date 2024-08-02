'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { causes } from '@/constant/data';
import { fuzzify } from '@/lib/FuzzyLogic';
import Loading from '@/app/loading';
import { useSession } from 'next-auth/react';
import { AnswerType, ResultType } from '@/types';
import { knowledgeBase } from '@/constant/knowledgeBase';
import Link from 'next/link';





export default function ResultPage() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<ResultType | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

    const answersParam = searchParams.get('answers');
    const userId = session?.user?.id; // Replace with actual user ID logic

    useEffect(() => {
        if (answersParam) {
            const diagnosisKey = `diagnosis_${userId}`;
            const savedDiagnosis = localStorage.getItem(diagnosisKey);

            if (savedDiagnosis) {
                setResults(JSON.parse(savedDiagnosis));
            } else {
                fetchDiagnosis(answersParam, diagnosisKey);
            }
        } else {
            alert('Please answer all questions to get the diagnosis results');
        }

        // Cleanup function to remove diagnosis data from local storage when leaving the page
        return () => {
            const diagnosisKey = `diagnosis_${userId}`;
            localStorage.removeItem(diagnosisKey);
        };
    }, [searchParams]);

    async function fetchDiagnosis(answersParam: string, diagnosisKey: string) {
        setLoading(true);
        setError(null);
        try {
            const parsedAnswers: AnswerType = JSON.parse(answersParam);
            const diagnosis = performDiagnosis(parsedAnswers);
            setResults(diagnosis);

            const highestProbability = Math.max(...Object.values(diagnosis));
            const highestResults = Object.entries(diagnosis)
                .filter(([, value]) => value === highestProbability)
                .map(([key]) => key);

            const conclusion = highestResults.map(code => causes.find(c => c.code === code)?.name).join(', ');
            // await handleSaveConsultation(conclusion);
            localStorage.setItem(diagnosisKey, JSON.stringify(diagnosis));
        } catch (error) {
            console.error("Error fetching diagnosis:", error);
            setError('There was an error processing your answers. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveConsultation(conclusion: string) {
        setLoading(true);
        setError(null);
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
                throw new Error('Failed to save consultation');
            }

            const data = await response.json();
            console.log('Consultation saved:', data);
        } catch (error) {
            console.error('Error saving consultation:', error);
            setError('Failed to save the consultation');
        } finally {
            setLoading(false);
        }
    }

    function performDiagnosis(answers: AnswerType): ResultType {
        const fuzzySets: { [key: string]: [number, number, number] } = {
            low: [0, 0, 5],
            medium: [0, 5, 10],
            high: [5, 10, 10]
        };

        const fuzzifiedAnswers = Object.entries(answers).reduce((acc: any, [code, value]) => {
            acc[code] = fuzzify(value, fuzzySets);
            return acc;
        }, {});

        const causeProbabilities: { [key: string]: number } = {};
        for (const [cause, relatedSymptoms] of Object.entries(knowledgeBase)) {
            let totalDegree = 0;
            let matchCount = 0;
            for (const symptom of relatedSymptoms) {
                if (fuzzifiedAnswers[symptom]) {
                    totalDegree += Math.max(...(Object.values(fuzzifiedAnswers[symptom]) as number[]));
                    matchCount++;
                }
            }
            if (matchCount > 0) {
                causeProbabilities[cause] = totalDegree / matchCount;
            }
        }

        return Object.entries(causeProbabilities)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v * 100 }), {});
    }

    function getLabel(percent: number): string {
        switch (percent) {
            case 0:
                return 'Tidak pernah';
            case 20:
                return 'Sangat jarang';
            case 40:
                return 'Jarang';
            case 60:
                return 'Cukup sering';
            case 80:
                return 'Sering';
            case 100:
                return 'Selalu';
            default:
                return '';
        }
    }

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;

    if (!results) return <Loading />

    const highestProbability = Math.max(...Object.values(results));
    const highestResults = Object.entries(results)
        .filter(([, value]) => value === highestProbability)
        .map(([key]) => key);

    return (
        <div className="container mx-auto p-4 max-w-3xl h-screen">
            <h1 className="text-2xl font-bold mb-4">Hasil Diagnosa</h1>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">
                    Berdasarkan gejala-gejala yang telah diinputkan, hasil dari diagnosis adalah <strong className="font-bold">{highestResults.map((code, index) => (
                        <span key={code}>
                            {causes.find(c => c.code === code)?.name}
                            {index < highestResults.length - 1 && ', '}
                        </span>
                    ))}.</strong>
                </span>
            </div>
            <div className="flex mx-auto space-x-4">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="bg-slate-950 text-white px-4 py-2 rounded hover:bg-slate-800 transition duration-300"
                >
                    {showDetails ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
                </button>
                <Link href={'/question'} >
                    <button
                    className="bg-slate-950 text-white px-4 py-2 rounded hover:bg-slate-800 transition duration-300"
                    >
                    kembali
                </button>
                </Link>
            </div>
            {showDetails && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Detail Persentase Permasalahan:</h2>
                    {Object.entries(results).map(([causeCode, probability]) => (
                        <div key={causeCode} className="mb-2">
                            <strong>{causes.find(c => c.code === causeCode)?.name}:</strong> {probability.toFixed(2)}%
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
