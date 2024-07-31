import ResultPage from '@/components/ResultPage';
import { Suspense } from 'react';
import Loading from '../loading';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';



const DiagnosisPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session) redirect('/login');    
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <ResultPage />
            </Suspense>
        </div>
    )
}

export default DiagnosisPage