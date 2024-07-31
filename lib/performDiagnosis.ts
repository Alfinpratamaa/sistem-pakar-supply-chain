import { knowledgeBase } from "@/constant/knowledgeBase";
import { fuzzify } from "./FuzzyLogic";
import { AnswerType, ResultType } from "@/types";

export function performDiagnosis(answers: AnswerType): ResultType {
  const fuzzySets: { [key: string]: [number, number, number] } = {
    low: [0, 0, 5],
    medium: [0, 5, 10],
    high: [5, 10, 10],
  };

  const fuzzifiedAnswers = Object.entries(answers).reduce(
    (acc: any, [code, value]) => {
      acc[code] = fuzzify(value, fuzzySets);
      return acc;
    },
    {}
  );

  const causeProbabilities: { [key: string]: number } = {};
  for (const [cause, relatedSymptoms] of Object.entries(knowledgeBase)) {
    let totalDegree = 0;
    let matchCount = 0;
    for (const symptom of relatedSymptoms) {
      if (fuzzifiedAnswers[symptom]) {
        totalDegree += Math.max(
          ...(Object.values(fuzzifiedAnswers[symptom]) as number[])
        );
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
