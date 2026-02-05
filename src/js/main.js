document.addEventListener('DOMContentLoaded', () => {

    /* --- DONNÉES --- */
    const episodesData = [
        {
            id: 14,
            title: "L'art de la résilience",
            author: "Marc Durand",
            image: "assets/img/photos/ep1.png",
            audio: "assets/audio/ep1.mp3",
            tag: "RÉCIT LONG",
            comment: "Une exploration profonde des mécanismes de reconstruction après l'épreuve."
        },
        {
            id: 13,
            title: "Expertise de l'ombre",
            author: "Julie Clerc",
            image: "assets/img/photos/ep2.png",
            audio: "assets/audio/ep2.mp3",
            tag: "PORTRAIT",
            comment: "Rencontre avec ceux qui font tourner la machine sans jamais être sous les projecteurs."
        },
        {
            id: 12,
            title: "Trajectoires libres",
            author: "Thomas Petit",
            image: "assets/img/photos/ep3.png",
            audio: "assets/audio/ep3.mp3",
            tag: "IMMERSION",
            comment: "Suivre le sillage de nomades modernes en quête de sens absolu."
        }
    ];

    const articlesData = [
        { category: "SOCIÉTÉ", title: "Le futur du travail hybride", link: "pages/art1.html", duration: "8 MIN" },
        { category: "ÉCONOMIE", title: "L'économie de l'attention", link: "pages/art2.html", duration: "12 MIN" },
        { category: "CULTURE", title: "L'art du silence digital", link: "pages/art3.html", duration: "10 MIN" }
    ];

    /* --- VARIABLES ÉLÉMENTS --- */
    let currentTrackIndex = -1;
    const coreAudio = document.getElementById('coreAudio');
    const playerWidget = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    const audioRange = document.getElementById('audioRange');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationTimeDisplay = document.getElementById('durationTime');

    /* --- LOGIQUE AUDIO & PLAYER --- */

// 1. On utilise localStorage pour une mémoire totale
const restorePlayer = () => {
        const savedSrc = localStorage.getItem("n_src");
        const savedTime = localStorage.getItem("n_time");

        if (coreAudio && savedSrc) {
            coreAudio.src = savedSrc;
            document.getElementById('trackTitle').innerText = localStorage.getItem("n_title") || "TITRE";
            document.getElementById('trackAuthor').innerText = localStorage.getItem("n_author") || "AUTEUR";
            
            // On force l'affichage du temps texte immédiatement
            if (savedTime) {
                currentTimeDisplay.innerText = formatTime(parseFloat(savedTime));
            }

            if (localStorage.getItem("n_active") === "true") {
                playerWidget.style.display = "block";
                playerWidget.classList.add('active');
                if (localStorage.getItem("n_expanded") === "true") playerWidget.classList.add('expanded');
            }
        }
    };

    // 2. Sauvegarde ultra-précise
    const saveState = () => {
        if (coreAudio && coreAudio.src && !isNaN(coreAudio.currentTime) && coreAudio.currentTime > 0) {
            localStorage.setItem("n_src", coreAudio.src);
            localStorage.setItem("n_time", coreAudio.currentTime);
            localStorage.setItem("n_title", document.getElementById('trackTitle').innerText);
            localStorage.setItem("n_author", document.getElementById('trackAuthor').innerText);
            localStorage.setItem("n_active", playerWidget.classList.contains('active'));
            localStorage.setItem("n_expanded", playerWidget.classList.contains('expanded'));
        }
    };

coreAudio.addEventListener('loadedmetadata', () => {
        const savedTime = localStorage.getItem("n_time");
        if (savedTime && !isNaN(coreAudio.duration) && coreAudio.duration > 0) {
            // Calcule le pourcentage réel et déplace la boule
            const progress = (parseFloat(savedTime) / coreAudio.duration) * 100;
            audioRange.value = progress;
            durationTimeDisplay.innerText = formatTime(coreAudio.duration);
        }
    });

    setInterval(saveState, 1000);

    window.nextTrack = () => {
        if (episodesData.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % episodesData.length;
        const track = episodesData[currentTrackIndex];
        window.playAudio(track.title, track.author, track.audio);
    };

    window.prevTrack = () => {
        if (episodesData.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + episodesData.length) % episodesData.length;
        const track = episodesData[currentTrackIndex];
        window.playAudio(track.title, track.author, track.audio);
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    window.playAudio = (title, author, src) => {
        playerWidget.style.display = "block";
        setTimeout(() => { playerWidget.classList.add('active'); }, 10);
        document.getElementById('trackTitle').innerText = title.toUpperCase();
        document.getElementById('trackAuthor').innerText = author.toUpperCase();
        
        currentTrackIndex = episodesData.findIndex(ep => src.includes(ep.audio));
        
        let finalSrc = src;
        if (window.location.pathname.includes('pages/')) { 
            if (!src.startsWith('../')) finalSrc = '../' + src; 
        } else { 
            finalSrc = src.replace('../', ''); 
        }

        if (!coreAudio.src.includes(src.replace('../', ''))) { 
            coreAudio.src = finalSrc; 
            coreAudio.load(); 
        }
        
        coreAudio.play().then(() => { 
            if (playIcon) playIcon.innerHTML = "<span>PAUSE</span>"; 
        }).catch(e => console.log("Lecture auto bloquée"));
    };

// 3. LA CORRECTION MOBILE : Calage au moment du clic
    window.togglePlayback = () => {
        if (coreAudio.paused) {
            const savedTime = parseFloat(localStorage.getItem("n_time"));
            
            // Si c'est le premier démarrage et qu'on a un temps sauvegardé
            if (coreAudio.currentTime < 1 && savedTime > 0) {
                coreAudio.currentTime = savedTime;
            }

            coreAudio.play().then(() => {
                playIcon.innerHTML = "<span>PAUSE</span>";
            }).catch(e => console.log("Erreur play"));
        } else {
            coreAudio.pause();
            playIcon.innerHTML = "<span>PLAY</span>";
        }
    };

    window.stopPlayer = () => {
        coreAudio.pause();
        playerWidget.classList.remove('active', 'expanded');
        playerWidget.style.display = "none";
        localStorage.clear();
    };

    window.expandPlayer = () => { playerWidget.classList.toggle('expanded'); };

    const updateUIProgress = () => {
        if (audioRange && !isNaN(coreAudio.duration)) {
            const progress = (coreAudio.currentTime / coreAudio.duration) * 100;
            audioRange.value = progress;
            currentTimeDisplay.innerText = formatTime(coreAudio.currentTime);
            durationTimeDisplay.innerText = formatTime(coreAudio.duration);
        }
    };

    coreAudio.addEventListener('timeupdate', updateUIProgress);

    // Correction pour la barre de temps sur mobile (input + change)
    if (audioRange) {
        audioRange.addEventListener('input', () => {
            if (!isNaN(coreAudio.duration)) {
                coreAudio.currentTime = coreAudio.duration * (audioRange.value / 100);
            }
        });
        // Pour éviter les sauts brutaux sur mobile lors du drag
        audioRange.addEventListener('touchstart', () => coreAudio.pause());
        audioRange.addEventListener('touchend', () => coreAudio.play());
    }

    /* --- RENDU UI --- */
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
                            <p class="font-comment" style="margin-top: 8px;">${ep.comment}</p>
                            <span class="ep-author goudy" style="font-size: 0.9rem; opacity: 0.7; display: block; margin-top: 8px;">PAR ${ep.author.toUpperCase()}</span>
                        </div>
                    </article>`;
            }).join('');
        }
        if (artContainer) {
            artContainer.innerHTML = articlesData.map((art) => `
                <div class="article-row reveal visible">
                    <span class="category-tag goudy" style="color: var(--terracotta);">${art.category}</span>
                    <h3 class="analysis-title broadway title-3d">${art.title}</h3>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span class="font-comment">${art.duration}</span>
                        <a href="${art.link}" class="analysis-link broadway">LIRE</a>
                    </div>
                </div>`).join('');
        }
    };

    /* --- NAVIGATION & SCROLL --- */
    const handleNavbar = () => {
        const burgerBtn = document.getElementById('burgerBtn');
        const mobileMenu = document.querySelector('.nav-mobile-only');

        if (burgerBtn && mobileMenu) {
            burgerBtn.onclick = (e) => {
                e.preventDefault();
                const isOpen = burgerBtn.classList.toggle('open');
                mobileMenu.classList.toggle('open');

                if (isOpen) {
                    document.body.classList.add('menu-open');
                    document.documentElement.style.overflow = 'hidden';
                } else {
                    document.body.classList.remove('menu-open');
                    document.documentElement.style.overflow = '';
                }
            };
        }
    };

    /* --- EFFET STICKY NAV + LOGO --- */
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('mainNavbar');
        const isMenuOpen = document.body.classList.contains('menu-open');

        if (window.scrollY > 50 && !isMenuOpen) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    /* --- MODALE MENTIONS LÉGALES --- */
    window.openLegal = () => { 
        const m = document.getElementById('legalModal');
        if(m) { m.style.display = 'flex'; m.style.opacity = "1"; document.body.style.overflow = 'hidden'; }
    };
    
    window.closeLegal = () => { 
        const m = document.getElementById('legalModal');
        if(m) { m.style.display = 'none'; document.body.style.overflow = ''; }
    };

    window.closeLegalOnDim = (event) => {
        const modal = document.getElementById('legalModal');
        if (event.target === modal) window.closeLegal();
    };

    /* --- FORMULAIRE --- */
    const initContactForm = () => {
        const form = document.getElementById("contactForm");
        const letter = document.getElementById("letter");
        const btn = document.getElementById("sendBtn");
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                btn.disabled = true; btn.innerText = "EXPÉDITION...";
                try {
                    const response = await fetch("https://formspree.io/f/xojwddye", { method: 'POST', body: new FormData(e.target), headers: { 'Accept': 'application/json' } });
                    if (response.ok) {
                        letter.classList.add('sent-status');
                        setTimeout(() => {
                            letter.style.opacity = "0"; letter.classList.remove('sent-status'); form.reset();
                            btn.innerText = "EXPÉDIER LA LETTRE"; btn.disabled = false;
                            setTimeout(() => { 
                                letter.style.opacity = "1"; 
                                letter.classList.add('new-letter-arrival'); 
                                setTimeout(() => { letter.classList.remove('new-letter-arrival'); }, 800); 
                            }, 300);
                        }, 1400); 
                    }
                } catch (error) { btn.disabled = false; }
            });
        }
    };

    /* --- INITIALISATION --- */
    renderUI();
    handleNavbar();
    initContactForm();
    restorePlayer(); // Toujours à la fin pour être sûr que l'UI est là
});