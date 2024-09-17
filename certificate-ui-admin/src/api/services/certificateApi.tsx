// src/services/api.ts
import axios from 'axios';
import { certificateApi } from '../../configuration/api/apiConfiguration';

const API_BASE_URL = certificateApi.API_BASE_URL; // Replace with your API base URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ApiKey': certificateApi.API_KEY,
  },
});

// API Methods
export const createCsrCertificate = (data: any) => {
  return api.post('/create-csr', data);
};

export const generateCertificate = (data: any) => {
  return api.post('/generate-certificate', data);
};

export const getAllCertificates = () => {
  return api.get('/all');
};

export const deleteCertificate = (id: number) => {
  return api.delete(`/delete/${id}`);
};
