<?php

namespace CodeClouds\UTubeVideoGallery\UI;

class GalleryView
{
  private $_atts;

  public function __construct($atts)
  {
    $this->mapAttributes($atts);
  }

  private function mapAttributes($atts)
  {
    //map default attributes
    $this->_atts = shortcode_atts([
      'id' => null,
      'panelvideocount' => 14, //video count per panel view / page
      'theme' => 'light', //[light, dark, transparent]
      'icon' => 'red', //[original, red, blue]
      'controls' => 'false', //[true, false]
      'maxvideos' => null, //[any integer]
      'maxalbums' => null //[any integer]
    ], $atts, 'utubevideo');
  }

  public function render()
  {
    return '<div
      class="utv-gallery-root"
      data-id="' . $this->_atts['id'] . '"
      data-icontype="' . $this->_atts['icon'] . '"
      data-max-videos="' . $this->_atts['maxvideos'] . '"
      data-max-albums="' . $this->_atts['maxalbums'] . '"
    ></div>';
  }
}
