/* progress.js — localStorage-backed progress with a safe in-memory fallback.
   Shared contract:
   - MACBETH.progress.get()            → { completedScenes: [], last: null, langMode: 'both' }
   - MACBETH.progress.savePosition(a, s, seg)
   - MACBETH.progress.completeScene(a, s)
   - MACBETH.progress.setLangMode(mode)
   - MACBETH.progress.reset() */
(function () {
  'use strict';

  var STORAGE_KEY = 'macbeth-adventure-v1';
  var DEFAULTS = { completedScenes: [], last: null, langMode: 'both' };

  /* ---- safe storage (private mode / blocked / full) ---- */
  var memory = {};
  var storageWorks = (function () {
    try {
      var t = '__macbeth_probe__';
      window.localStorage.setItem(t, t);
      window.localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function readRaw() {
    if (storageWorks) {
      try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return memory[STORAGE_KEY] || null; }
    }
    return memory[STORAGE_KEY] || null;
  }

  function writeRaw(value) {
    if (storageWorks) {
      try { window.localStorage.setItem(STORAGE_KEY, value); return; } catch (e) { /* fall through */ }
    }
    memory[STORAGE_KEY] = value;
  }

  function clearRaw() {
    if (storageWorks) {
      try { window.localStorage.removeItem(STORAGE_KEY); return; } catch (e) { /* fall through */ }
    }
    delete memory[STORAGE_KEY];
  }

  /* ---- validation against the real story data ---- */
  function sanitize(raw) {
    var result = { completedScenes: [], last: null, langMode: 'both' };
    if (!raw || typeof raw !== 'object') return result;

    var order = window.MACBETH.story.order();
    var validKeys = {};
    for (var i = 0; i < order.length; i++) validKeys[order[i].key] = order[i];

    if (Array.isArray(raw.completedScenes)) {
      var seen = {};
      for (var j = 0; j < raw.completedScenes.length; j++) {
        var k = raw.completedScenes[j];
        if (typeof k === 'string' && validKeys[k] && !seen[k]) {
          seen[k] = true;
          result.completedScenes.push(k);
        }
      }
    }

    if (raw.last && typeof raw.last === 'object' &&
        typeof raw.last.act === 'number' && typeof raw.last.scene === 'number' &&
        typeof raw.last.segment === 'number') {
      var ref = window.MACBETH.story.getScene(raw.last.act, raw.last.scene);
      if (ref) {
        var segCount = ref.scene.segments.length;
        var seg = Math.min(Math.max(0, Math.floor(raw.last.segment)), Math.max(0, segCount - 1));
        result.last = { act: ref.actNumber, scene: ref.sceneNumber, segment: seg };
      }
    }

    if (raw.langMode === 'en' || raw.langMode === 'ar' || raw.langMode === 'both') {
      result.langMode = raw.langMode;
    }
    return result;
  }

  var state;

  function init() {
    var raw = readRaw();
    if (raw) {
      try { state = sanitize(JSON.parse(raw)); }
      catch (e) { state = { completedScenes: [], last: null, langMode: 'both' }; }
    } else {
      state = { completedScenes: [], last: null, langMode: 'both' };
    }
  }

  function persist() {
    try { writeRaw(JSON.stringify(state)); } catch (e) { /* keep in memory */ }
  }

  window.MACBETH = window.MACBETH || {};

  window.MACBETH.progress = {
    init: init,
    get: function () {
      return {
        completedScenes: state.completedScenes.slice(),
        last: state.last ? { act: state.last.act, scene: state.last.scene, segment: state.last.segment } : null,
        langMode: state.langMode,
      };
    },
    isCompleted: function (key) {
      return state.completedScenes.indexOf(key) !== -1;
    },
    completedCount: function () {
      return state.completedScenes.length;
    },
    savePosition: function (act, scene, segment) {
      if (state.last && state.last.act === act && state.last.scene === scene && state.last.segment === segment) return;
      state.last = { act: act, scene: scene, segment: segment };
      persist();
    },
    completeScene: function (act, scene) {
      var key = act + '.' + scene;
      if (state.completedScenes.indexOf(key) !== -1) return;
      state.completedScenes.push(key);
      persist();
    },
    setLangMode: function (mode) {
      if (mode !== 'both' && mode !== 'en' && mode !== 'ar') return;
      if (state.langMode === mode) return;
      state.langMode = mode;
      persist();
    },
    reset: function () {
      state = { completedScenes: [], last: null, langMode: 'both' };
      clearRaw();
    },
  };
})();
