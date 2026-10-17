/* story.js — aggregation of act data and unlock rules.
   The five data files (assets/js/data/act1..5.js) run before this script and
   populate window.MACBETH_ACTS in source order (7 + 4 + 6 + 3 + 8 = 28 scenes). */
(function () {
  'use strict';

  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];
  var acts = (window.MACBETH_ACTS || []).slice().sort(function (a, b) {
    return a.actNumber - b.actNumber;
  });

  /* Global order of every scene in the play. */
  var order = [];
  for (var a = 0; a < acts.length; a++) {
    for (var s = 0; s < acts[a].scenes.length; s++) {
      order.push({
        key: acts[a].actNumber + '.' + acts[a].scenes[s].sceneNumber,
        actNumber: acts[a].actNumber,
        sceneNumber: acts[a].scenes[s].sceneNumber,
        act: acts[a],
        scene: acts[a].scenes[s],
        index: order.length,
      });
    }
  }

  function getScene(actNumber, sceneNumber) {
    for (var i = 0; i < order.length; i++) {
      if (order[i].actNumber === actNumber && order[i].sceneNumber === sceneNumber) return order[i];
    }
    return null;
  }

  function getAdjacent(key, delta) {
    for (var i = 0; i < order.length; i++) {
      if (order[i].key === key) {
        var j = i + delta;
        return j >= 0 && j < order.length ? order[j] : null;
      }
    }
    return null;
  }

  /* Scene unlocked if first in the play, or the previous scene is completed. */
  function isSceneUnlocked(key) {
    var completed = window.MACBETH.progress.isCompleted;
    for (var i = 0; i < order.length; i++) {
      if (order[i].key === key) {
        if (i === 0) return true;
        return completed(order[i - 1].key);
      }
    }
    return false;
  }

  /* Act unlocked if first, or every scene of the previous act is completed. */
  function isActUnlocked(actNumber) {
    if (actNumber <= 1) return true;
    for (var a = 0; a < acts.length; a++) {
      if (acts[a].actNumber === actNumber - 1) {
        if (acts[a].scenes.length === 0) return false;
        for (var s = 0; s < acts[a].scenes.length; s++) {
          if (!window.MACBETH.progress.isCompleted(acts[a].actNumber + '.' + acts[a].scenes[s].sceneNumber)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  function actScenesCompleted(actNumber) {
    var count = 0;
    for (var a = 0; a < acts.length; a++) {
      if (acts[a].actNumber !== actNumber) continue;
      for (var s = 0; s < acts[a].scenes.length; s++) {
        if (window.MACBETH.progress.isCompleted(acts[a].actNumber + '.' + acts[a].scenes[s].sceneNumber)) count++;
      }
    }
    return count;
  }

  window.MACBETH = window.MACBETH || {};
  window.MACBETH.story = {
    acts: acts,
    order: function () { return order; },
    total: order.length,
    roman: function (n) { return ROMAN[n] || ''; },
    getScene: getScene,
    next: function (key) { return getAdjacent(key, 1); },
    prev: function (key) { return getAdjacent(key, -1); },
    isSceneUnlocked: isSceneUnlocked,
    isActUnlocked: isActUnlocked,
    actScenesCompleted: actScenesCompleted,
    actImage: function (n) { return 'assets/images/act-' + n + '.jpg'; },
  };
})();
