/* 
 Modified version of the jQuery sparkle plugin
 Link: https://www.jqueryscript.net/animation/Custom-Sparkle-Animations-With-jQuery-SVG-Sparkle.html
*/
(function($, window, document) {

  $.fn.sparkle = function(options) {
    $.destroySparkle = $.destroySparkle || {};
    var id = this.data("sparkle-id") || (new Date()).getTime() + Math.random();
    
    if (options === "destroy" && this.find("svg").length > 0) {
      $.destroySparkle[id] = true;
      this.data("sparkle-id", null);
    }

    var $this = this;
    var settings = $.extend({
      fill: "#fff",
      stroke: "#000",
      size: 20,
      delay: 0,
      duration: 1500,
      pause: 1000,
      startTop: null,
      startLeft: null,
    }, options);
    var cssAnimationAttr = "my-sparkle " + settings.duration + "ms linear";

    var $star = $('<svg class="my-sparkle" version="1.1" viewBox="0.0 0.0 50.0 50.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="p.0"><path d="m0 0l50.0 0l0 50.0l-50.0 0l0 -50.0z" clip-rule="nonzero"></path></clipPath><g clip-path="url(#p.0)"><path fill="' + settings.stroke + '" fill-opacity="0.0" d="m0 0l50.0 0l0 50.0l-50.0 0z" fill-rule="nonzero"></path><path fill="' + settings.fill + '" d="m0.62204725 25.0l20.068499 -4.323374l4.309454 -20.13332l4.309454 20.13332l20.068499 4.323374l-20.068499 4.323374l-4.309454 20.133318l-4.309454 -20.133318z" fill-rule="nonzero"></path><path stroke="' + settings.stroke + '" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m0.62204725 25.0l20.068499 -4.323374l4.309454 -20.13332l4.309454 20.13332l20.068499 4.323374l-20.068499 4.323374l-4.309454 20.133318l-4.309454 -20.133318z" fill-rule="nonzero"></path></g></svg>').css({
        position: "absolute",
        width: settings.size,
        height: settings.size,
        zIndex: 9999
    });

    var w = $('#kor-container').width();
    var h = $('#kor-container').height();

    var getCoordinates = function() {
      // Calculate the coordinates based on the specified startTop and startLeft
      var left = (settings.startLeft !== null) ? settings.startLeft : Math.random() * w;
      var top = (settings.startTop !== null) ? settings.startTop : Math.random() * h;

      return {
        left: left,
        top: top
      };
    };

    var placeStar = function(init) {
      var coords = getCoordinates();

      if (init) {
        $this.append($star);
      }

      $star.css({
        "-moz-animation": cssAnimationAttr,
        "-webkit-animation": cssAnimationAttr,
        animation: cssAnimationAttr,
        display: "block",
        left: coords.left,
        top: coords.top
      });

      window.setTimeout(function() {
        $star.css({
          "-moz-animation": null,
          "-webkit-animation": null,
          animation: null,
          display: "none"
        });
        
        if (!$.destroySparkle[id]) {
        } else {
          $star.remove();
        }
      }, settings.duration);
    };

    if (this.css("position") === "static") {
      this.css("position", "relative");
    }

    if (!$.destroySparkle[id]) {
      window.setTimeout(function() {
        placeStar(true);
      }, settings.delay);

      this.data("sparkle-id", id);
    }

    return this;
  };

})(jQuery, window, document);
