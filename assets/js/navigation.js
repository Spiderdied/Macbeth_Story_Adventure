/* navigation.js — view state machine + browser-level concerns.
   Views: 'home' | 'map' | 'act' | 'scene' */
(function () {
  'use strict';

  var nav = {
    view: 'home',
    act: 1,
    scene: 1,
    segment: 0,
    finished: false,

    listeners: [],

    /* subscribe to any navigation change; callback receives (nav) */
    onChange: function (cb) {
      this.listeners.push(cb);
    },

    emit: function () {
      for (var i = 0; i < this.listeners.length; i++) this.listeners[i](this);
      this.syncChrome();
      window.scrollTo(0, 0);
    },

    goHome: function () {
      this.view = 'home';
      this.emit();
    },

    goMap: function () {
      this.view = 'map';
      this.emit();
    },

    openAct: function (actNumber) {
      this.view = 'act';
      this.act = actNumber;
      this.emit();
    },

    openScene: function (actNumber, sceneNumber, segment, finished) {
      this.view = 'scene';
      this.act = actNumber;
      this.scene = sceneNumber;
      this.segment = segment || 0;
      this.finished = !!finished;
      window.MACBETH.progress.savePosition(actNumber, sceneNumber, this.segment);
      this.emit();
    },

    setSegment: function (segment) {
      var ref = window.MACBETH.story.getScene(this.act, this.scene);
      var total = ref ? ref.scene.segments.length : 1;
      this.segment = Math.max(0, Math.min(segment, total - 1));
      this.finished = false;
      window.MACBETH.progress.savePosition(this.act, this.scene, this.segment);
      this.emit();
    },

    setFinished: function (finished) {
      this.finished = !!finished;
      this.emit();
      if (this.finished) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    /* ---- navbar / breadcrumb sync ---- */
    syncChrome: function () {
      var story = window.MACBETH.story;
      var ref = this.view === 'scene' ? story.getScene(this.act, this.scene) : null;
      var loc = document.getElementById('location-text');
      var map = {
        home: 'The Gates of the Adventure',
        map: 'The Adventure Map',
        act: 'Act ' + story.roman(this.act),
      };
      if (this.view === 'scene') {
        var part = ref && ref.scene.segments.length
          ? ' · Part ' + Math.min(this.segment + 1, ref.scene.segments.length) + ' of ' + ref.scene.segments.length
          : '';
        map.scene = 'Act ' + story.roman(this.act) + ' · Scene ' + this.scene + (this.finished ? '' : part);
      }
      if (loc) loc.textContent = map[this.view] || '';

      var total = story.total;
      var done = window.MACBETH.progress.completedCount();
      var fill = document.getElementById('progress-fill');
      var count = document.getElementById('progress-count');
      if (fill) fill.style.width = (total ? (done / total) * 100 : 0) + '%';
      if (count) count.textContent = done + '/' + total;
    },
  };

  window.MACBETH = window.MACBETH || {};
  window.MACBETH.nav = nav;
})();
