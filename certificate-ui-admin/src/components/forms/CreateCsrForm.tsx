// src/components/CreateCsrForm.tsx
import React, { useState } from 'react';
import { createCsrCertificate, generateCertificate, getAllCertificates } from '../../api/services/certificateApi';

interface CsrFormData {
  friendlyName: string;
  subject: string;
  subjectAlternativeNames: string;
  machineContext: boolean;
  keyLength: number;
}

const initialFormData: CsrFormData = {
    friendlyName: '',
    subject: '',
    subjectAlternativeNames: '',
    machineContext: false,
    keyLength: 2048,
  };

const CreateCsrForm: React.FC = () => {
  const [formData, setFormData] = useState<CsrFormData>({
    friendlyName: '',
    subject: '',
    subjectAlternativeNames: '',
    machineContext: false,
    keyLength: 2048,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleCreateCsr = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        ...formData,
        subjectAlternativeNames: formData.subjectAlternativeNames.split(',').map((san: string) => san.trim()),
      };
      const response = await createCsrCertificate(payload);
      setMessage(`CSR Created Successfully! Certificate: ${response.data.certificate}`);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        ...formData,
        subjectAlternativeNames: formData.subjectAlternativeNames.split(',').map((san: string) => san.trim()),
      };
      const response = await generateCertificate(payload);
      console.log(response);
      if (response.data.certificateContent) {
       
        setMessage(`CSR Created Successfully! Certificate: ${response.data.commonName}`);
       
        setFormData(initialFormData);

        await getAllCertificates();

    } else {
        setMessage('CSR was created but the certificate generation failed.');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.Message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Create CSR Certificate</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="friendlyName">
          Friendly Name (example - Test Certificates)
        </label>
        <input
          id="friendlyName"
          name="friendlyName"
          type="text"
          value={formData.friendlyName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter friendly name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
          Subject (example - CN=Test)
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter subject"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subjectAlternativeNames">
          Subject Alternative Names (comma separated, example CN=Alternate Name, CN=Alternate Name)
        </label>
        <input
          id="subjectAlternativeNames"
          name="subjectAlternativeNames"
          type="text"
          value={formData.subjectAlternativeNames}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g., example.com, www.example.com"
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="machineContext"
            checked={formData.machineContext}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Machine Context</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keyLength">
          Key Length
        </label>
        <select
          id="keyLength"
          name="keyLength"
          value={formData.keyLength}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value={2048}>2048</option>
          <option value={4096}>4096</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleGenerateCertificate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Processing...' : 'Generate Certificate'}
        </button>
      </div>
    </div>
  );
};

export default CreateCsrForm;
