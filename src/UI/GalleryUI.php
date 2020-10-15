<?php

namespace CodeClouds\UTubeVideoGallery\UI;

class GalleryUI
{
  private $atts;

  function __construct($atts)
  {
    $this->mapAttributes($atts);
  }

  // map shortcode attributes
  private function mapAttributes($atts)
  {
    $this->atts = shortcode_atts([
      'id' => null,
      'panelvideocount' => 14, //video count per panel view / page
      'theme' => 'light', //[light, dark, transparent]
      'icon' => 'red', //[original, red, blue]
      'controls' => 'false', //[true, false]
      'maxvideos' => null, //[any integer]
      'maxalbums' => null, //[any integer]
      'thumbnailsperpage' => null
    ], $atts, 'utubevideo');
  }

  function render()
  {
    return '<div
      class="utv-gallery-root"
      data-id="' . $this->atts['id'] . '"
      data-icontype="' . $this->atts['icon'] . '"
      data-max-videos="' . $this->atts['maxvideos'] . '"
      data-max-albums="' . $this->atts['maxalbums'] . '"
      data-thumbnails-per-page="' . $this->atts['thumbnailsperpage'] . '"
    ></div>';
  }
}
