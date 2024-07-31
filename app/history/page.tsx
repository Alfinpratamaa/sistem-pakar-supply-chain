// app/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import Loading from '../loading';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter()

    const { data: session, status } = useSession();

    if (!session) router.push('/login')

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                try {
                    const res = await fetch('/api/history', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    setConsultations(data.consultations);
                } catch (error) {
                    console.error('Error fetching consultations:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [session]);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container max-w-4xl mx-auto p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead className="w-[200px]">Email</TableHead>
                        <TableHead className="w-[200px]">Tanggal</TableHead>
                        <TableHead>Kesimpulan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consultations?.map((consultation: any, index: number) => (
                        <TableRow key={consultation.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{consultation?.user?.email}</TableCell>
                            <TableCell>{new Date(consultation.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{consultation.conclusion}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
