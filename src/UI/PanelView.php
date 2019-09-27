<?php

namespace UTubeVideoGallery\UI;

class PanelView
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
      'icon' => 'red', //[default, red, blue]
      'controls' => false, //[true, false]
      'maxvideos' => null //[any integer]
    ], $atts, 'utubevideo');
  }

  public function render()
  {
    return '<div
      class="utv-panel-root"
      data-id="' . $this->_atts['id'] . '"
      data-controls="' . $this->_atts['controls'] . '"
      data-videos-per-page="' . $this->_atts['panelvideocount'] . '"
      data-theme="' . $this->_atts['theme'] . '"
      data-icon="' . $this->_atts['icon'] . '"
      data-max-videos="' . $this->_atts['maxvideos'] . '"
    ></div>';
  }
}
