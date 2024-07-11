'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { causes } from '../../constant/data';
import { fuzzify } from '@/libs/FuzzyLogic';

type AnswerType = { [key: string]: number };
type ResultType = { [key: string]: number };

const knowledgeBase = {
    A: ["G01", "G03", "G10"],
    B: ["G01", "G02", "G03"],
    C: ["G01", "G03", "G11"],
    D: ["G04", "G10", "G15"],
    E: ["G11", "G14"],
    F: ["G09", "G10", "G11", "G12", "G13", "G14", "G15"],
    G: ["G05", "G08", "G09", "G10"],
    H: ["G06", "G07", "G08", "G09", "G12", "G13"],
    I: ["G01", "G02", "G07"],
    J: ["G05", "G07", "G09", "G15"]
};

export default function Diagnosis() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<ResultType | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const answersParam = searchParams.get('answers');
    useEffect(() => {
        if (answersParam) {
            try {
                const parsedAnswers: AnswerType = JSON.parse(answersParam);
                const diagnosis = performDiagnosis(parsedAnswers);
                console.log(diagnosis);
                setResults(diagnosis);
            } catch (error) {
                console.error("Error parsing answers:", error);
                alert('There was an error processing your answers. Please try again.');
            }
        } else {
            alert('Please answer all questions to get the diagnosis results');
        }
    }, [searchParams]);

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

    if (!results) return <div>Loading...</div>;

    const highestResult = Object.entries(results).reduce((acc, [key, value]) => {
        return value > acc[1] ? [key, value] : acc;
    }, ["", 0] as [string, number]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Diagnosis Results</h1>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline"> Berdasarkan gejala-gejala yang telah diinputkan, hasil dari diagnosis adalah <strong className="font-bold"> {causes.find(c => c.code === highestResult[0])?.name}.</strong></span>
            </div>
            <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
                {showDetails ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
            </button>
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
