// Generated by CoffeeScript 1.9.3
var rot, runRotation, setupIcons, setupPlayPause, setupProfile, setupTitle, spinAndFill;

$(function() {
  var height, s, stuck, width;
  width = $(document).width();
  height = $(document).height();
  stuck = false;
  s = skrollr.init({
    constants: {
      music: height,
      bio: 2 * height,
      end: 3 * height
    }
  });
  $("#music-btn").click(function() {
    return s.animateTo(height, {
      duration: 1000,
      easing: "cubic"
    });
  });
  $("#bio-btn").click(function() {
    return s.animateTo(2 * height, {
      duration: 1000,
      easing: "cubic"
    });
  });
  return $.get("https://api.soundcloud.com/users/18472102/tracks.json?client_id=9d1cbd39001e5ab06a56ef60fce34af2", function(songs) {
    var $play, $wrapper, cleanTitles, cleanUris, hdUrls, i, j, ref, results, split, titles, uri, uris, urls;
    console.log(songs);
    split = Math.floor(songs.length / 2);
    urls = _.pluck(songs, 'artwork_url');
    hdUrls = _.map(urls, function(str) {
      return str.replace('large', 't500x500');
    });
    titles = _.pluck(songs, 'title');
    cleanTitles = _.map(titles, function(title) {
      return title.replace(/\(.+\)/, "").replace(/\[.+\]/, "").replace(/^.+-/, "");
    });
    uris = _.pluck(songs, 'uri');
    cleanUris = _.map(uris, function(uri) {
      return uri.replace(/^.*\.com/, "");
    });
    results = [];
    for (i = j = 0, ref = songs.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      $wrapper = $("<div class='song-wrapper' style='background-image:url(" + hdUrls[i] + ");'><p>" + cleanTitles[i] + "</p></div>");
      $play = $("<div class='song-play' src='imgs/play.png' alt='play'><svg viewBox='0 0 50 50'></svg></div>");
      uri = cleanUris[i];
      $play.attr("uri", uri);
      $play[0].anim = setupPlayPause($play.children("svg")[0]);
      $play.click(function() {
        var $parent, obj, state;
        $parent = $(this).parent();
        $('.song-wrapper').each(function() {
          if (!$(this).is($parent)) {
            return $(this).removeClass('playing').children('.song-play').each(function() {
              if (this.song !== void 0) {
                this.song.stop();
                return this.anim.reset();
              }
            });
          }
        });
        obj = this;
        if (this.song === void 0) {
          return SC.stream($(obj).attr("uri"), function(song) {
            obj.song = song;
            song.play();
            window.song = song;
            $parent.addClass('playing');
            return obj.anim.animatePlay();
          });
        } else {
          state = this.song.getState();
          if (state === "playing") {
            $parent.removeClass("playing");
            this.song.pause();
            return obj.anim.animatePause();
          } else if (state === "paused" || state === "seeking") {
            $parent.addClass("playing");
            this.song.play();
            return obj.anim.animatePlay();
          }
        }
      });
      $wrapper.append($play);
      results.push($(".music-row:eq(" + (Math.floor(i / split)) + ")").append($wrapper));
    }
    return results;
  });
});

rot = function(el, deg) {
  var bbox;
  bbox = el.getBBox();
  return "r" + deg + "," + bbox.cx + "," + bbox.cy;
};

setupPlayPause = function(el) {
  var obj, paper, pause, pauseFn, play, playFn, resetFn;
  paper = Snap(el);
  play = void 0;
  pause = void 0;
  Snap.load('imgs/playbutton.svg', function(f) {
    play = f.select('#play');
    paper.append(play);
    return play.attr({
      stroke: "none"
    });
  });
  Snap.load('imgs/pausebutton.svg', function(f) {
    pause = f.select('#pause');
    paper.append(pause);
    return pause.selectAll('path').attr({
      stroke: "none",
      "fill-opacity": "0"
    });
  });
  playFn = function() {
    play.attr({
      transform: rot(play, 0)
    });
    pause.attr({
      transform: rot(pause, 180)
    });
    play.animate({
      transform: rot(play, 180),
      "fill-opacity": '0'
    }, 250);
    pause.animate({
      transform: rot(pause, 360)
    }, 250);
    return pause.selectAll('path').animate({
      "fill-opacity": '1'
    }, 250);
  };
  pauseFn = function() {
    play.animate({
      transform: rot(play, 360),
      "fill-opacity": '1'
    }, 250);
    pause.animate({
      transform: rot(pause, 480)
    }, 250);
    return pause.selectAll('path').animate({
      "fill-opacity": '0'
    }, 250);
  };
  resetFn = function() {
    play.attr({
      transform: rot(play, 0),
      'fill-opacity': '1'
    });
    pause.attr({
      transform: rot(pause, 180)
    });
    return pause.selectAll('path').attr({
      'fill-opacity': '0'
    });
  };
  obj = {
    animatePlay: playFn,
    animatePause: pauseFn,
    reset: resetFn
  };
  return obj;
};

