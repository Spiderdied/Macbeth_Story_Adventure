
/* app.js — renders the four views into #main and wires all interactions. */
(function () {
    'use strict';

    var M = window.MACBETH;
    var nav = M.nav;
    var story = M.story;
    var progress = M.progress;

    var main = document.getElementById('main');

    /* ---------------- helpers ---------------- */

    function esc(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    var ICONS = {
        lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
        chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
        chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
        play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
        pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
        crown: '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="M14 42 L17 22 L25 32 L32 18 L39 32 L47 22 L50 42 Z"/><rect x="14" y="45" width="36" height="4" rx="2"/></svg>',
        trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
        list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
    };

    function divider(parchment) {
        return '<div class="divider' + (parchment ? ' divider-parchment' : '') + '" aria-hidden="true"><span></span></div>';
    }

    /* ---------------- views ---------------- */

    function renderHome() {
        var p = progress.get();
        var hasProgress = p.completedScenes.length > 0 || p.last !== null;

        main.innerHTML =
            '<section class="view home" aria-label="Macbeth Story Adventure — welcome">' +
                '<div class="home-bg" aria-hidden="true">' +
                    '<img src="assets/images/hero-castle.jpg" alt="" loading="eager">' +
                    '<div class="fog"></div><div class="fog fog-2"></div>' +
                '</div>' +
                '<div class="home-content">' +
                    '<svg class="home-crown candle" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="M14 42 L17 22 L25 32 L32 18 L39 32 L47 22 L50 42 Z"/><rect x="14" y="45" width="36" height="4" rx="2"/><circle cx="17" cy="20" r="2.4"/><circle cx="32" cy="15.5" r="2.8"/><circle cx="47" cy="20" r="2.4"/></svg>' +
                    '<h1 class="home-title">MACBETH</h1>' +
                    '<p class="home-eyebrow">STORY ADVENTURE</p>' +
                    '<div style="margin-top:22px">' + divider() + '</div>' +

                    '<p class="home-sub-en" dir="ltr" lang="en">When ambition overrules conscience, the pursuit of power becomes the path to ruin, proving that no crown is worth the loss of one’s humanity.</p>' +
                    '<p class="home-sub-ar" dir="rtl" lang="ar">عندما تطغى الطموحات على الضمير، يتحول السعي وراء السلطة إلى طريق للهلاك، ليثبت أن لا عرش يستحق أن يفقد الإنسان إنسانيته من أجله.</p>' +

                    '<div class="home-actions">' +
                        '<button type="button" class="btn btn-gold btn-lg" data-action="begin">Begin the Adventure</button>' +
                        (hasProgress
                            ? '<button type="button" class="btn btn-gold-outline btn-lg" data-action="continue">Continue Journey ' + ICONS.chevR + '</button>'
                            : '') +
                    '</div>' +
                    '<div class="home-chips">' +
                        '<span class="chip">متنسوناش من صالح دعائكم</span>' +
                    '</div>' +
                '</div>' +
            '</section>';
    }

    function renderMap() {
        var total = story.total;
        var done = progress.completedCount();
        var allDone = total > 0 && done === total;

        var actsHtml = '';
        for (var i = 0; i < story.acts.length; i++) {
            var act = story.acts[i];
            var unlocked = story.isActUnlocked(act.actNumber);
            var actTotal = act.scenes.length;
            var actDone = story.actScenesCompleted(act.actNumber);
            var actComplete = actTotal > 0 && actDone === actTotal;

            var chips = '';
            for (var s = 0; s < act.scenes.length; s++) {
                var scene = act.scenes[s];
                var key = act.actNumber + '.' + scene.sceneNumber;
                var sceneDone = progress.isCompleted(key);
                var sceneUnlocked = story.isSceneUnlocked(key);
                var label = !sceneUnlocked
                    ? 'Scene ' + scene.sceneNumber + ' — locked'
                    : 'Scene ' + scene.sceneNumber + (sceneDone ? ' — completed' : '');

                chips +=
                    '<button type="button" class="scene-chip ' +
                    (sceneDone ? 'done' : sceneUnlocked ? '' : 'locked') + '" ' +
                    'data-action="open-scene" data-act="' + act.actNumber + '" data-scene="' + scene.sceneNumber + '" ' +
                    (sceneUnlocked ? '' : 'disabled ') + 'aria-label="' + esc(label) + '">' +
                    (sceneUnlocked
                        ? (sceneDone ? scene.sceneNumber + ' ' + ICONS.check : scene.sceneNumber)
                        : ICONS.lock) +
                    '</button>';
            }

            actsHtml +=
                '<article class="act-card' + (unlocked ? '' : ' locked') + '" aria-label="Act ' + story.roman(act.actNumber) + ' — ' + esc(act.taglineEn) + '">' +
                    '<div class="act-banner">' +
                        '<img src="' + story.actImage(act.actNumber) + '" alt="Atmospheric illustration for Act ' + story.roman(act.actNumber) + '" loading="lazy">' +
                        '<span class="act-numeral" aria-hidden="true">' + story.roman(act.actNumber) + '</span>' +
                        '<div class="act-banner-info">' +
                            '<div>' +
                                '<p class="act-eyebrow">ACT ' + story.roman(act.actNumber) + '</p>' +
                                '<h3 class="act-tagline">' + esc(act.taglineEn) + '</h3>' +
                            '</div>' +
                            (actComplete
                                ? '<span class="act-badge done">' + ICONS.check + ' Completed</span>'
                                : unlocked ? '' : '<span class="act-badge sealed">' + ICONS.lock + ' Sealed</span>') +
                        '</div>' +
                    '</div>' +
                    '<div class="act-body">' +
                        '<p class="act-desc-en">' + esc(act.descriptionEn) + '</p>' +
                        '<p class="act-desc-ar" dir="rtl" lang="ar">' + esc(act.descriptionAr) + '</p>' +
                        (actTotal > 0
                            ? '<div class="scene-chips">' + chips + '<span class="chip-count">' + actDone + ' / ' + actTotal + ' scenes</span></div>'
                            : '') +
                        '<div class="act-foot">' +
                            '<span class="act-foot-hint">' +
                                (unlocked
                                    ? actTotal > 0 ? actTotal + (actTotal > 1 ? ' scenes' : ' scene') + ' to explore' : 'This act is being inscribed…'
                                    : 'Complete the previous act to break this seal') +
                            '</span>' +
                            (unlocked && actTotal > 0
                                ? '<button type="button" class="btn btn-gold" data-action="open-act" data-act="' + act.actNumber + '">Enter Act ' + story.roman(act.actNumber) + ' ' + ICONS.chevR + '</button>'
                                : '<button type="button" class="btn btn-outline" disabled>' + ICONS.lock + ' Locked</button>') +
                        '</div>' +
                    '</div>' +
                '</article>';
        }

        main.innerHTML =
            '<section class="view container section-pad" aria-label="The adventure map — all five acts">' +
                '<div class="map-head">' +
                    '<p class="map-eyebrow">THE ADVENTURE MAP</p>' +
                    '<h2 class="map-title">Five Acts of Tragedy</h2>' +
                    '<p class="map-sub-ar" dir="rtl" lang="ar">خريطة الرحلة عبر فصول المأساة الخمسة</p>' +
                    '<div style="margin-top:16px">' + divider() + '</div>' +
                    '<div class="map-progress" role="status">' +
                        '<div class="map-progress-labels"><span class="it">Your journey through the play</span><span>' + done + ' / ' + total + ' scenes</span></div>' +
                        '<div class="map-progress-track"><div class="map-progress-fill" style="width:' + (total ? (done / total) * 100 : 0) + '%"></div></div>' +
                    '</div>' +
                    (allDone
                        ? '<div class="map-banner-done">' + ICONS.trophy +
                            '<span>The tragedy is complete — you have followed Macbeth from the storm-swept heath to the fall of the tyrant.</span></div>'
                        : '') +
                '</div>' +
                '<div class="acts">' + actsHtml + '</div>' +
            '</section>';
    }

    function renderAct() {
        var act = null;
        for (var i = 0; i < story.acts.length; i++) {
            if (story.acts[i].actNumber === nav.act) act = story.acts[i];
        }
        if (!act) {
            nav.goMap();
            return;
        }

        var actDone = story.actScenesCompleted(act.actNumber);
        var actTotal = act.scenes.length;

        var cards = '';
        for (var s = 0; s < act.scenes.length; s++) {
            var scene = act.scenes[s];
            var key = act.actNumber + '.' + scene.sceneNumber;
            var done = progress.isCompleted(key);
            var unlocked = story.isSceneUnlocked(key);

            cards +=
                '<article class="scene-card' + (unlocked ? '' : ' locked') + '" aria-label="Act ' + story.roman(act.actNumber) + ', Scene ' + scene.sceneNumber + ' — ' + esc(scene.locationEn) + '">' +
                    '<div class="scene-medal ' + (done ? 'done' : unlocked ? '' : 'locked') + '" aria-hidden="true">' +
                        (done ? ICONS.check : unlocked ? scene.sceneNumber : ICONS.lock) +
                    '</div>' +
                    '<div class="scene-info">' +
                        '<div class="scene-title-row">' +
                            '<h3 class="scene-title">Scene ' + scene.sceneNumber + '</h3>' +
                            '<span class="scene-location">' + ICONS.pin + ' ' + esc(scene.locationEn) + '</span>' +
                        '</div>' +
                        '<p class="scene-location-ar" dir="rtl" lang="ar">' + esc(scene.locationAr) + '</p>' +
                        '<p class="scene-preview-en">' + esc(scene.previewEn) + '</p>' +
                        '<p class="scene-preview-ar" dir="rtl" lang="ar">' + esc(scene.previewAr) + '</p>' +
                    '</div>' +
                    '<div class="scene-cta">' +
                        (unlocked
                            ? (done
                                ? '<button type="button" class="btn btn-outline" data-action="open-scene" data-act="' + act.actNumber + '" data-scene="' + scene.sceneNumber + '">' + ICONS.play + ' Review Scene</button>'
                                : '<button type="button" class="btn btn-gold" data-action="open-scene" data-act="' + act.actNumber + '" data-scene="' + scene.sceneNumber + '">Enter Scene ' + ICONS.chevR + '</button>')
                            : '<button type="button" class="btn btn-outline" disabled>' + ICONS.lock + ' Locked</button>' +
                                '<span class="lock-hint">Finish Scene ' + (scene.sceneNumber - 1) + ' first</span>') +
                    '</div>' +
                '</article>';
        }

        main.innerHTML =
            '<section class="view container section-pad" aria-label="Act ' + story.roman(act.actNumber) + ' — scene selection">' +
                '<button type="button" class="btn btn-ghost btn-sm back-btn" data-action="map">' + ICONS.chevL + ' Adventure Map</button>' +
                '<header class="act-header">' +
                    '<div class="act-banner">' +
                        '<img src="' + story.actImage(act.actNumber) + '" alt="Atmospheric illustration for Act ' + story.roman(act.actNumber) + '">' +
                        '<span class="act-numeral" aria-hidden="true">' + story.roman(act.actNumber) + '</span>' +
                        '<div class="act-banner-info"><div>' +
                            '<p class="act-eyebrow">ACT ' + story.roman(act.actNumber) + '</p>' +
                            '<h2 class="act-tagline">' + esc(act.taglineEn) + '</h2>' +
                        '</div></div>' +
                    '</div>' +
                    '<div class="act-body">' +
                        '<p class="act-desc-en">' + esc(act.descriptionEn) + '</p>' +
                        '<p class="act-desc-ar" dir="rtl" lang="ar">' + esc(act.taglineAr) + ' — ' + esc(act.descriptionAr) + '</p>' +
                        (actTotal > 0
                            ? '<div class="map-progress" style="max-width:20rem;margin-top:16px;text-align:left">' +
                                '<div class="map-progress-labels"><span>' + actDone + ' / ' + actTotal + ' scenes</span></div>' +
                                '<div class="map-progress-track"><div class="map-progress-fill" style="width:' + (actTotal ? (actDone / actTotal) * 100 : 0) + '%"></div></div>' +
                            '</div>'
                            : '') +
                    '</div>' +
                '</header>' +
                (actTotal === 0
                    ? '<p style="margin-top:40px;text-align:center;font-family:var(--font-serif);font-style:italic;color:var(--mist)">The scrolls of this act are still being inscribed — return soon.</p>'
                    : '<div class="scene-list">' + cards + '</div>') +
                '<div style="margin-top:40px">' + divider() + '</div>' +
            '</section>';
    }

    function renderScene() {
        var ref = story.getScene(nav.act, nav.scene);
        if (!ref) {
            main.innerHTML =
                '<div class="view empty-state">' +
                    '<p style="font-family:var(--font-serif);font-style:italic;color:var(--mist)">This scene has not been inscribed yet. Return to the map and continue your journey elsewhere.</p>' +
                    '<button type="button" class="btn btn-gold-outline" data-action="map" style="margin-top:16px">Adventure Map</button>' +
                '</div>';
            return;
        }

        var scene = ref.scene;
        var total = scene.segments.length;
        var mode = progress.get().langMode;
        var hasNext = !!story.next(ref.key);

        /* --- completion screen --- */
        if (nav.finished) {
            main.innerHTML =
                '<section class="view reader" aria-label="Act ' + story.roman(ref.actNumber) + ', Scene ' + ref.sceneNumber + ' — complete">' +
                    '<div class="completion">' +
                        '<div class="completion-crown candle">' + ICONS.crown + '</div>' +
                        '<h3 class="completion-title">Scene Complete</h3>' +
                        '<p class="completion-meta">Act ' + story.roman(ref.actNumber) + ', Scene ' + ref.sceneNumber + '</p>' +
                        '<div style="margin-top:14px">' + divider() + '</div>' +
                        '<div class="parchment" style="text-align:start;margin-top:24px">' +
                            '<p class="parchment-label">SCENE RECAP</p>' +
                            (mode !== 'ar' ? '<p class="narration-en" dir="ltr" lang="en">' + esc(scene.recapEn) + '</p>' : '') +
                            (mode === 'both' ? divider(true) : '') +
                            (mode !== 'en' ? '<p class="narration-ar" dir="rtl" lang="ar">' + esc(scene.recapAr) + '</p>' : '') +
                        '</div>' +
                        '<div class="completion-actions">' +
                            '<button type="button" class="btn btn-outline btn-lg" data-action="open-act" data-act="' + ref.actNumber + '">' + ICONS.list + ' Return to Scenes</button>' +
                            (hasNext
                                ? '<button type="button" class="btn btn-gold btn-lg" data-action="next-scene">Next Scene ' + ICONS.chevR + '</button>'
                                : '<button type="button" class="btn btn-danger btn-lg" data-action="map">' + ICONS.crown + ' Finish the Adventure</button>') +
                        '</div>' +
                        '<p class="completion-count">' + progress.completedCount() + ' / ' + story.total + ' scenes complete</p>' +
                    '</div>' +
                '</section>';
            return;
        }

        /* --- reader --- */
        var seg = scene.segments[Math.min(nav.segment, total - 1)];
        var isLast = nav.segment === total - 1;

        var dots = '';
        for (var i = 0; i < total; i++) {
            dots += '<span class="' + (i <= nav.segment ? 'on' : '') + '"></span>';
        }

        main.innerHTML =
            '<section class="view reader" aria-label="Act ' + story.roman(ref.actNumber) + ', Scene ' + ref.sceneNumber + ' — story reader">' +
                '<button type="button" class="btn btn-ghost btn-sm back-btn" data-action="open-act" data-act="' + ref.actNumber + '">' + ICONS.chevL + ' Act ' + story.roman(ref.actNumber) + ' Scenes</button>' +
                '<div class="reader-head">' +
                    '<p class="reader-eyebrow">ACT ' + story.roman(ref.actNumber) + ' &middot; SCENE ' + ref.sceneNumber + '</p>' +
                    '<h2 class="reader-location">' + esc(scene.locationEn) + '</h2>' +
                    '<p class="reader-location-ar" dir="rtl" lang="ar">' + esc(scene.locationAr) + '</p>' +
                    '<div class="reader-progress">' +
                        '<div class="reader-progress-labels">' +
                            '<span class="part">PART ' + (nav.segment + 1) + ' OF ' + total + '</span>' +
                            '<span aria-hidden="true">' + (mode === 'ar' ? 'استخدم ← → للتنقل' : 'use &larr; &rarr; to navigate') + '</span>' +
                        '</div>' +
                        '<div class="reader-dots" role="progressbar" aria-valuemin="1" aria-valuemax="' + total + '" aria-valuenow="' + (nav.segment + 1) + '" aria-label="Part ' + (nav.segment + 1) + ' of ' + total + '">' + dots + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="parchment">' +
                    '<p class="parchment-label">PART ' + (nav.segment + 1) + ' OF ' + total + '</p>' +
                    (mode !== 'ar'
                        ? '<p class="narration-en drop-cap" dir="ltr" lang="en">' + esc(seg.en) + '</p>'
                        : '') +
                    (mode === 'both' ? divider(true) : '') +
                    (mode !== 'en'
                        ? '<p class="narration-ar" dir="rtl" lang="ar">' + esc(seg.ar) + '</p>'
                        : '') +
                '</div>' +
                '<div class="reader-controls">' +
                    '<div class="lang-toggle" role="group" aria-label="Language display mode">' +
                        '<button type="button" class="lang-btn" data-action="lang" data-mode="both" aria-pressed="' + (mode === 'both') + '" aria-label="Show both English and Arabic">Both</button>' +
                        '<button type="button" class="lang-btn" data-action="lang" data-mode="en" aria-pressed="' + (mode === 'en') + '" aria-label="Show English only">English</button>' +
                        '<button type="button" class="lang-btn ar" data-action="lang" data-mode="ar" aria-pressed="' + (mode === 'ar') + '" aria-label="عرض العربية فقط">العربية</button>' +
                    '</div>' +
                    '<div class="reader-nav">' +
                        '<button type="button" class="btn btn-outline btn-lg" data-action="prev" ' + (nav.segment === 0 ? 'disabled' : '') + ' aria-label="Go to the previous part">' + ICONS.chevL + ' Previous Part</button>' +
                        (isLast
                            ? '<button type="button" class="btn btn-danger btn-lg" data-action="finish">' + ICONS.check + ' Complete Scene</button>'
                            : '<button type="button" class="btn btn-gold btn-lg" data-action="next" aria-label="Go to the next part">Next Part ' + ICONS.chevR + '</button>') +
                    '</div>' +
                '</div>' +
            '</section>';
    }

    /* ---------------- routing ---------------- */

    function render() {
        switch (nav.view) {
            case 'map':
                renderMap();
                break;
            case 'act':
                renderAct();
                break;
            case 'scene':
                renderScene();
                break;
            default:
                renderHome();
                break;
        }
    }

    /* ---------------- events ---------------- */

    document.addEventListener('click', function (e) {
        var el = e.target.closest ? e.target.closest('[data-action]') : null;
        if (!el || el.disabled) return;
        var action = el.getAttribute('data-action');

        switch (action) {
            case 'begin':
                nav.openScene(1, 1, 0);
                break;
            case 'continue': {
                var last = progress.get().last;
                if (last) nav.openScene(last.act, last.scene, last.segment);
                else nav.openScene(1, 1, 0);
                break;
            }
            case 'map':
                nav.goMap();
                break;
            case 'open-act':
                nav.openAct(parseInt(el.getAttribute('data-act'), 10));
                break;
            case 'open-scene':
                nav.openScene(parseInt(el.getAttribute('data-act'), 10), parseInt(el.getAttribute('data-scene'), 10), 0);
                break;
            case 'next':
                nav.setSegment(nav.segment + 1);
                break;
            case 'prev':
                nav.setSegment(nav.segment - 1);
                break;
            case 'lang': {
                var mode = el.getAttribute('data-mode');
                progress.setLangMode(mode);
                render();
                nav.syncChrome();
                break;
            }
            case 'finish': {
                progress.completeScene(nav.act, nav.scene);
                nav.setFinished(true);
                break;
            }
            case 'next-scene': {
                var ref = story.getScene(nav.act, nav.scene);
                var next = ref ? story.next(ref.key) : null;
                if (next) nav.openScene(next.actNumber, next.sceneNumber, 0);
                break;
            }
        }
    });

    /* Keyboard: ← / → navigate parts inside the reader */
    document.addEventListener('keydown', function (e) {
        if (nav.view !== 'scene' || nav.finished) return;
        var ref = story.getScene(nav.act, nav.scene);
        if (!ref) return;

        if (e.key === 'ArrowRight' && nav.segment < ref.scene.segments.length - 1) {
            e.preventDefault();
            nav.setSegment(nav.segment + 1);
        } else if (e.key === 'ArrowLeft' && nav.segment > 0) {
            e.preventDefault();
            nav.setSegment(nav.segment - 1);
        }
    });

    /* Navbar buttons */
    document.getElementById('brand-btn').addEventListener('click', function () {
        nav.goHome();
    });

    document.getElementById('map-btn').addEventListener('click', function () {
        nav.goMap();
    });

    /* Reset dialog */
    var resetDialog = document.getElementById('reset-dialog');
    var lastFocused = null;

    document.getElementById('reset-btn').addEventListener('click', function () {
        lastFocused = document.activeElement;
        resetDialog.hidden = false;
        document.getElementById('confirm-reset').focus();
    });

    function closeReset() {
        resetDialog.hidden = true;
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.getElementById('cancel-reset').addEventListener('click', closeReset);

    resetDialog.addEventListener('click', function (e) {
        if (e.target === resetDialog) closeReset();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !resetDialog.hidden) closeReset();
    });

    document.getElementById('confirm-reset').addEventListener('click', function () {
        progress.reset();
        closeReset();
        nav.goHome();
    });

    /* ---------------- boot ---------------- */

    progress.init();

    nav.onChange(function () {
        render();
    });

    render();
    nav.syncChrome();
})();
