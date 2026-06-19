import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import CSSDHomePage from './pages/home/CSSDHomePage';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<CSSDHomePage />);
