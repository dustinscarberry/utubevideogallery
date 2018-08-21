<?php
/**
 * utvAdmin - Admin section for uTubeVideo Gallery
 *
 * @package uTubeVideo Gallery
 * @author Dustin Scarberry
 *
 * @since 1.3
 */

if (!class_exists('utvAdmin'))
{
  class utvAdmin
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
      add_action('admin_init', array($this, 'processor'));
      add_action('admin_menu', array($this, 'addMenus'));
      add_action('admin_enqueue_scripts', array($this, 'addScripts'));

      //ajax hooks
      require($this->_dirpath . '/includes/ajax.php');
      $utvAdminAjax = new utvAdminAjax($this->_options);
    }

    public function addMenus()
    {
      add_menu_page(__('uTubeVideo Galleries', 'utvg'), 'uTubeVideo', 'edit_pages', 'utubevideo', array($this, 'gallery_panel'), plugins_url('utubevideo-gallery/public/img/utubevideo_icon_16x16.png'));
      add_submenu_page('utubevideo', 'uTubeVideo Playlists', __('Playlists', 'utvg'), 'edit_pages', 'utubevideo_playlists', array($this, 'playlists_panel'));
      add_submenu_page('utubevideo', 'uTubeVideo Settings', __('Settings', 'utvg'), 'edit_pages', 'utubevideo_settings', array($this, 'option_panel'));
    }

    public function addScripts()
    {
      wp_enqueue_script('jquery');
      wp_enqueue_script('jquery-ui-core');
      wp_enqueue_script('jquery-ui-sortable');
      wp_enqueue_script('retina-js', 'https://cdnjs.cloudflare.com/ajax/libs/retina.js/2.1.2/retina.min.js', null, null, true);
      wp_enqueue_script('utv-admin', plugins_url('public/js/dashboard.min.js', __FILE__), array('jquery', 'jquery-ui-core', 'jquery-ui-sortable'), $this->_version, true);
      wp_enqueue_style('utv-style', plugins_url('css/admin_style.min.css', __FILE__), false, $this->_version);
      wp_enqueue_style('jquery-ui-sortable', plugins_url('css/jquery-ui-1.10.3.custom.min.css', __FILE__), false, $this->_version);

      $dir = wp_upload_dir();
      $dir = $dir['baseurl'];

      $jsdata = array(
        'thumbCacheDirectory' => $dir . '/utubevideo-cache/',
        'translations' => array(
          'confirmGalleryDelete' => __('Are you sure you want to delete this gallery?', 'utvg'),
          'confirmAlbumDelete' => __('Are you sure you want to delete this album?', 'utvg'),
          'confirmVideoDelete' => __('Are you sure you want to delete this video?', 'utvg'),
          'confirmPlaylistDelete' => __('Are you sure you want to delete this playlist? All videos contained will be deleted.', 'utvg')
        ),
        'nonces' => array(
          'deleteGallery' => wp_create_nonce('ut-delete-gallery'),
          'deleteAlbum' => wp_create_nonce('ut-delete-album'),
          'deleteVideo' => wp_create_nonce('ut-delete-video'),
          'deletePlaylist' => wp_create_nonce('utv-delete-playlist'),
          'publishAlbum' => wp_create_nonce('ut-publish-album'),
          'publishVideo' => wp_create_nonce('ut-publish-video'),
          'retrievePlaylist' => wp_create_nonce('ut-retrieve-playlist')
        )
      );

      wp_localize_script('utv-admin', 'utvJSData', $jsdata);
    }

    public function gallery_panel()
    {
      //declare globals
      global $wpdb;

      ?>

      <div class="wrap utv-admin" id="utv-galleries">
      <h2 id="utv-masthead">uTubeVideo <?php _e('Galleries', 'utvg'); ?></h2>

      <?php
      //if view parameter is set//
      if (isset($_GET['view']))
      {
        //view video albums in a gallery//
        if($_GET['view'] == 'gallery')
          require($this->_dirpath . '/includes/forms/viewGallery.inc.php');
        //display create a gallery form//
        elseif($_GET['view'] == 'gallerycreate')
          require($this->_dirpath . '/includes/forms/createGallery.inc.php');
        //display gallery edit form//
        elseif($_GET['view'] == 'galleryedit')
          require($this->_dirpath . '/includes/forms/editGallery.inc.php');
        //view videos within a video album//
        elseif($_GET['view'] == 'album')
          require($this->_dirpath . '/includes/forms/viewAlbum.inc.php');
        //display create album form//
        elseif($_GET['view'] == 'albumcreate')
          require($this->_dirpath . '/includes/forms/createAlbum.inc.php');
        //display album edit form//
        elseif($_GET['view'] == 'albumedit')
          require($this->_dirpath . '/includes/forms/editAlbum.inc.php');
        //display add video form//
        elseif($_GET['view'] == 'videoadd')
          require($this->_dirpath . '/includes/forms/addVideo.inc.php');
        //display add playlist form//
        elseif($_GET['view'] == 'playlistadd')
          require($this->_dirpath . '/includes/forms/addPlaylist.inc.php');
        //display video edit form//
        elseif($_GET['view'] == 'videoedit')
          require($this->_dirpath . '/includes/forms/editVideo.inc.php');
        elseif($_GET['view'] == 'playlistdetail')
          require($this->_dirpath . '/includes/forms/playlistDetail.inc.php');
      }
      //display galleries//
      else
        require($this->_dirpath . '/includes/forms/overviewGalleries.inc.php');
      ?>

    </div>

    <?php

    }

    public function playlists_panel()
    {
      //declare globals
      global $wpdb;

      ?>

      <div class="wrap utv-admin" id="utv-playlists">
      <h2 id="utv-masthead">uTubeVideo <?php _e('Playlists', 'utvg'); ?></h2>

      <?php
      //if view parameter is set//
      if (isset($_GET['view']))
      {
        //display playlist sync form//
        if ($_GET['view'] == 'playlistview')
          require($this->_dirpath . '/includes/forms/viewPlaylist.inc.php');
      }
      //display playlists overview
      else
        require($this->_dirpath . '/includes/forms/overviewPlaylists.inc.php');
    }

    public function option_panel()
    {
      require($this->_dirpath . '/includes/forms/generalOptions.inc.php');
    }

    public function processor()
    {
      require($this->_dirpath . '/includes/processor.inc.php');
    }

  }

}
?>
