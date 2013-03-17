(function() {
  var checkForRequire, libs, services, loadLibs, server, sourceImage;

  server = 'http://romansixty.github.com/src-img/';

  libs = [
    'http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js',
    server + "/js/lib/URI.js"
  ];

  // image search services, %s is the encoded URL of the image to find
  services = {
    Google: 'http://images.google.com/searchbyimage?image_url=%s',
    TinEye: 'http://tineye.com/search?pluginver=bookmark_1.0&url=%s',
    IQDB:   'http://iqdb.org/?url=%s'
  }

  sourceImage = {
    exit: function(e) {
      $('span.src-img').remove();
      $('a.src-img-close').remove();
      e.preventDefault();
    },
    init: function() {
      var $style, close, count, flickrHost,
        _this = this;
      $style = $('<link>');
      $style.attr({
        rel: 'stylesheet',
        href: server + "/css/bookmarklet.css",
        type: 'text/css'
      });
      $('head').append($style);
      count = 0;
      flickrHost = /flickr.com/i.test(window.location.hostname);
      $.each($('img'), function(index, img) {
        var $img, flickrID, searchUrl, src,
          servicelinks = [];
        $img = $(img);
        if ($img.height() < 100 || $img.width() < 100) return;
        count++;
        src = $img.attr('src');
        if (src.indexOf('http' < 0)) src = absolutizeURI(window.location, src);

        // if it's an image from Flickr, we show its original position
        flickrID = /static.?flickr.com\/([0-9]*)\/([0-9]*)/i.exec(src);
        if (flickrID && !flickrHost) {
          servicelinks.push('<a href="http://www.flickr.com/photo.gne?id=' + flickrID[2] + '" target="_blank">Flickr</a>');
        }
        for (var i in services) {
          servicelinks.push('<a href="' + services[i].replace(/%s/, escape(src)) + '" target="_blank">' + i + '</a>');
        }

        // append src-img box
        servicelinks = servicelinks.join(' ');
        $('body').append('<span class="src-img" style="width:'  + ($img.width())  + 'px;' +
                                                      'height:' + ($img.height()) + 'px;' +
                                                      'top:'    + ($img.offset().top)  + 'px;' +
                                                      'left:'   + ($img.offset().left) + 'px;">' +
        '<span>&#63;&iquest;<br/>' +
        servicelinks +
        '</span>' +
        '</span>');
      });
      if (count === 0) {
        alert('I couldn\'t find any images :(');
        return;
      }
      close = $('<a href="#" class="src-img-close">&times;</a>').bind('click', _this.exit);
      $('body').append(close);
    }
  };

  loadLibs = function() {
    require(libs, function() {
      sourceImage.init();
    });
  };

  checkForRequire = function() {
    if (typeof require !== "undefined" && require !== null) {
      loadLibs();
      clearInterval(this.requireInt);
    } else {
      this.requireInt = setTimeout(checkForRequire, 100);
    }
  };

  checkForRequire();

}).call(this);
