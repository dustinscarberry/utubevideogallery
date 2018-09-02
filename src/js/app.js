import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './component/Gallery/Gallery';
import Panel from './component/Panel/Panel';
import '../scss/app.scss';

let galleries = document.querySelectorAll('.utv-gallery');
let panels = document.querySelectorAll('.utv-panel');

panels.forEach(function(e)
{
  ReactDOM.render(
    <Panel
      id={e.getAttribute('data-id')}
      videosPerPage={e.getAttribute('data-videos-per-page')}
      controls={e.getAttribute('data-controls')}
      theme={e.getAttribute('data-theme')}
      icon={e.getAttribute('data-icon')}
    />, e);
});

galleries.forEach(function(e)
{
  ReactDOM.render(
    <Gallery
      id={e.getAttribute('data-id')}
    />
  , e);
});




























var utvFrontend = {};

utvFrontend.initialize = function($)
{
  utvFrontend.setupObjects($);
    utvFrontend.setupEvents($);
};

utvFrontend.setupEvents = function($)
{
  $(function()
  {
    var galleries = $('.utv-container');

    $.each(galleries, function(mark, data)
    {
      utvFrontend.memory.galleries.push(new utvFrontend.Gallery(data));
    });
  });
};

utvFrontend.setupObjects = function($)
{
  this.memory = {
    'galleries': new Array(),
    'thumbwidth': parseInt(utvJSData.thumbnailWidth),
    'thumbpadding': parseInt(utvJSData.thumbnailPadding)
  };

  this.Gallery = function(container)
  {
    //properties
    this.outercontainer = container;
    this.innercontainer = $(this.outercontainer).find('.utv-inner-wrapper');

    //methods
    this.setGalleryFlow = function()
    {
      var outerwidth = $(this.outercontainer).width();
      var blocks = Math.floor(outerwidth / (utvFrontend.memory.thumbwidth + (utvFrontend.memory.thumbpadding * 2)));
      var size = (utvFrontend.memory.thumbwidth + (utvFrontend.memory.thumbpadding * 2)) * blocks;
      $(this.innercontainer).css('width', size + 'px');
      $(this.outercontainer).removeClass('utv-invis');
    };

    //setup panel flow
    this.setGalleryFlow();

    //window resize event
    $(window).resize({'classRoot': this}, function(e)
    {
      e.data.classRoot.setGalleryFlow();
    });

    //window load event backup
    $(window).on('load', {'classRoot': this}, function(e)
    {
      e.data.classRoot.setGalleryFlow();
    });

    //video lightbox events
    $(this.outercontainer).on('click', 'a.utv-popup', function()
    {
      var url = $(this).attr('href');
      var title = $(this).attr('title');

      $.magnificPopup.open(
      {
        items: {src: url},
        type: 'iframe',
        iframe: {
          patterns: new Array(),
          markup: '<div class="utv-mfp-iframe-scaler mfp-iframe-scaler">'+
            '<div class="mfp-close"></div>'+
            '<iframe class="mfp-iframe" frameborder="0" width="' + utvJSData.playerWidth + '" height="' + utvJSData.playerHeight + '" allowfullscreen></iframe>'+
            '</div><div class="utv-mfp-bottom-bar">'+
            '<div class="mfp-title"></div></div>'
        },
        key: 'utvid',
        callbacks: {
          open: function() {
            $('.mfp-content').css('maxWidth', utvJSData.playerWidth + 'px');
            $('.mfp-title').text(title);
            var $bg = $('.mfp-bg');
            $bg.css('background', utvJSData.lightboxOverlayColor);
            $bg.css('opacity', utvJSData.lightboxOverlayOpacity);
          }
        }
      });

      return false;
    });
  };

};

//document.ready
(function($){utvFrontend.initialize($);})(jQuery);
