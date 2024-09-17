// src/App.tsx
import React from 'react';
import CreateCsrForm from './components/forms/CreateCsrForm';
import CertificateList from './components/CertificateList';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Certificate Management</h1>
      </header>
      <main>
        <CreateCsrForm />
        <CertificateList />
      </main>
    </div>
  );
};

export default App;
