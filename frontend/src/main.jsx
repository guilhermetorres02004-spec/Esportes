import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from '../Home.jsx';
import { normalizeHomeUrl } from './home/canonical-url.js';
import { normalizeModalidadeUrl } from './modalidades/routes.js';
import ModalidadePage from './modalidades/ModalidadePage.jsx';
import RegionaisPage from './regionais/RegionaisPage.jsx';

normalizeHomeUrl(window.location, window.history);
const modalidade = normalizeModalidadeUrl(window.location, window.history);
const regionais = window.location.pathname.replace(/\/$/, '') === '/esporte-nas-regionais';
createRoot(document.getElementById('root')).render(regionais ? <RegionaisPage /> : modalidade ? <ModalidadePage modalidade={modalidade} /> : <Home />);
