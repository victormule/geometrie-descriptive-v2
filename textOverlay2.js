// Initialiser le sketch textOverlay et le rendre globalement accessible
let textOverlay2 = new p5(function(sketch) {
    let opacity = 255; // Valeur initiale de l'opacité du texte
    let fading = false; // Indicateur de démarrage de la réduction d'opacité
    let textCanvas;
    let customFont; // Variable pour la police personnalisée
    let logo; // Variable pour l'image du logo
    
    // Espacement pour les sous-titres
    let subtileSpace1, subtileSpace2, subtileSpace3;
    
    // Variables dynamiques pour les tailles de police et l'espacement des lignes
    let titleFontSize, subtitleFontSize, descriptionFontSize, authorFontSize;
    let lineHeight;

    // Précharger uniquement le logo (la police est déclarée dans index.html via @font-face)
    sketch.preload = function() {
        logo = sketch.loadImage('assets/logo.png'); // Charger le logo
    };

    // Configuration initiale du sketch
    sketch.setup = function() {
        textCanvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
        textCanvas.position(0, 0);
        textCanvas.style('z-index', '2'); // Assurer que ce canvas est au-dessus des autres
        textCanvas.style('pointer-events', 'none');
        sketch.textFont('OldNewspaperTypes'); // Police déclarée via @font-face dans index.html

        // Initialiser le layout en fonction de l'orientation initiale
        adjustLayout();
    };

    // Fonction pour déterminer l'orientation
    function isPortrait() {
        return window.innerHeight > window.innerWidth;
    }

    // Fonction pour ajuster le layout en fonction de l'orientation
    function adjustLayout() {
        if (isPortrait()) {
            setPortraitLayout();
        } else {
            setLandscapeLayout();
        }
    }

    // Fonction pour définir le layout en mode portrait
    function setPortraitLayout() {
        // Tailles proportionnelles à la largeur réelle (écran 390px → titres ~28px max)
        let w = sketch.width;
        titleFontSize     = p5.prototype.constrain(w * 0.072, 18, 32);
        subtitleFontSize  = p5.prototype.constrain(w * 0.078, 20, 36);
        descriptionFontSize = p5.prototype.constrain(w * 0.060, 16, 28);
        authorFontSize    = p5.prototype.constrain(w * 0.055, 14, 24);
        lineHeight        = p5.prototype.constrain(w * 0.065, 22, 36);

        // Positions des textes
        sketch.titleY    = sketch.height * 0.08;
        sketch.subtitleY = sketch.height * 0.14;

        // Espacement entre sous-titres proportionnel
        subtileSpace1 = subtitleFontSize * 1.4;
        subtileSpace2 = subtitleFontSize * 2.8;
        subtileSpace3 = subtitleFontSize * 4.2;

        sketch.descriptionY = sketch.height * 0.62;
    }

    // Fonction pour définir le layout en mode paysage
    function setLandscapeLayout() {
        let w = sketch.width;
        titleFontSize     = p5.prototype.constrain(w * 0.040, 16, 28);
        subtitleFontSize  = p5.prototype.constrain(w * 0.044, 18, 30);
        descriptionFontSize = p5.prototype.constrain(w * 0.034, 14, 24);
        authorFontSize    = p5.prototype.constrain(w * 0.030, 12, 22);
        lineHeight        = p5.prototype.constrain(w * 0.030, 16, 24);

        // Positions des textes
        sketch.titleY    = sketch.height * 0.06;
        sketch.subtitleY = sketch.height * 0.12;

        subtileSpace1 = subtitleFontSize * 1.3;
        subtileSpace2 = subtitleFontSize * 2.6;
        subtileSpace3 = subtitleFontSize * 3.9;

        sketch.descriptionY = sketch.height * 0.60;
    }

    // Fonction de rendu
    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, opacity); // Appliquer l'opacité au texte

        // Définir les tailles et positions en fonction de l'orientation
        adjustLayout();

        // Dessiner le texte
        drawTextContent();

        // Réduire l'opacité si le fading est activé
        if (fading && opacity > 0) {
            opacity -= 5; // Diminue progressivement l'opacité
            if (opacity < 0) {
                opacity = 0; // Assurer que l'opacité ne passe pas en dessous de zéro
            }
        }
    };

    // Fonction pour dessiner le contenu textuel
    function drawTextContent() {
        // Logo en haut à gauche (taille proportionnelle)
        let logoW = sketch.constrain(sketch.width * 0.22, 60, 160);
        let logoH = logoW * 0.72;
        let logoOpacity = sketch.constrain(sketch.map(sketch.width, 300, 800, 60, 180), 60, 180);
        sketch.tint(255, logoOpacity);
        sketch.image(logo, 20, 16, logoW, logoH);
        sketch.noTint();

        // Titres centrés
        sketch.textAlign(sketch.CENTER, sketch.TOP);

        sketch.textSize(titleFontSize);
        sketch.text("MÉTHODE NOUVELLE", sketch.width / 2, sketch.titleY);

        sketch.textSize(authorFontSize);
        sketch.text("DE LA", sketch.width / 2, sketch.subtitleY);

        sketch.textSize(subtitleFontSize);
        sketch.text("GÉOMÉTRIE DESCRIPTIVE", sketch.width / 2, sketch.subtitleY + subtileSpace1);

        sketch.textSize(descriptionFontSize);
        sketch.text("COLLECTION DE RELIEFS", sketch.width / 2, sketch.subtitleY + subtileSpace2);

        sketch.textSize(authorFontSize);
        sketch.text("A. JULLIEN", sketch.width / 2, sketch.subtitleY + subtileSpace3);

        // Description : alignement gauche simple, pas de justification
        let pad = sketch.width * 0.06;
        let maxW = sketch.width - pad * 2;
        sketch.textSize(descriptionFontSize * 0.75);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        drawWrappedText(
            "Cette boîte contient une collection de reliefs à pièces mobiles, récompensée par un diplôme de mérite lors de l'Exposition Universelle de Vienne en 1873. Elle renferme 32 cartons, 118 pièces métalliques et une notice explicative.\n\nOuvrez la boîte pour en apprendre davantage.",
            pad,
            sketch.descriptionY,
            maxW
        );
    }

    // Retour à la ligne simple sans justification — évite les espaces énormes sur mobile
    function drawWrappedText(text, x, y, maxWidth) {
        let paragraphs = text.split('\n');
        let curY = y;
        let lh = lineHeight * 0.9;

        paragraphs.forEach(para => {
            if (para.trim() === '') { curY += lh * 0.5; return; }
            let words = para.split(' ');
            let line = '';
            words.forEach(word => {
                let test = line ? line + ' ' + word : word;
                if (sketch.textWidth(test) > maxWidth && line) {
                    sketch.text(line, x, curY);
                    curY += lh;
                    line = word;
                } else {
                    line = test;
                }
            });
            if (line) { sketch.text(line, x, curY); curY += lh; }
            curY += lh * 0.3;
        });
    }
    sketch.windowResized = function() {
        sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        adjustLayout(); // Réajuster le layout après redimensionnement
    };

    // Fonction pour déclencher la réduction d'opacité depuis openBox1.js
    sketch.startFading = function() {
        fading = true;
    };

});
