/* --- TITRE : CONFIGURATION ET DONNÉES --- */
document.addEventListener('DOMContentLoaded', () => {

    const episodesData = [
        { id: 14, title: "L'art de la résilience", author: "Marc Durand", image: "assets/img/photos/ep1.png", audio: "assets/audio/ep1.mp3", tag: "RÉCIT LONG", comment: "Une exploration profonde des mécanismes de reconstruction après l'épreuve." },
        { id: 13, title: "Expertise de l'ombre", author: "Julie Clerc", image: "assets/img/photos/ep2.png", audio: "assets/audio/ep2.mp3", tag: "PORTRAIT", comment: "Rencontre avec ceux qui font tourner la machine sans jamais être sous les projecteurs." },
        { id: 12, title: "Trajectoires libres", author: "Thomas Petit", image: "assets/img/photos/ep3.png", audio: "assets/audio/ep3.mp3", tag: "IMMERSION", comment: "Suivre le sillage de nomades modernes en quête de sens absolu." }
    ];

    const articlesData = [
        { category: "SOCIÉTÉ", title: "Le futur du travail hybride", link: "pages/art1.html", duration: "8 MIN" },
        { category: "ÉCONOMIE", title: "L'économie de l'attention", link: "pages/art2.html", duration: "12 MIN" },
        { category: "CULTURE", title: "L'art du silence digital", link: "pages/art3.html", duration: "10 MIN" }
    ];

    let currentTrackIndex = -1;
    const coreAudio = document.getElementById('coreAudio');
    const playerWidget = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    const audioRange = document.getElementById('audioRange');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationTimeDisplay = document.getElementById('durationTime');
    const nav = document.getElementById('mainNavbar');

    /* --- TITRE : NAVIGATION (SCROLL ET BURGER) --- */
    
    // Animation de réduction de la barre au scroll
    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    const burgerBtn = document.getElementById('burgerBtn');
    const navLeft = document.querySelector('.nav-section.left');
    const body = document.body;

    if (burgerBtn && navLeft) {
        burgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = navLeft.classList.toggle('open');
            burgerBtn.classList.toggle('open');
            
            if (isOpen) {
                body.style.overflow = 'hidden'; // Bloque le site derrière
            } else {
                body.style.overflow = '';
            }
        });
    }

    // Fermer le menu si on clique sur un lien (pour le burger)
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn?.classList.remove('open');
            navLeft?.classList.remove('open');
            body.style.overflow = '';
        });
    });

    /* --- TITRE : PERSISTANCE AUDIO AGRESSIVE --- */
    
    const restorePlayer = () => {
        if (coreAudio && sessionStorage.getItem("n_src")) {
            let src = sessionStorage.getItem("n_src");
            const isSubPage = window.location.pathname.includes('pages/');
            
            if (isSubPage && !src.includes('../')) src = '../' + src;
            if (!isSubPage) src = src.replace('../', '');

            coreAudio.src = src;
            document.getElementById('trackTitle').innerText = sessionStorage.getItem("n_title");
            document.getElementById('trackAuthor').innerText = sessionStorage.getItem("n_author");
            
            const savedTime = parseFloat(sessionStorage.getItem("n_time"));
            coreAudio.addEventListener('loadedmetadata', () => {
                coreAudio.currentTime = savedTime;
                
                if (sessionStorage.getItem("n_playing") === "true") {
                    coreAudio.play().then(() => {
                        if (playIcon) playIcon.innerHTML = "<span>PAUSE</span>";
                    }).catch(() => {});
                }
            }, { once: true });

            if (sessionStorage.getItem("n_active") === "true") {
                playerWidget.style.display = "block";
                playerWidget.classList.add('active');
                if (sessionStorage.getItem("n_expanded") === "true") {
                    playerWidget.classList.add('expanded');
                }
            }
        }
    };

    setInterval(() => {
        if (coreAudio && coreAudio.src && coreAudio.src !== "") {
            const cleanPath = coreAudio.src.split(window.location.origin).pop().substring(1).replace('../', '');
            sessionStorage.setItem("n_src", cleanPath);
            sessionStorage.setItem("n_time", coreAudio.currentTime);
            sessionStorage.setItem("n_title", document.getElementById('trackTitle').innerText);
            sessionStorage.setItem("n_author", document.getElementById('trackAuthor').innerText);
            sessionStorage.setItem("n_active", playerWidget.classList.contains('active'));
            sessionStorage.setItem("n_expanded", playerWidget.classList.contains('expanded'));
            sessionStorage.setItem("n_playing", !coreAudio.paused);
        }
    }, 500);

    /* --- TITRE : ACTIONS LECTEUR --- */
    
    window.playAudio = (title, author, src) => {
        playerWidget.style.display = "block";
        setTimeout(() => { playerWidget.classList.add('active'); }, 10);
        document.getElementById('trackTitle').innerText = title.toUpperCase();
        document.getElementById('trackAuthor').innerText = author.toUpperCase();
        
        let finalSrc = src;
        if (window.location.pathname.includes('pages/') && !src.startsWith('../')) {
            finalSrc = '../' + src;
        }

        if (!coreAudio.src.includes(src.replace('../', ''))) {
            coreAudio.src = finalSrc;
            coreAudio.load();
        }
        coreAudio.play().then(() => { if (playIcon) playIcon.innerHTML = "<span>PAUSE</span>"; });
    };

    window.togglePlayback = () => {
        if (coreAudio.paused) { coreAudio.play(); if (playIcon) playIcon.innerHTML = "<span>PAUSE</span>"; }
        else { coreAudio.pause(); if (playIcon) playIcon.innerHTML = "<span>PLAY</span>"; }
    };

    window.nextTrack = () => {
        currentTrackIndex = (currentTrackIndex + 1) % episodesData.length;
        const t = episodesData[currentTrackIndex];
        window.playAudio(t.title, t.author, t.audio);
    };

    window.prevTrack = () => {
        currentTrackIndex = (currentTrackIndex - 1 + episodesData.length) % episodesData.length;
        const t = episodesData[currentTrackIndex];
        window.playAudio(t.title, t.author, t.audio);
    };

    window.expandPlayer = () => playerWidget.classList.toggle('expanded');

    window.stopPlayer = () => {
        coreAudio.pause();
        playerWidget.classList.remove('active', 'expanded');
        playerWidget.style.display = "none";
        sessionStorage.clear();
    };

    const formatTime = (s) => {
        if (isNaN(s)) return "00:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    coreAudio.addEventListener('timeupdate', () => {
        if (audioRange && !isNaN(coreAudio.duration)) {
            audioRange.value = (coreAudio.currentTime / coreAudio.duration) * 100;
            currentTimeDisplay.innerText = formatTime(coreAudio.currentTime);
            durationTimeDisplay.innerText = formatTime(coreAudio.duration);
        }
    });

    if (audioRange) {
        audioRange.addEventListener('input', () => {
            coreAudio.currentTime = coreAudio.duration * (audioRange.value / 100);
        });
    }

    /* --- TITRE : PAGE ACCUEIL (RENDU) --- */
    
    const renderUI = () => {
        const epContainer = document.getElementById('episodes-container');
        const artContainer = document.getElementById('articles-container');
        if (epContainer) {
            epContainer.innerHTML = episodesData.map(ep => {
                const rot = (Math.random() * 4 - 2).toFixed(2);
                return `
                    <article class="ep-card reveal visible" style="transform: rotate(${rot}deg)" onclick="playAudio('${ep.title.replace(/'/g, "\\'")}', '${ep.author.replace(/'/g, "\\'")}', '${ep.audio}')">
                        <div class="ep-overlay-play broadway">ÉCOUTER</div>
                        <div class="ep-thumb"><img src="${ep.image}" alt="${ep.title}" class="ep-image-dynamic"></div>
                        <div class="ep-meta-wrap">
                            <span class="ep-meta font-comment">${ep.tag} &bull; EP. ${ep.id}</span>
                            <h3 class="ep-name broadway">${ep.title}</h3>
                            <p class="font-comment">${ep.comment}</p>
                            <span class="ep-author goudy">PAR ${ep.author.toUpperCase()}</span>
                        </div>
                    </article>
                `;
            }).join('');
        }
        if (artContainer) {
            artContainer.innerHTML = articlesData.map(art => `
                <div class="article-row reveal visible">
                    <span class="category-tag goudy">${art.category}</span>
                    <h3 class="analysis-title broadway title-3d">${art.title}</h3>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span class="font-comment">${art.duration}</span>
                        <a href="${art.link}" class="analysis-link broadway">LIRE</a>
                    </div>
                </div>
            `).join('');
        }
    };

    /* --- TITRE : PAGE CONTACT (FORMULAIRE) --- */
    
    const initContactForm = () => {
        const form = document.getElementById("contactForm");
        const letter = document.getElementById("letter");
        const btn = document.getElementById("sendBtn");
        if (!form) return;
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            btn.disabled = true; btn.innerText = "EXPÉDITION...";
            try {
                const response = await fetch("https://formspree.io/f/xojwddye", {
                    method: 'POST',
                    body: new FormData(e.target),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    letter.classList.add('sent-status');
                    setTimeout(() => {
                        letter.style.opacity = "0";
                        letter.classList.remove('sent-status');
                        form.reset(); btn.innerText = "EXPÉDIER LA LETTRE"; btn.disabled = false;
                        setTimeout(() => {
                            letter.style.opacity = "1"; letter.classList.add('new-letter-arrival');
                            setTimeout(() => { letter.classList.remove('new-letter-arrival'); }, 800);
                        }, 300);
                    }, 1400); 
                }
            } catch (error) { btn.disabled = false; }
        });
    };

    /* --- INITIALISATION GÉNÉRALE --- */
    restorePlayer();
    renderUI();
    initContactForm();
    
    // Débloque l'autoplay au premier clic sur n'importe quelle page
    document.addEventListener('click', () => {
        if (sessionStorage.getItem("n_playing") === "true" && coreAudio.paused) {
            coreAudio.play().catch(() => {});
        }
    }, { once: true });
});

/* --- FONCTIONS GLOBALES (LÉGAL) --- */
window.openLegal = () => { 
    const m = document.getElementById('legalModal'); 
    // On ne touche qu'au display, le CSS s'occupe du reste
    if(m) { 
        m.style.display = 'flex'; 
    }
};

window.closeLegal = () => { 
    const m = document.getElementById('legalModal'); 
    if(m) m.style.display = 'none'; 
};

// Ajoute cette fonction pour pouvoir fermer en cliquant à côté du texte
window.closeLegalOnDim = (event) => {
    if (event.target.id === 'legalModal') {
        window.closeLegal();
    }
};