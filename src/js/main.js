document.addEventListener('DOMContentLoaded', () => {

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
    const coreAudio = document.getElementById('coreAudio');
    const playerWidget = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    const audioRange = document.getElementById('audioRange');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationTimeDisplay = document.getElementById('durationTime');

    const restorePlayer = () => {
        if (coreAudio && sessionStorage.getItem("n_src")) {
            coreAudio.src = sessionStorage.getItem("n_src");
            document.getElementById('trackTitle').innerText = sessionStorage.getItem("n_title");
            document.getElementById('trackAuthor').innerText = sessionStorage.getItem("n_author");
            
            const savedTime = parseFloat(sessionStorage.getItem("n_time"));
            
            coreAudio.addEventListener('loadedmetadata', () => {
                coreAudio.currentTime = savedTime;
            }, { once: true });

            if (sessionStorage.getItem("n_active") === "true") {
                playerWidget.style.display = "block";
                playerWidget.classList.add('active');
                
                if (sessionStorage.getItem("n_expanded") === "true") {
                    playerWidget.classList.add('expanded');
                }
                
                if (sessionStorage.getItem("n_playing") === "true") {
                    setTimeout(() => {
                        coreAudio.play().then(() => {
                            if (playIcon) playIcon.innerHTML = "<span>PAUSE</span>";
                        }).catch(() => {});
                    }, 100);
                }
            }
        }
    };

    setInterval(() => {
        if (coreAudio && coreAudio.src && coreAudio.src !== "") {
            sessionStorage.setItem("n_src", coreAudio.src);
            sessionStorage.setItem("n_time", coreAudio.currentTime);
            sessionStorage.setItem("n_title", document.getElementById('trackTitle').innerText);
            sessionStorage.setItem("n_author", document.getElementById('trackAuthor').innerText);
            sessionStorage.setItem("n_active", playerWidget.classList.contains('active'));
            sessionStorage.setItem("n_expanded", playerWidget.classList.contains('expanded'));
            sessionStorage.setItem("n_playing", !coreAudio.paused);
        }
    }, 500);

    const renderUI = () => {
        const epContainer = document.getElementById('episodes-container');
        const artContainer = document.getElementById('articles-container');

        if (epContainer) {
            epContainer.innerHTML = episodesData.map(ep => {
                const rot = (Math.random() * 4 - 2).toFixed(2);
                return `
                    <article class="ep-card reveal visible" style="transform: rotate(${rot}deg)" onclick="playAudio('${ep.title.replace(/'/g, "\\'")}', '${ep.author.replace(/'/g, "\\'")}', '${ep.audio}')">
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
        });
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

    window.expandPlayer = () => { playerWidget.classList.toggle('expanded'); };

    window.stopPlayer = () => {
        coreAudio.pause();
        playerWidget.classList.remove('active', 'expanded');
        playerWidget.style.display = "none";
        sessionStorage.clear();
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

    const initContactForm = () => {
        const form = document.getElementById("contactForm");
        const letter = document.getElementById("letter");
        const btn = document.getElementById("sendBtn");

        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                btn.disabled = true;
                btn.innerText = "EXPÉDITION...";
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
                            form.reset();
                            btn.innerText = "EXPÉDIER LA LETTRE";
                            btn.disabled = false;
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

    const handleNavbar = () => {
        const nav = document.getElementById('mainNavbar');
        const burgerBtn = document.getElementById('burgerBtn');
        const navLeft = document.querySelector('.nav-section.left');
        window.addEventListener('scroll', () => {
            if (nav) {
                nav.style.height = window.scrollY > 80 ? "90px" : "120px";
                nav.style.background = window.scrollY > 80 ? "rgba(253, 245, 230, 0.98)" : "rgba(253, 245, 230, 0.75)";
            }
        });
        if (burgerBtn) {
            burgerBtn.onclick = () => {
                burgerBtn.classList.toggle('open');
                navLeft.classList.toggle('open');
            };
        }
    };

    window.openLegal = () => { 
        const m = document.getElementById('legalModal');
        if(m) { m.style.display = 'flex'; m.style.opacity = "1"; }
    };
    window.closeLegal = () => { 
        const m = document.getElementById('legalModal');
        if(m) { m.style.display = 'none'; }
    };

    restorePlayer();
    renderUI();
    handleNavbar();
    initContactForm();
});

