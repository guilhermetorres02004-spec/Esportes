import React, { useEffect, useState } from 'react';
import photos from './photos.json';
import { OfficialCredit, OfficialImage } from './OfficialPhotos.jsx';

export default function Carousel() {
    const [indice, setIndice] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setIndice(atual => (atual + 1) % photos.slides.length), 6000);
        return () => clearInterval(timer);
    }, []);
    return <div className="carousel-container" aria-label="Fotos do esporte de Betim">
        <div className="slogan-overlay"><div className="hero-copy">
            <span className="hero-label"><i className="fas fa-map-marker-alt" aria-hidden="true" /> Portal do Esporte · Betim</span>
            <h1>Betim respira esporte</h1>
            <p>Conheça as modalidades, encontre onde treinar e acompanhe as conquistas dos atletas da nossa cidade.</p>
        </div></div>
        {photos.slides.map((slide, i) => {
            const { class: imageClass, fetchpriority, ...image } = slide.image;
            const { class: linkClass, tabindex, ...link } = slide.link;
            return <div key={slide.image.src} className={`slide${indice === i ? ' active' : ''}`} aria-hidden={indice !== i}>
                <OfficialImage {...image} className={imageClass} fetchPriority={fetchpriority} />
                <OfficialCredit {...link} categoria="principal" indice={i} className={linkClass} tabIndex={indice === i ? 0 : -1}>{slide.credit}</OfficialCredit>
            </div>;
        })}
        <div className="dots-container absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-30" id="dots" />
    </div>;
}
