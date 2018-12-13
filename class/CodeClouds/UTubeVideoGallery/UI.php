<?php
/**
 * CodeClouds\uTubeVideoGallery\UI - Frontend for uTubeVideo Gallery
 *
 * @package uTubeVideo Gallery
 * @author Dustin Scarberry
 *
 * @since 1.3
 */

namespace CodeClouds\UTubeVideoGallery;

use CodeClouds\UTubeVideoGallery\UI\PanelView;
use CodeClouds\UTubeVideoGallery\UI\GalleryView;

class UI
{
  private $_options, $_version;

  public function __construct($version)
  {
    //set version
    $this->_version = $version;

    //get plugin options
    $this->_options = get_option('utubevideo_main_opts');

    //add hooks
    add_shortcode('utubevideo', [$this, 'shortcode']);
    add_action('wp_enqueue_scripts', [$this, 'loadJS']);
    add_action('wp_enqueue_scripts', [$this, 'loadCSS']);

    //check for extra lightbox script inclusion
    if ($this->_options['skipMagnificPopup'] == 'no')
      add_action('wp_enqueue_scripts', [$this, 'addLightboxScripts']);
  }

  //insert styles for galleries
  public function loadCSS()
  {
    //load frontend styles
    wp_enqueue_style(
      'utv-app-css',
      plugins_url('../../../public/css/app.min.css', __FILE__),
      false,
      $this->_version
    );
    wp_enqueue_style(
      'font-awesome',
      'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css'
    );

    //add embedded thumbnail sizing css
    $css = '.utv-thumbnail,.utv-thumbnail>a{width:' . $this->_options['thumbnailWidth'] . 'px!important}';
    $css .= '.utv-thumbnails-rectangle img{height:' . round($this->_options['thumbnailWidth'] / 1.7778) . 'px}';
    $css .= '.utv-thumbnails-square img{height:' . $this->_options['thumbnailWidth'] . 'px}';
    $css .= '.utv-thumbnail{margin:' . $this->_options['thumbnailVerticalPadding'] . 'px ' . $this->_options['thumbnailPadding'] . 'px!important}';

    //add thumbnail border radius if defined
    if ($this->_options['thumbnailBorderRadius'] > 0)
      $css .= '.utv-thumb>a,.utv-thumb img{border-radius:' . $this->_options['thumbnailBorderRadius'] . 'px!important}';

    wp_add_inline_style('utv-app-css', $css);
  }

  //insert javascript for galleries
  public function loadJS()
  {
    $embeddedJS = [
      'thumbnailWidth' => $this->_options['thumbnailWidth'],
      'thumbnailPadding' => $this->_options['thumbnailPadding'],
      'playerWidth' => $this->_options['playerWidth'],
      'playerHeight' => $this->_options['playerHeight'],
      'lightboxOverlayColor' => $this->_options['fancyboxOverlayColor'],
      'lightboxOverlayOpacity' => $this->_options['fancyboxOverlayOpacity'],
      'playerControlTheme' => $this->_options['playerControlTheme'],
      'playerProgressColor' => $this->_options['playerProgressColor'],
      'youtubeAutoplay' => $this->_options['youtubeAutoplay'],
      'vimeoAutoplay' => $this->_options['vimeoAutoplay'],
      'youtubeDetailsHide' => $this->_options['youtubeDetailsHide'],
      'vimeoDetailsHide' => $this->_options['vimeoDetailsHide']
    ];

    wp_enqueue_script(
      'utv-frontend',
      plugins_url('../../../public/js/app.min.js', __FILE__),
      ['jquery'],
      $this->_version,
      true
    );

    wp_localize_script('utv-frontend', 'utvJSData', $embeddedJS);
  }

  public function addLightboxScripts()
  {
    //load jquery and lightbox js / css
    wp_enqueue_script('jquery');
    wp_enqueue_script(
      'codeclouds-mp-js',
      'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js',
      ['jquery'],
      null,
      true
    );
    wp_enqueue_style(
      'codeclouds-mp-css',
      'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css',
      false,
      null
    );
  }

  public function shortcode($atts)
  {
    //panel view
    if (
      isset($atts['view'])
      && $atts['view'] == 'panel'
    )
    {
      $panelView = new PanelView($atts);
      return $panelView->render();
    }
    //gallery view
    else
    {
      $galleryView = new GalleryView($atts);
      return $galleryView->render();
    }
  }
}
