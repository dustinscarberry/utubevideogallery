<?php

namespace Dscarberry\UTubeVideoGallery\UI;

class PanelUI
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
      'icon' => 'red', //[default, red, blue]
      'controls' => false, //[true, false]
      'maxvideos' => null //[any integer]
    ], $atts, 'utubevideo');
  }

  function render()
  {
    return '<div
      class="utv-panel-root"
      data-id="' . esc_attr($this->atts['id']) . '"
      data-controls="' . esc_attr($this->atts['controls']) . '"
      data-videos-per-page="' . esc_attr($this->atts['panelvideocount']) . '"
      data-theme="' . esc_attr($this->atts['theme']) . '"
      data-icon="' . esc_attr($this->atts['icon']) . '"
      data-max-videos="' . esc_attr($this->atts['maxvideos']) . '"
    ></div>';
  }
}
