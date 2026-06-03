
// 1. GESTION DU THÈME (clair / sombre)
// -------------------------------------
var boutonTheme = document.getElementById('boutonTheme');
boutonTheme.addEventListener('click', function() {
    document.body.classList.toggle('sombre');
});


// 2. OBSERVATEUR DE SECTIONS (navigation latérale active)
// --------------------------------------------------------
var sections   = document.querySelectorAll('section');
var liensNav   = document.querySelectorAll('.lien-nav');

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            liensNav.forEach(function(lien) { lien.classList.remove('actif'); });
            var id = entry.target.getAttribute('id');
            var lienActif = document.querySelector('.lien-nav[data-section="' + id + '"]');
            if (lienActif) lienActif.classList.add('actif');
        }
    });
}, { root: null, threshold: 0.5, rootMargin: "0px" }); // déclenche l'action dès qu'une section occupe moins de 50% de l'écran

sections.forEach(function(section) { 
    observer.observe(section); 
});


// 3. SCROLL FLUIDE (#...)
// --------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) { // tous les liens commencant par 'a[href^="#"]'
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var cible = document.querySelector(this.getAttribute('href'));
        if (cible) cible.scrollIntoView({ behavior: 'smooth' });
    });
});


// 4. TOGGLE DÉTAIL DES PROJETS
// ------------------------------
// Quand on clique sur "Voir le détail →", la carte reçoit la classe .ouvert
// ce qui déclenche l'animation CSS max-height sur .detail-projet.

var boutonsDetail = document.querySelectorAll('.bouton-detail');

boutonsDetail.forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        var carte = this.closest('.carte-projet');
        var estOuvert = carte.classList.contains('ouvert');

        // Ferme toutes les cartes ouvertes (pour que une seule ouverte à la fois)
        document.querySelectorAll('.carte-projet.ouvert').forEach(function(c) {
            c.classList.remove('ouvert');
            var btn = c.querySelector('.bouton-detail');
            if (btn) btn.textContent = 'Voir le détail →';
        });

        // Si la carte cliquée était fermée, on l'ouvre
        if (!estOuvert) {
            carte.classList.add('ouvert');
            this.textContent = 'Masquer le détail ↑';
        }
        // Sinon elle vient d'être refermée par le bloc ci-dessus → rien de plus
    });
});


// 5. POPUP IMAGE (overlay)
// --------------------------
// Toutes les images avec la classe .cliquable ouvrent le popup.
// On clique sur l'overlay ou le bouton ✕ pour fermer.

var overlay     = document.getElementById('overlayImage');
var overlayImg  = document.getElementById('overlayImg');
var overlayFerm = document.getElementById('overlayFermer');

// Ouvre le popup avec l'image cliquée
document.querySelectorAll('img.cliquable').forEach(function(img) {
    img.addEventListener('click', function() {
        overlayImg.src = this.src;
        overlayImg.alt = this.alt;
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // empêche le scroll derrière
    });
});

// Ferme le popup via le bouton ✕
overlayFerm.addEventListener('click', fermerOverlay);

// Ferme le popup en cliquant sur le fond sombre (pas sur l'image)
overlay.addEventListener('click', function(e) {
    if (e.target === overlay) fermerOverlay();
});

// Ferme le popup avec la touche Echap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') fermerOverlay();
});

function fermerOverlay() {
    overlay.classList.remove('visible');
    document.body.style.overflow = ''; // rétablit le scroll
    overlayImg.src = ''; // libère la mémoire
}