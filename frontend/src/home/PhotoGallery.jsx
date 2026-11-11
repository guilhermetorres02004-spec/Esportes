import React from 'react';
import photos from './photos.json';
import { OfficialCredit, OfficialImage } from './OfficialPhotos.jsx';

export default function PhotoGallery() {
    const figures = duplicada => photos.gallery.map((foto, indice) => <figure key={indice}>
        <OfficialImage {...foto.image} />
        <figcaption><OfficialCredit {...foto.link} categoria={foto.image['data-foto-categoria']} tabIndex={duplicada ? -1 : undefined}>{foto.credit}</OfficialCredit></figcaption>
    </figure>);
    return <section className="marquee-container mb-32" aria-label="Fotos do esporte em Betim publicadas em 2026">
        <div className="marquee-content" id="marquee-track">{figures(false)}<div className="marquee-copy" aria-hidden="true">{figures(true)}</div></div>
    </section>;
}
