// textOverlay2.js — overlay HTML pur, 100% responsive
// La boîte p5 (openBox2.js) appelle textOverlay2.startFading() à l'ouverture

const textOverlay2 = (() => {
    const style = document.createElement('style');
    style.textContent = `
        #to-mobile {
            position: fixed;
            inset: 0;
            z-index: 10;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 4vw 5vw;
            box-sizing: border-box;
            opacity: 1;
            transition: opacity 0.8s ease;
            font-family: 'OldNewspaperTypes', serif;
            color: #fff;
            overflow: hidden;
        }
        #to-mobile.fading { opacity: 0; }

        .to-logo-wrap {
            position: absolute;
            top: 3vw;
            left: 4vw;
            width: clamp(44px, 16vw, 120px);
        }
        .to-logo { width: 100%; opacity: 0.5; display: block; }

        .to-titles {
            width: 100%;
            text-align: center;
            margin-top: clamp(8px, 7vh, 60px);
            line-height: 1.2;
        }
        .to-titles p { margin: 0.1em 0; }

        .to-big    { font-size: clamp(1.35rem, 7.2vw, 3rem); }
        .to-medium { font-size: clamp(0.95rem, 4.8vw, 2rem); }
        .to-small  { font-size: clamp(0.82rem, 4vw, 1.7rem); }
        .to-tiny   { font-size: clamp(0.7rem, 3.3vw, 1.4rem); }

        .to-desc {
            width: 100%;
            max-width: 580px;
            margin-top: auto;
            padding-bottom: clamp(6px, 2.5vh, 24px);
            text-align: left;
            font-size: clamp(0.7rem, 2.8vw, 1rem);
            line-height: 1.55;
        }
        .to-desc p { margin: 0 0 0.5em; }
        .to-cta { font-style: italic; opacity: 0.72; font-size: 0.88em; }

        @media (orientation: landscape) {
            #to-mobile {
                flex-direction: row;
                align-items: flex-start;
                gap: 4vw;
                padding: 2.5vh 5vw;
            }
            .to-logo-wrap {
                position: static;
                width: clamp(36px, 9vw, 80px);
                flex-shrink: 0;
                margin-top: 0.3vh;
            }
            .to-titles {
                flex: 1;
                text-align: left;
                margin-top: 0;
            }
            .to-big    { font-size: clamp(0.95rem, 4.2vw, 2rem); }
            .to-medium { font-size: clamp(0.75rem, 3vw, 1.5rem); }
            .to-small  { font-size: clamp(0.65rem, 2.6vw, 1.3rem); }
            .to-tiny   { font-size: clamp(0.58rem, 2.1vw, 1rem); }
            .to-desc {
                flex: 1;
                margin-top: 0;
                align-self: center;
                font-size: clamp(0.6rem, 1.8vw, 0.88rem);
                padding-bottom: 0;
            }
        }

        @media (max-width: 359px) {
            .to-big    { font-size: 1.2rem; }
            .to-medium { font-size: 0.88rem; }
            .to-small  { font-size: 0.76rem; }
            .to-tiny   { font-size: 0.66rem; }
            .to-desc   { font-size: 0.62rem; }
        }
    `;

    const overlay = document.createElement('div');
    overlay.id = 'to-mobile';
    overlay.innerHTML = `
        <div class="to-logo-wrap">
            <img src="assets/logo.png" alt="Logo" class="to-logo">
        </div>
        <div class="to-titles">
            <p class="to-small">MÉTHODE NOUVELLE</p>
            <p class="to-tiny">DE LA</p>
            <p class="to-big">GÉOMÉTRIE<br>DESCRIPTIVE</p>
            <p class="to-medium">COLLECTION DE RELIEFS</p>
            <p class="to-tiny">A.&nbsp;JULLIEN</p>
        </div>
        <div class="to-desc">
            <p>Cette boîte contient une collection de reliefs à pièces mobiles,
            récompensée par un diplôme de mérite lors de l'Exposition Universelle
            de Vienne en 1873. Elle renferme 32&nbsp;cartons, 118&nbsp;pièces métalliques
            et une notice explicative destinée aux candidats au Baccalauréat des
            sciences, ainsi qu'aux aspirants aux Écoles Navale et des Beaux-Arts.</p>
            <p class="to-cta">Ouvrez la boîte pour en apprendre davantage</p>
        </div>
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    return {
        startFading() {
            overlay.classList.add('fading');
            overlay.addEventListener('transitionend', () => {
                overlay.style.display = 'none';
            }, { once: true });
        }
    };
})();
