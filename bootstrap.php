<?php
/*
Plugin Name: uTubeVideo Gallery
Plugin URI: http://www.codeclouds.net/
Description: This plugin allows you to create YouTube video galleries to embed in a WordPress site.
Version: 2.0.6
Author: Dustin Scarberry
Author URI: http://www.codeclouds.net/
License: GPL2
*/

/*  2013 Dustin Scarberry dustin@codeclouds.net

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

namespace CodeClouds\UTubeVideoGallery;


use CodeClouds\UTubeVideoGallery\Controller\View\Dashboard;
use CodeClouds\UTubeVideoGallery\Controller\View\App;
use CodeClouds\UTubeVideoGallery\Service\Maintenance;
use CodeClouds\UTubeVideoGallery\Controller\API\GalleryAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\AlbumAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\VideoAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\GalleryDataAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\PlaylistAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\VideoOrderAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\AlbumOrderAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\YouTubePlaylistAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\VimeoPlaylistAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\SettingsAPIv1;
use CodeClouds\UTubeVideoGallery\Controller\API\DocumentationAPIv1;

require(dirname(__FILE__) . '/config.php');

class Bootstrap
{
  private $options;

  function __construct()
  {
    // register autoloader
    spl_autoload_register([$this, 'autoloader']);

    // load options
    $this->options = get_option('utubevideo_main_opts');

    // call upgrade check if in dashboard
    if (is_admin())
      $this->upgrade_check();

    // load dependencies
    $this->loadDependencies();

    // hook APIs
    $this->hookAPIs();

    // activation hook
    register_activation_hook(__FILE__, [$this, 'activate']);
  }

  function autoloader($className)
  {
    if (strpos($className, 'CodeClouds\UTubeVideoGallery') !== false) {
      $className = str_replace('\\', '/', $className);
      $className = str_replace('CodeClouds/UTubeVideoGallery/', '', $className);
      include_once('src/' . $className . '.php');
    }
  }

  // activate plugin
  function activate($network)
  {
    // multisite activation
    if (
      function_exists('is_multisite')
      && is_multisite()
      && $network
    ) {
      global $wpdb;

      $old_blog =  $wpdb->blogid;
      $blogids =  $wpdb->get_col('SELECT blog_id FROM ' .  $wpdb->blogs);

      foreach ($blogids as $blog_id) {
        switch_to_blog($blog_id);
        $this->maintenance();
      }

      switch_to_blog($old_blog);
    }

    // single site activation
    $this->maintenance();
  }

  // hook apis
  function hookAPIs()
  {
    new GalleryAPIv1();
    new AlbumAPIv1();
    new VideoAPIv1();
    new GalleryDataAPIv1();
    new PlaylistAPIv1();
    new VideoOrderAPIv1();
    new AlbumOrderAPIv1();
    new YouTubePlaylistAPIv1();
    new VimeoPlaylistAPIv1();
    new SettingsAPIv1();
    new DocumentationAPIv1();
  }

  // upgrade check
  private function upgrade_check()
  {
    if (
      !isset($this->options['version'])
      || $this->options['version'] < CC_UTUBEVIDEOGALLERY_VERSION
    ) {
      $this->maintenance();
      $this->options['version'] = CC_UTUBEVIDEOGALLERY_VERSION;
      update_option('utubevideo_main_opts', $this->options);
    }
  }

  // load dependencies
  private function loadDependencies()
  {
    load_plugin_textdomain('utvg', false, 'utubevideo-gallery/translations');

    // load app or dashboard
    if (is_admin())
      new Dashboard();
    else
      new App();
  }

  // upgrade maintenance
  private function maintenance()
  {
    new Maintenance();
  }
}

// bootstrap
new Bootstrap();