runRotation = function(el, radius, revolution, reverse) {
  if (reverse == null) {
    reverse = false;
  }
  if (reverse) {
    el.attr({
      "stroke-dashoffset": "" + (2 * Math.PI * radius)
    });
    return el.animate({
      "stroke-dashoffset": "0"
    }, revolution, function() {
      return runRotation(el, radius, revolution, reverse);
    });
  } else {
    return el.animate({
      "stroke-dashoffset": "" + (2 * Math.PI * radius)
    }, revolution, function() {
      el.attr({
        "stroke-dashoffset": "0"
      });
      return runRotation(el, radius, revolution, reverse);
    });
  }
};

setupTitle = function() {
  var image, logoPattern, paper;
  paper = Snap("#logo");
  image = paper.image("imgs/logo-background.jpg", 0, 0, 1200, 400).attr({
    opacity: 0
  });
  logoPattern = image.pattern(0, 0, 1200, 400);
  paper.append(logoPattern);
  return Snap.load("imgs/logo-c.svg", function(f) {
    var bbox, logo;
    logo = f.select('#logo');
    paper.append(logo);
    bbox = logo.getBBox();
    logo.attr({
      fill: "none",
      stroke: "#fff",
      "stroke-width": 2,
      "stroke-dasharray": "150 75"
    });
    logo.animate({
      "stroke-dasharray": "1200 400"
    }, 3000);
    return setTimeout(function() {
      var $btns;
      return $btns = $('.nav-btn').removeClass('hidden', 2000);
    });
  });
};

setupProfile = function() {
  var aventry, center, effect1, effect2, effect3, gray, image, paper;
  paper = Snap("#portrait");
  gray = paper.filter(Snap.filter.grayscale(1));
  image = paper.image("imgs/aventry.png", 50, 50, 400, 400).pattern();
  center = 250;
  aventry = paper.circle(center, center, 150).attr({
    fill: image
  });
  effect1 = paper.circle(center, center, 180).attr({
    stroke: "#34919C",
    "stroke-width": "5",
    fill: "none",
    "stroke-dasharray": (Math.PI * 180) + " " + (Math.PI * 180)
  });
  effect2 = paper.circle(center, center, 200).attr({
    stroke: "#D5DED7",
    "stroke-width": "5",
    fill: "none",
    "stroke-dasharray": (Math.PI * 200) + " " + (Math.PI * 200)
  });
  effect3 = paper.circle(center, center, 220).attr({
    stroke: "#FFE9AD",
    "stroke-width": "5",
    fill: "none",
    "stroke-dasharray": (Math.PI * 220) + " " + (Math.PI * 220)
  });
  runRotation(effect1, 180, 1500);
  runRotation(effect2, 200, 2000, true);
  return runRotation(effect3, 220, 3000);
};

spinAndFill = function(el, filler) {
  var bbox, cx, cy;
  el.attr({
    fill: filler
  });
  if (el.inAnim().length === 0) {
    bbox = el.getBBox();
    cx = bbox.cx;
    cy = bbox.cy;
    el.transform("r0," + cx + "," + cy);
    return el.animate({
      transform: "r360," + cx + "," + cy
    }, 1000, mina.bounce);
  }
};

setupIcons = function() {
  var fb, soundcloud, spotify;
  soundcloud = Snap("#soundcloud-icon");
  Snap.load("imgs/soundcloud-icon.svg", function(f) {
    var icon;
    icon = f.select('#icon');
    soundcloud.append(icon);
    return $('.icon-wrapper:has(#soundcloud-icon)').hover((function() {
      return spinAndFill(icon, "r()#ff7024-#FF5510");
    }), function() {
      return icon.attr({
        fill: "#000"
      });
    });
  });
  spotify = Snap("#spotify-icon");
  Snap.load("imgs/spotify-icon.svg", function(f) {
    var icon;
    icon = f.select('#icon');
    spotify.append(icon);
    return $('.icon-wrapper:has(#spotify-icon)').hover((function() {
      return spinAndFill(icon, "r()#95f205-#7DC211");
    }), function() {
      return icon.attr({
        fill: "#000"
      });
    });
  });
  fb = Snap('#fb-icon');
  return Snap.load("imgs/facebook-icon.svg", function(f) {
    var icon;
    icon = f.select('#icon');
    fb.append(icon);
    return $('.icon-wrapper:has(#fb-icon)').hover((function() {
      return spinAndFill(icon, "#3C5A99");
    }), function() {
      return icon.attr({
        fill: "#000"
      });
    });
  });
};

$(function() {
  setupTitle();
  setupIcons();
  return setupProfile();
});
