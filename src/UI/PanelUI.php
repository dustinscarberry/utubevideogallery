<?php

namespace CodeClouds\UTubeVideoGallery\UI;

class PanelUI
{
  private $atts;

  function __construct($atts)
  {
    $this->mapAttributes($atts);
  }

  private function mapAttributes($atts)
  {
    //map default attributes
    $this->atts = shortcode_atts([
      'id' => null,
      'panelvideocount' => 14, //video count per panel view / page
      'theme' => 'light', //[light, dark, transparent]
      'icon' => 'red', //[default, red, blue]
      'controls' => false, //[true, false]
      'maxvideos' => null //[any integer]
    ], $atts, 'utubevideo');
  }

  function render()
  {
    return '<div
      class="utv-panel-root"
      data-id="' . $this->atts['id'] . '"
      data-controls="' . $this->atts['controls'] . '"
      data-videos-per-page="' . $this->atts['panelvideocount'] . '"
      data-theme="' . $this->atts['theme'] . '"
      data-icon="' . $this->atts['icon'] . '"
      data-max-videos="' . $this->atts['maxvideos'] . '"
    ></div>';
  }
}
