import ResultPage from '@/components/ResultPage';
import { Suspense } from 'react';

const DiagnosisPage = () => {
    return (
        <div>
            <Suspense fallback={<div className='h-screen flex items-center justify-center'>Loading...</div>}>
                <ResultPage />
            </Suspense>
        </div>
    )
}

export default DiagnosisPage