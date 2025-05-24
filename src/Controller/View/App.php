<?php
/**
 * Dscarberry\UTubeVideoGallery\UI - Frontend for uTubeVideo Gallery
 *
 * @package uTubeVideo Gallery
 * @author Dustin Scarberry
 *
 * @since 1.3
 */

namespace Dscarberry\UTubeVideoGallery\Controller\View;

use Dscarberry\UTubeVideoGallery\UI\PanelUI;
use Dscarberry\UTubeVideoGallery\UI\GalleryUI;

class App
{
  private $options;

  function __construct()
  {
    // load plugin options
    $this->options = get_option('utubevideo_main_opts');

    // add hooks
    add_shortcode('utubevideo', [$this, 'shortcode']);
    add_action('wp_enqueue_scripts', [$this, 'loadJS']);
    add_action('wp_enqueue_scripts', [$this, 'loadCSS']);

    // check for extra lightbox script inclusion
    if ($this->options['skipMagnificPopup'] == 'no')
      add_action('wp_enqueue_scripts', [$this, 'addLightboxScripts']);
  }

  // load css
  function loadCSS()
  {
    // app css
    wp_enqueue_style(
      'utv-app-css',
      plugins_url('../../../public/css/app.min.css', __FILE__),
      false,
      CC_UTUBEVIDEOGALLERY_VERSION
    );
    wp_enqueue_style(
      'font-awesome',
      'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css'
    );

    // add embedded thumbnail sizing css
    $css = '.utv-panel-thumbnails,.utv-gallery-thumbnails{grid-gap:' . $this->options['thumbnailPadding'] . 'px;grid-template-columns: repeat(auto-fill,minmax(' . $this->options['thumbnailWidth'] . 'px,1fr))}.utv-panel-thumbnails{padding:' . $this->options['thumbnailPadding'] . 'px}';

    // add thumbnail border radius if defined
    if ($this->options['thumbnailBorderRadius'] > 0)
      $css .= '.utv-thumbnail>a,.utv-thumbnail img{border-radius:' . $this->options['thumbnailBorderRadius'] . 'px!important}';

    wp_add_inline_style('utv-app-css', $css);
  }

  // load js
  function loadJS()
  {
    // babel polyfill fallback
    /*if (!wp_script_is('wp-polyfill', 'registered'))
      wp_enqueue_script(
        'babel-polyfill',
        'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.11.5/polyfill.min.js',
        null,
        false,
        true
      );
    else
      wp_enqueue_script('wp-polyfill');
    */

    $embeddedJS = [
      'setting' => [
        'thumbnailWidth' => $this->options['thumbnailWidth'],
        'thumbnailPadding' => $this->options['thumbnailPadding'],
        'playerWidth' => $this->options['playerWidth'],
        'playerHeight' => $this->options['playerHeight'],
        'lightboxOverlayColor' => $this->options['fancyboxOverlayColor'],
        'lightboxOverlayOpacity' => $this->options['fancyboxOverlayOpacity'],
        'playerControlTheme' => $this->options['playerControlTheme'],
        'playerProgressColor' => $this->options['playerProgressColor'],
        'youtubeAutoplay' => $this->options['youtubeAutoplay'],
        'vimeoAutoplay' => $this->options['vimeoAutoplay'],
        'youtubeDetailsHide' => $this->options['youtubeDetailsHide'],
        'vimeoDetailsHide' => $this->options['vimeoDetailsHide'],
        'showVideoDescription' => $this->options['showVideoDescription']
      ],
      'localization' => [
        'albums' => __('Albums', 'utvg')
      ]
    ];

    wp_enqueue_script(
      'utv-app-js',
      plugins_url('../../../public/js/app.min.js', __FILE__),
      ['jquery'],
      CC_UTUBEVIDEOGALLERY_VERSION,
      true
    );

    wp_localize_script('utv-app-js', 'utvJSData', $embeddedJS);
  }

  //load jquery and lightbox js / css
  function addLightboxScripts()
  {
    wp_enqueue_script('jquery');
    wp_enqueue_script(
      'dscarberry-mp-js',
      'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js',
      ['jquery'],
      null,
      true
    );
    wp_enqueue_style(
      'dscarberry-mp-css',
      'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css',
      false,
      null
    );
  }

  function shortcode($atts)
  {
    // panel
    if (isset($atts['view']) && $atts['view'] == 'panel') {
      $panel = new PanelUI($atts);
      return $panel->render();
    }
    // gallery
    else {
      $gallery = new GalleryUI($atts);
      return $gallery->render();
    }
  }
}
