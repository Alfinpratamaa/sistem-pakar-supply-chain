import ResultPage from '@/components/ResultPage';
import { Suspense } from 'react';
import Loading from '../loading';

const DiagnosisPage = () => {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <ResultPage />
            </Suspense>
        </div>
    )
}

export default DiagnosisPage