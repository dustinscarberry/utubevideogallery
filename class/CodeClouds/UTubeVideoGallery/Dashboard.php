<?php
/**
 * CodeClouds\uTubeVideoGallery\Dashboard - Admin panel for uTubeVideo Gallery
 *
 * @package uTubeVideo Gallery
 * @author Dustin Scarberry
 *
 * @since 1.3
 */

namespace CodeClouds\UTubeVideoGallery;

if (!class_exists('CodeClouds\UTubeVideoGallery\Dashboard'))
{
  class Dashboard
  {
    private $_options, $_version, $_dirpath;

    public function __construct($version)
    {
      //set version
      $this->_version = $version;

      //set dirpath
      $this->_dirpath = dirname(__FILE__);

      //get plugin options
      $this->_options = get_option('utubevideo_main_opts');

      //main hooks
      add_action('admin_menu', [$this, 'addMenus']);
      add_action('admin_enqueue_scripts', [$this, 'addScripts']);
    }

    public function addMenus()
    {
      add_menu_page(
        __('uTubeVideo', 'utvg'),
        'uTubeVideo',
        'edit_pages',
        'utubevideo',
        [$this, 'dashboardPanel'],
        'dashicons-video-alt3'
      );
    }

    public function addScripts()
    {
      wp_enqueue_script('jquery');
      wp_enqueue_script('retina-js', 'https://cdnjs.cloudflare.com/ajax/libs/retina.js/2.1.2/retina.min.js', null, null, true);
      wp_enqueue_script('utv-admin', plugins_url('../../../public/js/dashboard.min.js', __FILE__), ['jquery', 'jquery-ui-core', 'jquery-ui-sortable'], $this->_version, true);
      wp_enqueue_style('utv-style', plugins_url('../../../public/css/dashboard.min.css', __FILE__), false, $this->_version);
      wp_enqueue_style('utv-fontawesome5', 'https://use.fontawesome.com/releases/v5.3.1/css/all.css', false);

      $dir = wp_upload_dir();
      $dir = $dir['baseurl'];

      $jsdata = [
        'thumbnailCacheDirectory' => $dir . '/utubevideo-cache/',
        'translations' => [
          'confirmGalleryDelete' => __('Are you sure you want to delete this gallery?', 'utvg')
        ],
        'restURL' => esc_url_raw(rest_url()),
        'restNonce' => wp_create_nonce('wp_rest')
      ];

      wp_localize_script('utv-admin', 'utvJSData', $jsdata);
    }

    public function loadScripts()
    {

    }

    public function loadStyles()
    {

    }

    public function dashboardPanel()
    {
      echo '<div id="utv-dashboard-root"></div>';
    }
  }
}
