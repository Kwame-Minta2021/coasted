'use client';
import { useEffect, useMemo, useState } from 'react';

type Enrollment = {
  reference: string;
  parentEmail: string;
  parentName: string;
  phone: string;
  childName: string;
  ageBand: string;
  status: 'pending'|'paid'|'active'|'cancelled';
  createdAt?: any;
  paidAt?: any;
  subscriptionId?: string|null;
  nextBillingDate?: any;
};

export default function AdminEnrollmentsPage() {
  const [rows, setRows] = useState<Enrollment[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/enrollments');
        const data = await res.json();
        setRows(data.items || []);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchesQ = q ? (
        r.parentEmail?.toLowerCase().includes(q.toLowerCase()) || 
        r.childName?.toLowerCase().includes(q.toLowerCase()) ||
        r.parentName?.toLowerCase().includes(q.toLowerCase())
      ) : true;
      const matchesS = status === 'all' ? true : r.status === status;
      return matchesQ && matchesS;
    });
  }, [rows, q, status]);

  const resendReceipt = async (reference: string) => {
    try {
      const res = await fetch('/api/admin/resend-receipt', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ reference })
      });
      const data = await res.json();
      alert(data.ok ? 'Receipt request queued' : (data.error || 'Failed'));
    } catch (error) {
      alert('Failed to resend receipt');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date._seconds ? new Date(date._seconds * 1000) : new Date(date);
    return d.toLocaleString();
  };

  const formatDateOnly = (date: any) => {
    if (!date) return '-';
    const d = date._seconds ? new Date(date._seconds * 1000) : new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin · Enrollments</h1>
      
      <div className="flex gap-3 mb-4">
        <input 
          className="border rounded-lg p-2 w-80" 
          placeholder="Search email, child name, or parent name" 
          value={q} 
          onChange={e => setQ(e.target.value)} 
        />
        <select 
          className="border rounded-lg p-2" 
          value={status} 
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p>Loading enrollments...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border text-left">Reference</th>
                <th className="p-2 border text-left">Parent</th>
                <th className="p-2 border text-left">Child</th>
                <th className="p-2 border text-left">Age</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Paid At</th>
                <th className="p-2 border text-left">Next Billing</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.reference} className="hover:bg-gray-50">
                  <td className="p-2 border font-mono text-xs">{r.reference}</td>
                  <td className="p-2 border">
                    <div className="font-medium">{r.parentName}</div>
                    <div className="text-gray-600 text-xs">{r.parentEmail}</div>
                    <div className="text-gray-500 text-xs">{r.phone}</div>
                  </td>
                  <td className="p-2 border font-medium">{r.childName}</td>
                  <td className="p-2 border">{r.ageBand}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      r.status === 'active' ? 'bg-green-100 text-green-700' : 
                      r.status === 'paid' ? 'bg-blue-100 text-blue-700' : 
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2 border text-xs">{formatDate(r.paidAt)}</td>
                  <td className="p-2 border text-xs">{formatDateOnly(r.nextBillingDate)}</td>
                  <td className="p-2 border">
                    <button 
                      className="px-3 py-1 border rounded text-xs hover:bg-gray-50" 
                      onClick={() => resendReceipt(r.reference)}
                    >
                      Resend Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    {q || status !== 'all' ? 'No matching records' : 'No enrollments yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {filtered.length} of {rows.length} enrollments
      </div>
    </div>
  );
}
