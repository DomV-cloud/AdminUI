// src/components/CertificateList.tsx
import React, { useEffect, useState } from 'react';
import { getAllCertificates, deleteCertificate } from '../api/services/certificateApi';

interface Certificate {
  id: number;
  certificateContent: string;
  validUntil: string;
  commonName: string;
  isExpired: boolean;
}

const CertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCertificates = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await getAllCertificates();
      console.log(response.data);
      setCertificates(response.data);
    } catch (error: any) {
      setMessage(`Error fetching certificates: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    console.log(id);
    setLoading(true);
    setMessage(null);
    try {
      await deleteCertificate(id);
      setCertificates(prev => prev.filter(cert => cert.id
 !== id));
      setMessage('Certificate deleted successfully.');
    } catch (error: any) {
      setMessage(`Error deleting certificate: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8">
      <h2 className="text-xl font-bold mb-4">All Certificates</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : certificates.length === 0 ? (
        <div>No certificates found.</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Common Name</th>
              <th className="px-4 py-2">Valid Until</th>
              <th className="px-4 py-2">Is Expired</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => (
              <tr key={cert.id
} className="text-center border-t">
                <td className="px-4 py-2">{cert.id
}</td>
                <td className="px-4 py-2">{cert.commonName}</td>
                <td className="px-4 py-2">{new Date(cert.validUntil).toLocaleDateString()}</td>
                <td className="px-4 py-2">{cert.isExpired ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(cert.id
)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={fetchCertificates}
        disabled={loading}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refresh
      </button>
    </div>
  );
};

export default CertificateList;
