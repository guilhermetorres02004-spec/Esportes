import React, { useEffect } from 'react';
import Carousel from './Carousel.jsx';
import News from './News.jsx';
import TrainingMap from './TrainingMap.jsx';
import PhotoGallery from './PhotoGallery.jsx';
import Footer from './Footer.jsx';
import { Indicators, Videos, Activities, School, VivaEsporte, FinalIndicators } from './Sections.jsx';
import { OfficialPhotosProvider, PhotoSources } from './OfficialPhotos.jsx';
import './home.css';

export default function Home({ base = false } = {}) {
    useEffect(() => {
        window.scrollToCurrentSection?.();
    }, []);
    return <OfficialPhotosProvider>
        <main id="conteudo" tabIndex={-1}>
        {base && <div className="gestao-base-back"><a href="/administrativo">← Voltar para o Administrativo</a></div>}
        <div id="home" className="page active">
            <Carousel />
            <Indicators />
            <div className="home-content max-w-7xl mx-auto px-4 py-20">
                <News /><Videos /><Activities /><School /><VivaEsporte /><TrainingMap /><PhotoSources />
            </div>
            <FinalIndicators />
            <PhotoGallery />
        </div>
        </main>
        <div id="frequencia" className="page min-h-screen py-24 text-center"><h2 className="text-5xl font-black text-blue-900 uppercase italic">Portal do Atleta</h2></div>
        <div id="inscricao" className="page min-h-screen py-24 text-center"><h2 className="text-5xl font-black text-blue-900 uppercase italic leading-none">Inscrição 2026</h2></div>
        <Footer />
    </OfficialPhotosProvider>;
}
