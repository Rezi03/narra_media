/* -------------------------------------------------------------------------- */
/* NARRA MÉDIA - MOTEUR JS INTÉGRAL (LECTEUR COMPLET V.2026)                  */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. DONNÉES DES ÉPISODES
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

    // 2. DONNÉES DES ARTICLES
    const articlesData = [
        {
            category: "SOCIÉTÉ",
            title: "Le futur du travail hybride",
            link: "pages/art1.html",
            duration: "8 MIN"
        },
        {
            category: "ÉCONOMIE",
            title: "L'économie de l'attention",
            link: "pages/art2.html",
            duration: "12 MIN"
        },
        {
            category: "CULTURE",
            title: "L'art du silence digital",
            link: "pages/art3.html",
            duration: "10 MIN"
        }
    ];

    let currentTrackIndex = -1;

    // 3. MOTEUR DE RENDU UI
    const renderUI = () => {
        const epContainer = document.getElementById('episodes-container');
        const artContainer = document.getElementById('articles-container');

        if (epContainer) {
            epContainer.innerHTML = episodesData.map(ep => {
                const rot = (Math.random() * 4 - 2).toFixed(2);
                const safeTitle = ep.title.replace(/'/g, "\\'");
                const safeAuthor = ep.author.replace(/'/g, "\\'");
                
                return `
                    <article class="ep-card reveal visible" style="transform: rotate(${rot}deg)" onclick="playAudio('${safeTitle}', '${safeAuthor}', '${ep.audio}')">
                        <div class="ep-overlay-play broadway">ÉCOUTER</div>
                        <div class="ep-thumb">
                            <img src="${ep.image}" alt="${ep.title}" class="ep-image-dynamic">
                        </div>
                        <div class="ep-meta-wrap">
                            <span class="ep-meta font-comment">${ep.tag} &bull; EP. ${ep.id}</span>
                            <h3 class="ep-name broadway">${ep.title}</h3>
                            <p class="font-comment" style="margin-top: 8px;">${ep.comment}</p>
                            <span class="ep-author goudy" style="font-size: 0.9rem; opacity: 0.7; display: block; margin-top: 8px;">PAR ${ep.author.toUpperCase()}</span>
                        </div>
                    </article>
                `;
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
                </div>
            `).join('');
        }
    };

    // 4. GESTION DU SCROLL
    const initScrollAnimations = () => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        
        reveals.forEach(el => observer.observe(el));
    };

    // 5. EFFETS DE PARALLAXE (Désactivé sur mobile pour la performance)
    const initParallaxBackground = () => {
        if (window.innerWidth < 768) return;
        const ray1 = document.getElementById('ray1');
        const ray2 = document.getElementById('ray2');
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            requestAnimationFrame(() => {
                if (ray1) ray1.style.transform = `translate(${x * 40}px, ${y * 40}px) rotate(${x * 2}deg)`;
                if (ray2) ray2.style.transform = `translate(${x * -80}px, ${y * -80}px) rotate(${y * -2}deg)`;
            });
        });
    };

    // 6. LECTEUR AUDIO CENTRAL
    const coreAudio = document.getElementById('coreAudio');
    const playerWidget = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    const audioRange = document.getElementById('audioRange');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationTimeDisplay = document.getElementById('durationTime');

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    window.playAudio = (title, author, src) => {
        document.getElementById('trackTitle').innerText = title.toUpperCase();
        document.getElementById('trackAuthor').innerText = author.toUpperCase();
        currentTrackIndex = episodesData.findIndex(ep => ep.audio === src);

        if (!coreAudio.src.includes(src)) {
            coreAudio.src = src;
            coreAudio.load();
        }

        playerWidget.classList.add('active');
        coreAudio.play().then(() => {
            playIcon.innerHTML = "<span>PAUSE</span>";
        }).catch(() => console.log("Lecture bloquée"));
    };

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

    window.togglePlayback = () => {
        if (coreAudio.paused) {
            coreAudio.play();
            playIcon.innerHTML = "<span>PAUSE</span>";
        } else {
            coreAudio.pause();
            playIcon.innerHTML = "<span>PLAY</span>";
        }
    };

    window.expandPlayer = () => {
        playerWidget.classList.toggle('expanded');
    };

    window.stopPlayer = () => {
        coreAudio.pause();
        playerWidget.classList.remove('active');
        playerWidget.classList.remove('expanded');
    };

    coreAudio.addEventListener('timeupdate', () => {
        const val = (coreAudio.currentTime / coreAudio.duration) * 100;
        if (audioRange) audioRange.value = val || 0;
        if (currentTimeDisplay) currentTimeDisplay.innerText = formatTime(coreAudio.currentTime);
        if (durationTimeDisplay && !isNaN(coreAudio.duration)) {
            durationTimeDisplay.innerText = formatTime(coreAudio.duration);
        }
    });

    if (audioRange) {
        audioRange.addEventListener('input', () => {
            const seekTo = coreAudio.duration * (audioRange.value / 100);
            coreAudio.currentTime = seekTo;
        });
    }

    // 7. MENTIONS LÉGALES
    window.openLegal = () => {
        const modal = document.getElementById('legalModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = "1", 10);
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeLegal = () => {
        const modal = document.getElementById('legalModal');
        if (modal) {
            modal.style.opacity = "0";
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }
    };

    window.closeLegalOnDim = (e) => {
        if (e.target.id === 'legalModal') closeLegal();
    };

    // 8. NAVIGATION & BURGER MENU
    const handleNavbar = () => {
        const nav = document.getElementById('mainNavbar');
        const burgerBtn = document.getElementById('burgerBtn');
        const navLeft = document.querySelector('.nav-section.left');
        const navLinks = document.querySelectorAll('.nav-item');

        window.addEventListener('scroll', () => {
            if (nav) {
                if (window.scrollY > 80) {
                    nav.style.height = window.innerWidth > 768 ? "90px" : "70px";
                    nav.style.background = "rgba(253, 245, 230, 0.98)";
                } else {
                    nav.style.height = window.innerWidth > 768 ? "120px" : "80px";
                    nav.style.background = "rgba(253, 245, 230, 0.75)";
                }
            }
        });

        if (burgerBtn && navLeft) {
            burgerBtn.addEventListener('click', () => {
                burgerBtn.classList.toggle('open');
                navLeft.classList.toggle('open');
                document.body.style.overflow = navLeft.classList.contains('open') ? 'hidden' : 'auto';
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn?.classList.remove('open');
                navLeft?.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    };

    // 9. NEWSLETTER
    const initNewsletter = () => {
        const form = document.getElementById('newsForm');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-news-submit');
            const originalText = btn.innerText;
            btn.innerText = "MERCI !";
            form.reset();
            setTimeout(() => btn.innerText = originalText, 4000);
        });
    };

    // 10. EFFETS VISUELS FINAUX
    const injectTornEffects = () => {
        if (window.innerWidth < 768) return; // Moins de rotations sur mobile pour garder la lisibilité
        document.querySelectorAll('.paper-sheet, .paper-sheet-alt').forEach(sheet => {
            const rot = (Math.random() * 4 - 2).toFixed(2);
            sheet.style.transform = `rotate(${rot}deg)`;
        });
    };

    // INITIALISATION GÉNÉRALE
    renderUI();
    initScrollAnimations();
    initParallaxBackground();
    handleNavbar();
    initNewsletter();
    injectTornEffects();
});