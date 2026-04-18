// sketch2.js

const sketch2 = (p) => {
    let myFont; // Variable pour stocker la police
    let rectangles = []; // Tableau pour stocker les objets rectangles
    let rows = 3; // Nombre de lignes
    let cols = 10; // Nombre de colonnes
    let baseSize = 80; // Taille de base des rectangles (modifiable)
    let hoverSize = 90; // Taille des rectangles au survol
    let spacing = 24; // Espacement entre les rectangles (modifiable)
    const shiftAmount = 5; // Décalage vertical lors du survol
    const shiftOffsetX = 5; // Décalage horizontal pour maintenir l'espacement

    // Variables pour l'animation de fade-in
    let bgOpacity = 0; // Opacité initiale du fond noir (modifié à 0 pour fade-in)
    let rectOpacity = 0; // Opacité initiale des rectangles blancs et des nombres (modifié à 0 pour fade-in)
    const fadeSpeed = 0.05; // Vitesse de l'interpolation

    // Variables pour les images de relief
    let reliefImages = [];          // Tableau pour stocker les images de relief
    let imageOpacities = [];        // Tableau pour stocker l'opacité actuelle des images
    let imageTargetOpacities = [];  // Tableau pour stocker l'opacité cible des images

    // Tableau de textes pour chaque rectangle
    let texts = []; // Array de 30 textes

    // Variables pour la gestion du texte dynamique
    let currentText = null;           // Texte actuellement affiché (objet avec title et descriptions)
    let textOpacity = 0;              // Opacité actuelle du texte
    let textTargetOpacity = 0;        // Opacité cible du texte

    // Variable pour stocker l'image actuellement affichée
    let currentImageIndex = -1;       // -1 signifie aucune image affichée

    // Variables pour gérer les opacités cibles
    let bgTargetOpacity = 200;        // Opacité cible du fond noir
    let rectTargetOpacity = 200;      // Opacité cible des rectangles blancs

    // Variables pour les tailles de police, l'espacement des lignes et l'écart titre-descriptions
    let titleSize = 24;               // Taille initiale du titre
    let descriptionSize = 18;         // Taille initiale des descriptions
    let description2Size = 12;        // Taille initiale des descriptions2
    let description3Size = 14;        // Taille initiale des descriptions3
    let description4Size = 14;        // Taille initiale des descriptions4
    let lineSpacing = 24;             // Espacement initial entre les lignes
    let lineSpacing2 = 20;            // Espacement initial entre les lignes pour descriptions2
    let lineSpacing3 = 18;            // Espacement initial entre les lignes pour descriptions3
    let lineSpacing4 = 18;            // Espacement initial entre les lignes pour descriptions4
    let titleToDescriptionSpacing = 40; // Ecart initial entre le titre et les descriptions
    let descriptionYShift = 0;       // Ajustement dynamique pour description2Y
    let description2YShift = 0;       // Ajustement dynamique pour description2Y
    let description3YShift = 0;       // Ajustement dynamique pour description3Y
    let description4YShift = 0;       // Ajustement dynamique pour description4Y
    let lineWidth2; // Pour descriptions2
    let lineWidth3; // Pour descriptions3
    let lineWidth4; // Pour descriptions4
    let paragrapheSpacing2; // Pour descriptions2
    let paragrapheSpacing3; // Pour descriptions3
    let paragrapheSpacing4; // Pour descriptions4
    let descriptionX; // Position X pour descriptions2
    let descriptionY; // Position Y pour descriptions2
    let description2X; // Position X pour descriptions2
    let description2Y; // Position Y pour descriptions2
    let margin;        // Marge utilisée pour les descriptions2

    // Déclarer targetShiftY globalement
    let targetShiftY = 70; // Valeur par défaut

    // Support tactile : index du carton sélectionné par tap (-1 = aucun)
    let touchedRect = null;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // Fonction pour déterminer l'orientation
    function isPortrait() {
        return p.windowHeight > p.windowWidth;
    }

    function setGridBasedOnOrientation() {
        if (isPortrait()) {
            rows = 3;
            cols = 10;
        } else {
            rows = 2;
            cols = 15;
        }
    }

    function setTargetShiftYBasedOnOrientation() {
        if (isPortrait()) {
            targetShiftY = 280; // Déplace les rectangles plus vers le bas en mode portrait
        } else {
            targetShiftY = 70; // Valeur par défaut pour le mode paysage
        }
    }
    
    // Fonction pour calculer baseSize, spacing, les tailles de police, l'espacement des lignes et l'écart titre-descriptions en fonction de la largeur de la fenêtre
   function calculateSizes() {
    const initialWidth = 1600; // Largeur de référence pour baseSize et spacing
    let scaleFactor = p.width / initialWidth;
    // Ajuster baseSize et spacing proportionnellement à la largeur actuelle, en respectant les minima

    setGridBasedOnOrientation();
    
    // Ajout d'ajustements basés sur l'orientation
    if (isPortrait()) {
        // Sur mobile portrait (~390px), scaleFactor ≈ 0.24 → on base tout sur p.width directement
        let w = p.width;

        baseSize  = p.constrain(w * 0.11, 44, 80);
        spacing   = p.constrain(w * 0.025, 8, 20);
        hoverSize = baseSize * 1.15;

        // Polices proportionnelles à la largeur écran
        titleSize        = p.constrain(w * 0.055, 16, 28);
        descriptionSize  = p.constrain(w * 0.042, 13, 22);
        description2Size = p.constrain(w * 0.030, 10, 16);
        description3Size = p.constrain(w * 0.028, 9, 14);
        description4Size = p.constrain(w * 0.028, 9, 14);

        lineSpacing  = p.constrain(w * 0.048, 18, 32);
        lineSpacing2 = p.constrain(w * 0.040, 16, 28);
        lineSpacing3 = p.constrain(w * 0.032, 13, 20);
        lineSpacing4 = p.constrain(w * 0.032, 13, 20);

        titleToDescriptionSpacing = p.constrain(w * 0.08, 24, 50);

        descriptionYShift  = 0;
        description2YShift = titleSize * 2.5;
        description3YShift = titleSize * 2.5;
        description4YShift = titleSize * 2.5;

        // Texte sur toute la largeur avec marges
        lineWidth  = w * 0.90;
        lineWidth2 = w * 0.90;
        lineWidth3 = w * 0.42;
        lineWidth4 = w * 0.42;

        // Position X : centré sur l'écran (le canvas est translaté au centre dans draw)
        descriptionX  = -w / 2 + w * 0.05;
        description2X = -w / 2 + w * 0.05;

        // paragrapheSpacing sert au positionnement X de desc3/4 — on les met côte à côte
        paragrapheSpacing  = w * 0.95;
        paragrapheSpacing2 = w * 0.95;
        paragrapheSpacing3 = w * 0.52;  // col gauche
        paragrapheSpacing4 = w * 0.05;  // col droite

        margin = paragrapheSpacing2;
        
    } else {
        baseSize = p.max(40, 50 * scaleFactor);
        spacing = p.max(14, 20 * scaleFactor);
        hoverSize = 60;

        titleSize = p.max(18, 28 * scaleFactor); // Plus grand en paysage
        descriptionSize = p.max(16, 20 * scaleFactor); // Plus grand en paysage
        description2Size = p.max(12, 16 * scaleFactor); // Plus grand en paysage
        description3Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage
        description4Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage

        // Ajuster l'espacement entre les lignes proportionnellement, avec un minimum de 15px
        lineSpacing = p.max(16, 20 * scaleFactor);
        lineSpacing2 = p.max(14, 20 * scaleFactor);
        lineSpacing3 = p.max(12, 18 * scaleFactor);
        lineSpacing4 = p.max(12, 18 * scaleFactor);

        // Ajuster l'écart entre le titre et les descriptions, avec un minimum de 20px
        titleToDescriptionSpacing = p.max(20, 40 * scaleFactor);

        // Ajuster l'écart pour description2Y, description3Y, et description4Y
        descriptionYShift = p.map(scaleFactor, 0, 1, 40, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
        description2YShift = p.map(scaleFactor, 0, 1, 40, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
        description3YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
        description4YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100

        // Calculer les largeurs de ligne
        lineWidth = p.max(320, 440 * scaleFactor);
        lineWidth2 = p.max(320, 440 * scaleFactor);
        lineWidth3 = p.max(160, 230 * scaleFactor);
        lineWidth4 = p.max(160, 230 * scaleFactor);

        // Calculer les espacements des paragraphes
        paragrapheSpacing = p.max(360, 500 * scaleFactor);
        paragrapheSpacing2 = p.max(360, 500 * scaleFactor);
        paragrapheSpacing3 = p.max(360, 550 * scaleFactor);
        paragrapheSpacing4 = p.max(180, 280 * scaleFactor);

        // Définir la marge pour descriptions2
        margin = paragrapheSpacing2;

        // Calculer description2X et description2Y
        descriptionX =  - 160;
        description2X = p.width / 2 - margin - 40;
    }
}

    // Fonction pour initialiser ou réinitialiser les rectangles
    function initializeRectangles() {
        rectangles = []; // Réinitialiser le tableau des rectangles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let number = row * cols + col + 1; // Numérotation de 1 à (rows * cols)
                rectangles.push(new Rectangle(row, col, number));
            }
        }
    }

    // Constantes en dehors de la fonction pour éviter de recréer l'objet à chaque appel
    const specialWords = {
        "a,a'": [255, 150, 150], // Rouge
        "a'": [255, 150, 150],   // Rouge
        "a": [255, 150, 150],    // Rouge
        "c": [150, 255, 150],    // Vert
        "c'": [150, 255, 150],   // Vert
        "c,c'": [150, 255, 150], // Vert
        "cd,c'd'": [150, 255, 150], // Vert
        "APA'": [150, 255, 150], // Vert
        "mm'": [150, 150, 255], // Bleu
        "C1": [0, 0, 255], // Bleu
        "C1d": [255, 165, 0], // Orange
        "bc,b'c'": [255, 150, 150],
    };

    function drawColoredText(p, line, x, y, lineWidth) {
        let words = line.split(" ");
        let currentLine = [];
        let lineWidthAccumulated = 0;
        let lineY = y;

        words.forEach((word) => {
            let wordWidth = p.textWidth(word + " ");
            if (lineWidthAccumulated + wordWidth > lineWidth && currentLine.length > 0) {
                justifyAndDrawLine(p, currentLine, x, lineY, lineWidth);
                currentLine = [];
                lineWidthAccumulated = 0;
                lineY += lineSpacing2;
            }
            currentLine.push(word);
            lineWidthAccumulated += wordWidth;
        });

        if (currentLine.length > 0) {
            justifyAndDrawLine(p, currentLine, x, lineY, lineWidth);
        }
    }

    function justifyAndDrawLine(p, lineWords, x, y, lineWidth) {
        let totalWordsWidth = lineWords.reduce((sum, word) => sum + p.textWidth(word), 0);
        let extraSpace = lineWidth - totalWordsWidth;
        let spaceWidth = lineWords.length > 1 ? extraSpace / (lineWords.length - 1) : 0;
        let currentX = x;

        lineWords.forEach((word) => {
            let color = specialWords[word] || [255, 255, 255]; // Blanc par défaut
            p.fill(...color);
            p.text(word, currentX, y);
            currentX += p.textWidth(word) + spaceWidth;
        });
    }

    // Classe représentant un rectangle
    class Rectangle {
        constructor(row, col, number) {
            this.row = row;
            this.col = col;
            this.number = number;

            this.currentSize = baseSize;
            this.targetSize = baseSize;

            this.currentShiftX = 0;
            this.targetShiftX = 0;

            // Position de départ initiale pour l'animation de descente
            this.currentShiftY = 120;
            this.targetShiftY = targetShiftY; // Utilise la valeur définie selon l'orientation
        }

        // Méthode pour dessiner le rectangle avec une opacité dynamique
        draw(x, y, opacity) {
            p.stroke(0, 0, 0, opacity); // Bordure noire avec opacité
            p.fill(255, 255, 255, opacity); // Blanc semi-transparent avec opacité dynamique
            p.rect(x + this.currentShiftX, y + this.currentShiftY, this.currentSize, this.currentSize);

            // Dessiner le numéro au centre du rectangle avec opacité dynamique
            p.noStroke();
            p.fill(0, opacity + 30); // Texte noir avec opacité dynamique
            p.textFont(myFont);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(this.currentSize / 3); // Taille du texte proportionnelle à la taille du rectangle
            p.text(this.number, x + this.currentShiftX, y + this.currentShiftY);
        }

        // Méthode pour mettre à jour les propriétés pour des transitions fluides
        update() {
            // Interpoler la taille actuelle vers la taille cible
            this.currentSize = p.lerp(this.currentSize, this.targetSize, 0.1);
            // Interpoler le décalage actuel vers le décalage cible
            this.currentShiftX = p.lerp(this.currentShiftX, this.targetShiftX, 0.1);
            this.currentShiftY = p.lerp(this.currentShiftY, this.targetShiftY, 0.1);
        }
    }

    // Lazy loading : charge une image à la demande + précharge les voisines
    function ensureImageLoaded(index) {
        if (reliefImages[index] === null) {
            reliefImages[index] = p.loadImage(
                `assets/relief/relief(${index + 1}).JPG`,
                () => {},
                () => { console.error(`Erreur chargement relief(${index + 1}).JPG`); }
            );
        }
        const neighbors = [index - 1, index + 1];
        neighbors.forEach(n => {
            if (n >= 0 && n < 30 && reliefImages[n] === null) {
                reliefImages[n] = p.loadImage(`assets/relief/relief(${n + 1}).JPG`, () => {}, () => {});
            }
        });
    }

    // Fonction preload : charge uniquement la police (images chargées à la demande)
    p.preload = function() {
        myFont = p.loadFont('fonts/OldNewspaperTypes.ttf');

        // Initialiser les tableaux avec placeholders null
        for (let i = 0; i < 30; i++) {
            reliefImages.push(null);
            imageOpacities.push(0);
            imageTargetOpacities.push(0);
        }
        
        // Initialiser les textes (Lorem Ipsum)
        for (let i = 1; i <= 30; i++) {

            if (i === 1) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Description du point.`  // ligne 1
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Fig(1): a,a' point situé dans l'angle antérieur supérieur,`,
                        `figuré par le coude d'une pièce de cuivre.         `,
                        `Fig(2): a,a' point situé sur le mur,  au dessus du sol, et`,
                        `se confondant avec sa projection horizontale a         `,
                        `Fig(3): a,a' point situé sur le sol,  en avant  du mur, et`,
                        `se confondant avec sa projection horizontale a         `,
                        `Fig(4): a,a' point situé sur la ligne de  terre  et se con-`,
                        `fondant avec chacune de ses projections.           `,
                        `Fig(5): a,a' point situé dans l'angle  antérieur inférieur`,
                        `figuré par le coude d'une pièce de cuivre.         `,
                        `Fig(6): a,a' point situé  sur le mur,  au dessous  du sol.`,
                        `Le point vient en a'après le rabattement du plan verti-`,
                        `cal sur le plan horizontal. Dans l'espace,  il n'est autre `,
                        `que le trou 5.                                       `,
                        `Fig(7): a,a' point situé dans l'angle postérieur supérieur`,
                        `figuré par le coude d'une pièce de cuivre.             `,
                        `Fig(8): a,a' point sur  le sol derrière  le mur.  Ce point`,
                        `n'est  autre que le trou 2  avec lequel a coïncide après`,
                        `le rabattement du plan vertical.                       `,
                        `Fig(9): a,a' point situé dans l'angle postérieur inférieur,`,
                        `figuré par le coude d'une pièce de cuivre.             `,
                        `Les projections sont les trous 1 et 4 avec lesquels a et `,
                        `a' se confondent après le rabattement du plan vertical.`,
                    ]
                });
            }
            if (i === 2) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite. Tracés d'une droite.`,  // ligne 1
                        `Angle que fait une droite avec les plans de projection.`,  // ligne 2
                        `Distance de deux points.`  // ligne 3
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Représentation de la droite cd,c'd' droite représentée`,
                        `par ses deux projections,figurée par un fil noir`,
                        `Traces d'une droite d trace horizontale de la droite,`,
                        `c' trace verticale.                                `,
                        `Angles que fait une droite avec les plans de projection.`,
                        `C1 rabattement du point c' sur le sol.             `,
                        `C1d rabattement de la droite sur le même plan.`,
                        `cdC1 angle que fait le droite avec le plan horizontal.`,
                        `Autre Méthode d1 rabattement du point d sur le mur, par`,
                        `une rotation autour de cc'.                       `,
                        `c'd1 rabattement de la droite sur le même plan.`,
                        `c'd1c angle de la droite avec le plan horizontal.`,
                        `Distance de deux points: a,a' point donné, figuré par le`,
                        `coude d'une pièce de cuivre.                       `,
                        `b,b' autre point donné, également figuré par le coude`,
                        `d'une pièce de cuivre.                             `,
                        `cd,c'd' droite passant par les deux points.        `,
                        `A1 rabattement du point a,a' sur le sol par rotation`,
                        `autour de cd.                                      `,
                        `B1 rabattement du point bb' sur le même plan.`,
                        `A1B1 distance des deux points.                     `,
                        `Autre méthode. a'1 rabattement du point a,a' sur le mur,`,
                        `par une rotation autour de cc'.                    `,
                        `b1' rabattement du point b,b' sur le même plan.`,
                        `a'1b'1 distance des deux points.                  `,
                    ]
                });
            } 
            if (i === 3) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite (cas particulier).`  // ligne 1
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Représentation de la droite: ab,a'b' droite passant`,
                        `par le point b de la ligne de terre, figurée par la`,
                        `branche libre d'un fil de fer.                 `,
                        `se confondant avec sa projection horizontale a`,
                        `Angles d'une droite avec les plans de projection:`,
                        `m,m' point pris sur la droite, figuré par le coude de`,
                        `la pièce de cuivre.                            `,
                        `M1 rabattement de ce point sur le plan horizontal.`,
                        `bM1 rabattement de la droite sur ce plan.`,
                        `mbM1 angle de la droite avec le même plan.`,
                        `M2 rabattement du point m,m' sur le plan vertical.`,
                        `bM2 rabattement de la droite sur ce plan.`,
                        `m'bM2 angle de la droite avec le même plan.`,
                    ]
                });
            } 
            if (i === 4) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite (cas particulier).`  // ligne 1
                    ],
                    descriptions3: [
                        `LEGENDE`,
                        `Fig(1): Droite perçant le mur au`, 
                        `dessus du sol et  le sol derrière`,
                        `le mur, figurée par une aiguille`,
                        `droite.`,
                        `a b,a'b' projections de la droite`,
                        `b' trace verticale de la droite,`,
                        `c trace horizontale ou plutôt la`,
                        `trace horizontale est le point 3`,
                        `avec laquel c coïncide, lorsqu'on`,
                        `rabat le plan vertical sur le plan`,
                        `horizontal.`,
                        `Fig(2): Droite située dans un plan`,
                        `de profil perçant le mur au dessus`,
                        `du sol, et le sol en avant du mur,`,
                        `figurée par une aiguille droite.`,
                        `m,m' et n,n' points donnés dans un`,
                        `plan de profil en déterminant la`,
                        `droite.`,
                        `M1 rabattement du point m,m' par`,
                        `une rotation autour de la trace`,
                        `horizontale du plan de profil`,
                        `(mM1 = a'u = a'm').            `,
                        `N1 rabattement du point n,n' par`,
                        `une rotation autour de la trace`,
                        `horizontale du plan de profil`,
                        `(nN1 = a'v = a'n').            `,
                        `M,N, rabattement de la droite`,
                        `passant par les deux points.`,
                        `a trace horizontale de la droite.`,
                        `B1 rabattement de latrace verticale`,
                        `de la droite.                   `,
                        `b trace verticale relevée.      `,
                        `a'aB1 angle de la droite et du plan`,
                        `horizontal.                     `,
                        `aB1a' angle de la droite et du plan`,
                        `vertical.                       `,

                    ],
                    descriptions4: [
                        `aa',a'b' projections de la droite`,
                        `(partie visible).                `,
                        `Fig(3): Droite située dans un plan`,
                        `de profil, perçant le mur au dessous`,
                        `du sol et le sol en avant du mur,`,
                        `figurée par une aiguille droite.`,
                        `a trace horizontale de la droite.`,
                        `c' trace verticale de la droite ou`,
                        `plutôt cette trace est le point 2 qui`,
                        `vient s'appliquer en C', lorsqu'on`,
                        `rabat le plan vertical sur le plan`,
                        `horizontal.                      `,
                        `Les deux traces a et c' determinent`,
                        `la droite.                       `,
                        `C'1 rabattement de la trace verticale`,
                        `de la droite.                     `,
                        `a'aC'1 angle de la droite et du plan`,
                        `horizontal.                       `,
                        `aC'1a' angle de la droite et du plan`,
                        `vertical.                        `,
                        `ab,a'b' projections de la droite`,
                        `(partie visible).                `,
                        `Fig(4): Droite perçant le sol en avant`,
                        `du mur et le mur au dessous du sol,`,
                        `figurée par une aiguille droite.`,
                        `ab,a'b' projections de la droite.`,
                        `a trace horizontale de la droite.`,
                        `c' trace verticale, ou plutôt la trace`,
                        `verticale est le point 1 qui vient`,
                        `coïncider avec c' lorsqu'on rabat le`,
                        `plan vertical sur le plan horizontal.`,
                    ]
                });
            } 
            if (i === 5) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation du plan. Droite située dans un plan.`  // ligne 1
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Fig(1): APA'   plan donné.               `,
                        `PA trace horizontale du plan.                 `,
                        `cd,c'd' droite située dans le plan, figurée par`,
                        `un fil noir.                                   `,
                        `Fig(2) BQB', plan dont les traces sont en ligne`,
                        `droite lorsque le plan vertical est rabattu.   `,
                    ],
                });
            } 
            if (i === 6) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Droites parallèles. Par un point faire passer un`,
                        `plan parallèle à un plan donné.`, 
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Théorie: cd,c'd' et ef,e'f' droites parallèles.`,
                        `Problème: APA'   plan donné.              `,
                        `mm' poins donné, figuré par le coude de la`,
                        `pièce de cuivre.                            `,
                        `cd,c'd' droite prise arbitrairement dans le plan`,
                        `donné, figurée par un fil rouge              `,
                        `ef,e'f' droite parallèle à la précédente et passant`,
                        `par le point donné figurée par un fil rouge.`,
                        `BQB' plan parallèle au plan donné.         `,
                    ],
                });
            } 
            if (i === 7) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Droites perpendiculaire à un plan`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA'   plan donné.                       `,
                        `mm' point donné, figuré par le coude de la pièce`,
                        `de cuivre.                                 `,
                        `bc,b'c' droite passant par le point et perpendiculaire`,
                        `au plan donné figurée par le branche libre du`,
                        `fil de fer.                                 `,
                    ],
                });
            } 
            if (i === 8) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Horizontale d'un plan. Par un point`,
                        `mener un plan parallèle à un plan donné.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Théorie: dc,d'c' horizontal du plan BQB' figurée`,
                        `par la branche libre du fil de fer.        `,
                        `Problème APA' plan donné.                  `,
                        `m,m' point donné, figuré par le coude de la pièce`,
                        `dc,d'c' horizontale du plan cherché, passant par`,
                        `le point donné.                            `,
                        `BQB' plan parallèle au plan donné.         `,
                    ],
                });
            } 
            if (i === 9) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Ligne de plus grands pente.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA' plan donné                        `,
                        `m, m' point quelconque pris dans le plan, figuré`,
                        `par le coude de la pièce de cuivre.              `,
                        `Le fil noir est la ligne de plus grande pente. On`,
                        `veux démontrer qu'elle est perpendiculaire à PA.`,
                        `Le fil rouge ayant sa trace en d est une droite`, 
                        `quelconque prise dans le plan et passant par le`,
                        `point m, m.'                              `,
                        `Le fil rouge ayant se trace en d, et la même droite`,
                        `après sa rotation autour de la branche libre du fil`,
                        `de cuivre.                                  `,
                        `On voit que la portion des fils rouges comprise entre`,
                        `le point M de l'espace et le plan horizontal en plus`,
                        `grande que la portion correspondante du fil noir,`,
                        `ce qui démontre le théorème.               `,
                    ],
                    
                });
            } 
            if (i === 10) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rotation d'un point autour d'un axe perpendiculaire`,
                        `au plan vertical de projection autour d'un axe vertical.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Fig(1): Rotation d'un point situé dans un plan de profil,`,
                        `autour de la trace horizontale de celui-ci.`,
                        `m, m' point donné dans le plan de profil, la trace`,
                        `horizontale de ce plan se confond avec a b.`,
                        `m2 point rabattu sur le plan horizontal`,
                        `(mm2 = am2' = am').                          `,
                        `Rotation d'un point situé dans un plan de profil, autour`, 
                        `d'une horizontale de ce plan.                   `,
                        `a' trace verticale de l'horizontale donnée figurée par`,
                        `le fil de fer.                              `,
                        `ab projection horizontale de la même droite.`,
                        `m,m' point donné, figuré par le coude de la pièce`,
                        `de cuivre                                  `,
                        `m1,m1' projection nouvelles du point, après une`,
                        `rotation de 90°.                               `,
                        `Fig(2): Rotation d'un point autour d'un axe vertical.`,
                        `a trace horizontale de l'axe; lequel est figuré par`,
                        `le fil de fer.                                 `,
                        `a'b' projections nouvelles du point quand il a tourné`,
                        `de l'angle m a m1.                             `,
                        `m2, m2' projection nouvelles du point quand il s'est`,
                        `placé dans un plan parallèle au plan vertical et`,
                        `passant par l'axe donné.                       `,
                    ],
                    
                });
            } 
            if (i === 11) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rotation d'un point autour d'un axe situé`,
                        `dans le plan horizontal de projection.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `ab axe donné, situé dans leplan horizontal.`,
                        `m, m' point donné, figuré par le coude de la`,
                        `pièce de cuivre.                           `,
                        `M1 rabattement du point sur le plan horizontal par`,
                        `une rotation autour de mn perpendiculaire à`,
                        `ab (mM1 = ms = uv = um').                       `,
                        `M2 rabattement du point sur le plan horizontal,`, 
                        `par une rotation autour de ab (nM2 = nM1).`,
                    ],
                    
                });
            } 
            if (i === 12) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rabattement d'un plan vertical.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA'  plan donné perpendiculaire au plan horizontal.`,
                        `cP,c'd' projections d'une droite située dans le plan,`,
                        `figurée par un fil noir.                       `,
                        `cP,e'f' projections d'une horizontale du plan, figurée`,
                        `par le fil de fer.                             `,
                        `m,m' point situé dans le plan, figuré par le coude.`,
                        `du fil de cuivre.                              `, 
                        `PA1' rabattement de la trace verticale PA' du plan,`,
                        `par une rotation autour de PA.             `,
                        `M1 rabattement du point m,m' (mM1 = Ps = Pv = um')`,
                        `cD1 rabattement de la droite dont les projections`,
                        `sont cP,c'd'.                                  `,
                        `E1F1 rabattement de l'horizontale du plan.     `,
                    ],
                    
                });
            } 
            if (i === 13) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rabattement d'un plan quelconque.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA' plan donné.                           `,
                        `m,m' point du plan, figuré par le coude du`,
                        `fil de cuivre.                            `,
                        `bc,b'c' horizontale du plan, figurée par le de fer.`,
                        `gd,g'd' droit située dans le plan, figurée par`,
                        `le fil noir.                               `,
                        `E1 rabattement du point e' par une rotation autour`, 
                        `de ef perpendiculaire à PA (eE1 = ce'),`,
                        `E2 rabattement du point e' par une rotation autour de`,
                        `PA (fE2 = fE1).                            `,
                        `PA1 rabattement de la trace verticale PA' du plan.`,
                        `B1C1 rabattement de l'horizontale du plan.`,
                        `M1 rabattement du point m,m' par une rotation autour de`,
                        `m n perpendiculaire à PA (mM1 = mr =uv = um').`,
                        `M2 rabattement du point m,m' par une rotation autour`,
                        `de PA (nM2 = nM1).                            `,
                        `G1d rabattement de la droite gd,g'd'.`,
                    ],
                    
                });
            } 
        }
    }

     // Fonction setup pour initialiser le canvas et les rectangles
        p.setup = function() {
        // Créer un canvas en 2D qui couvre toute la fenêtre
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER); // Mode de dessin des rectangles centrés
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();
        p.smooth(0); // Désactiver l'anti-aliasing pour améliorer la performance
        // 30fps sur écrans tactiles (économie batterie), 60fps sinon
        p.frameRate(isTouchDevice ? 30 : 60);

        // Calculer les tailles initiales en fonction de la largeur de la fenêtre
        calculateSizes();
        setTargetShiftYBasedOnOrientation(); // Ajuste le décalage vertical basé sur l'orientation

        // Positionner le canvas au-dessus du premier canvas
        p.canvas.style.position = 'absolute';
        p.canvas.style.top = '0';
        p.canvas.style.left = '0';
        p.canvas.style.pointerEvents = 'auto'; // Permettre les interactions avec sketch2
        p.canvas.style.zIndex = '2'; // Assurer que ce canvas est au-dessus

        // Initialiser les rectangles avec leurs numéros
        initializeRectangles();
    };

    // Fonction pour dessiner les rectangles, les images et gérer les interactions
    p.draw = function() {
        p.clear(); // Effacer le canvas tout en gardant la transparence

        // Traduire l'origine au centre de l'écran
        p.translate(p.width / 2, p.height / 2);

        // Détection du rectangle actif : touch (tap) sur mobile, survol souris sur desktop
        let relMouseX = p.mouseX - p.width / 2;
        let relMouseY = p.mouseY - p.height / 2;
        let hoveredRect = null;

        if (isTouchDevice) {
            // Sur mobile : utiliser l'état du dernier tap (géré par touchStarted)
            hoveredRect = touchedRect;
        } else {
            // Sur desktop : détection classique par position souris
            outerLoop:
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let rect = rectangles[row * cols + col];
                    let x = -((cols * (baseSize + spacing) - spacing) / 2) + baseSize / 2 + col * (baseSize + spacing);
                    let y = -((rows * (baseSize + spacing) - spacing) / 2) + baseSize / 2 + row * (baseSize + spacing);
                    let d = p.dist(relMouseX, relMouseY, x + rect.currentShiftX, y + rect.currentShiftY + targetShiftY);
                    if (d < rect.currentSize / 2) {
                        hoveredRect = rect.number;
                        break outerLoop;
                    }
                }
            }
        }

        // Définir les opacités cibles en fonction de l'état de survol
        if (hoveredRect !== null) {
            bgTargetOpacity = 20;
            rectTargetOpacity = 20;
        } else {
            bgTargetOpacity = 200;
            rectTargetOpacity = 200;
        }

        // Gestion des cibles de taille, de décalage et du positionnement pour maintenir l'espacement
        if (hoveredRect !== null) {
            let hoveredRectObj = rectangles.find(r => r.number === hoveredRect);
            if (hoveredRectObj) {
                rectangles.forEach(rect => {
                    if (rect.row === hoveredRectObj.row) {
                        if (rect.col < hoveredRectObj.col) {
                            rect.targetShiftX = -shiftOffsetX; // Déplacer à gauche
                        } else if (rect.col > hoveredRectObj.col) {
                            rect.targetShiftX = shiftOffsetX; // Déplacer à droite
                        } else {
                            rect.targetShiftX = 0; // Rectangle survolé reste centré
                        }
                    } else {
                        rect.targetShiftX = 0; // Autres lignes ne bougent pas
                    }

                    if (rect.number === hoveredRect) {
                        rect.targetSize = hoverSize; // Agrandir le rectangle survolé
                        if (rect.row === 0) {
                            rect.targetShiftY = targetShiftY - shiftAmount; // Déplacer légèrement vers le haut
                        } else if (rect.row === 1) {
                            rect.targetShiftY = targetShiftY + shiftAmount; // Déplacer légèrement vers le bas
                        }
                        // Si row == 2, ajustez si nécessaire
                    } else {
                        rect.targetSize = baseSize; // Réinitialiser la taille des autres rectangles
                        rect.targetShiftY = targetShiftY; // Réinitialiser le décalage vertical
                    }

                    // Mettre à jour les propriétés pour des transitions fluides
                    rect.update();
                });
            }
        } else {
            // Aucun rectangle survolé, réinitialiser toutes les propriétés
            rectangles.forEach(rect => {
                rect.targetSize = baseSize; // Réinitialiser la taille
                rect.targetShiftX = 0; // Réinitialiser le décalage horizontal
                rect.targetShiftY = targetShiftY; // Réinitialiser le décalage vertical

                // Mettre à jour les propriétés pour des transitions fluides
                rect.update();
            });
        }

        // Interpoler les opacités vers les cibles
        bgOpacity = p.lerp(bgOpacity, bgTargetOpacity, fadeSpeed);
        rectOpacity = p.lerp(rectOpacity, rectTargetOpacity, fadeSpeed);

        // Gestion des images avec fade-in uniquement
        if (hoveredRect !== null) {
            let newImageIndex = hoveredRect - 1;

            if (currentImageIndex !== newImageIndex) {
                // Réinitialiser l'opacité de l'image précédente
                if (currentImageIndex !== -1) {
                    imageOpacities[currentImageIndex] = 0;
                    imageTargetOpacities[currentImageIndex] = 0;
                }

                // Mettre à jour l'index de l'image actuelle
                currentImageIndex = newImageIndex;

                // Lazy load : charger l'image maintenant si pas encore chargée
                ensureImageLoaded(currentImageIndex);

                // Définir l'opacité cible pour l'image actuelle
                imageTargetOpacities[currentImageIndex] = 255;

                // Mettre à jour le texte actuel
                currentText = texts[currentImageIndex];
                updateReliefPanel(currentText);
            }
        } else {
            // Aucune image n'est survolée, réinitialiser l'image actuelle
            if (currentImageIndex !== -1) {
                imageOpacities[currentImageIndex] = 0;
                currentImageIndex = -1;
            }

            // Réinitialiser le texte
            currentText = null;
            updateReliefPanel(null);
        }

        // Mettre à jour les opacités des images en fonction des cibles
        for (let i = 0; i < imageOpacities.length; i++) {
            imageOpacities[i] = p.lerp(imageOpacities[i], imageTargetOpacities[i], 0.1);
        }

        // Dessiner l'image de relief actuellement sélectionnée en arrière-plan avec son opacité actuelle
        if (currentImageIndex !== -1 && reliefImages[currentImageIndex] !== null && imageOpacities[currentImageIndex] > 0) {
            p.push();
            p.noStroke();
            p.tint(255, imageOpacities[currentImageIndex]); // Appliquer l'opacité
            p.imageMode(p.CENTER);
            p.image(reliefImages[currentImageIndex], 0, 0, p.width, p.height); // Étendre l'image pour couvrir le fond
            p.pop();
        }

        // Dessiner le rectangle noir de fond avec opacité dynamique
        p.noStroke();
        p.fill(0, bgOpacity);
        p.rect(0, 0, p.width, p.height);

        // Le texte est géré par le div HTML #relief-panel (voir bas du fichier)
        // On met à jour son opacité via CSS
        if (hoveredRect !== null) {
            textTargetOpacity = 255;
        } else {
            textTargetOpacity = 0;
        }
        textOpacity = p.lerp(textOpacity, textTargetOpacity, 0.1);
        if (reliefPanel) {
            reliefPanel.style.opacity = (textOpacity / 255).toFixed(3);
        }

        // Dessiner les rectangles après le fond et les images
        rectangles.forEach(rect => {
            let totalWidth  = cols * (baseSize + spacing) - spacing;
            let totalHeight = rows * (baseSize + spacing) - spacing;
            let startX = -totalWidth  / 2 + baseSize / 2;
            let startY = -totalHeight / 2 + baseSize / 2;
            let x    = startX + rect.col * (baseSize + spacing) + rect.currentShiftX;
            let yPos = startY + rect.row * (baseSize + spacing) + rect.currentShiftY;
            rect.draw(x, yPos, rectOpacity);
        });
    };

    // ── Panel HTML pour les textes de reliefs ────────────────────────────────
    let reliefPanel = null;

    function buildReliefPanel() {
        const style = document.createElement('style');
        style.textContent = `
            #relief-panel {
                position: fixed;
                inset: 0;
                z-index: 5;
                pointer-events: none;
                opacity: 0;
                display: flex;
                flex-direction: column;
                padding: 3vw 4vw;
                box-sizing: border-box;
                font-family: 'OldNewspaperTypes', serif;
                color: #fff;
                overflow: hidden;
            }
            #relief-panel .rp-title {
                font-size: clamp(1rem, 5vw, 2rem);
                font-style: italic;
                font-weight: bold;
                margin: 0 0 0.3em;
                text-align: center;
            }
            #relief-panel .rp-subtitle {
                font-size: clamp(0.7rem, 3.2vw, 1.2rem);
                text-align: center;
                margin: 0 0 0.8em;
                opacity: 0.85;
            }
            #relief-panel .rp-body {
                flex: 1;
                overflow-y: auto;
                font-size: clamp(0.6rem, 2.4vw, 0.92rem);
                line-height: 1.55;
                -webkit-overflow-scrolling: touch;
            }
            #relief-panel .rp-body .rp-legend-title {
                font-size: clamp(0.65rem, 2.6vw, 1rem);
                font-weight: bold;
                margin: 0.6em 0 0.3em;
            }
            #relief-panel .rp-body p {
                margin: 0 0 0.25em;
            }
            /* Couleurs spéciales (mots en relief) */
            #relief-panel .rp-body .w-red   { color: #ff9696; }
            #relief-panel .rp-body .w-green { color: #96ff96; }
            #relief-panel .rp-body .w-blue  { color: #9696ff; }
            #relief-panel .rp-body .w-orange{ color: #ffa500; }
            /* Deux colonnes sur paysage pour desc3+4 */
            #relief-panel .rp-cols {
                display: flex;
                gap: 3vw;
            }
            #relief-panel .rp-col {
                flex: 1;
                font-size: clamp(0.55rem, 2vw, 0.85rem);
                line-height: 1.5;
            }
            @media (orientation: portrait) {
                #relief-panel .rp-cols { flex-direction: column; gap: 0.5em; }
            }
            @media (max-width: 359px) {
                #relief-panel .rp-title   { font-size: 0.9rem; }
                #relief-panel .rp-subtitle{ font-size: 0.62rem; }
                #relief-panel .rp-body    { font-size: 0.55rem; }
            }
        `;
        document.head.appendChild(style);

        reliefPanel = document.createElement('div');
        reliefPanel.id = 'relief-panel';
        document.body.appendChild(reliefPanel);
    }

    // Mots spéciaux → couleur HTML
    const specialWordsHTML = {
        "a,a'": 'red', "a'": 'red', "a": 'red',
        "c": 'green', "c'": 'green', "c,c'": 'green',
        "cd,c'd'": 'green', "APA'": 'green',
        "mm'": 'blue', "C1": 'blue',
        "C1d": 'orange', "bc,b'c'": 'red',
    };

    function colorizeHTML(line) {
        return line.split(' ').map(word => {
            const cls = specialWordsHTML[word];
            if (cls) return `<span class="w-${cls}">${word}</span>`;
            return word;
        }).join(' ');
    }

    function linesToHTML(lines) {
        if (!lines || lines.length === 0) return '';
        let html = '';
        lines.forEach((line, i) => {
            const trimmed = line.trim();
            if (i === 0 && /^LEGENDE/.test(trimmed)) {
                html += `<p class="rp-legend-title">${trimmed}</p>`;
            } else {
                html += `<p>${colorizeHTML(trimmed)}</p>`;
            }
        });
        return html;
    }

    function updateReliefPanel(text) {
        if (!reliefPanel) return;
        if (!text) { reliefPanel.innerHTML = ''; return; }

        let html = `<div class="rp-title">${text.title}</div>`;

        if (text.descriptions && text.descriptions.length > 0) {
            html += `<div class="rp-subtitle">${text.descriptions.join(' ')}</div>`;
        }

        html += `<div class="rp-body">`;

        if (text.descriptions2) {
            html += linesToHTML(text.descriptions2);
        }

        // desc3 + desc4 côte à côte
        if (text.descriptions3 || text.descriptions4) {
            html += `<div class="rp-cols">`;
            if (text.descriptions3) {
                html += `<div class="rp-col">${linesToHTML(text.descriptions3)}</div>`;
            }
            if (text.descriptions4) {
                html += `<div class="rp-col">${linesToHTML(text.descriptions4)}</div>`;
            }
            html += `</div>`;
        }

        html += `</div>`;
        reliefPanel.innerHTML = html;
        // Remettre le scroll en haut à chaque changement
        const body = reliefPanel.querySelector('.rp-body');
        if (body) body.scrollTop = 0;
    }

    // Construire le panel au setup
    buildReliefPanel();

    // Gestion du tap sur mobile : sélectionne/désélectionne un carton
    p.touchStarted = function() {
        if (p.touches.length === 0) return false;
        let tx = p.touches[0].x - p.width / 2;
        let ty = p.touches[0].y - p.height / 2;

        let tappedRect = null;
        outerTouchLoop:
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let rect = rectangles[row * cols + col];
                let x = -((cols * (baseSize + spacing) - spacing) / 2) + baseSize / 2 + col * (baseSize + spacing);
                let y = -((rows * (baseSize + spacing) - spacing) / 2) + baseSize / 2 + row * (baseSize + spacing);
                let d = p.dist(tx, ty, x + rect.currentShiftX, y + rect.currentShiftY + targetShiftY);
                if (d < rect.currentSize / 2) {
                    tappedRect = rect.number;
                    break outerTouchLoop;
                }
            }
        }

        // Toggle : re-taper le même carton le ferme, taper ailleurs ferme aussi
        touchedRect = (touchedRect === tappedRect) ? null : tappedRect;
        return false; // Empêcher le scroll et le zoom natif
    };

    // Fonction pour redimensionner le canvas lors du changement de taille de la fenêtre
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Recalculer les tailles des rectangles, des polices, de l'espacement et de l'écart titre-descriptions
        calculateSizes();
        setGridBasedOnOrientation();
        setTargetShiftYBasedOnOrientation(); // Ajuste le décalage vertical basé sur l'orientation
        initializeRectangles();
        touchedRect = null; // Réinitialiser la sélection au changement d'orientation
        // Aucun recalcul supplémentaire nécessaire car les positions sont recalculées dynamiquement dans draw()
    };
};

// Initialiser le second sketch après le chargement de p5.js
if (typeof p5 !== 'undefined') {
    new p5(sketch2);
}
