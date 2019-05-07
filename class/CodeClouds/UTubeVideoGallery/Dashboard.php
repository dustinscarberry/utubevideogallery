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

class Dashboard
{
  private $_options, $_version;

  public function __construct($version)
  {
    //set version
    $this->_version = $version;

    //get plugin options
    $this->_options = get_option('utubevideo_main_opts');

    //main hooks
    add_action('admin_menu', [$this, 'addMenus']);
    add_action('admin_enqueue_scripts', [$this, 'loadCSS']);
    add_action('admin_enqueue_scripts', [$this, 'loadJS']);
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

  public function loadJS()
  {
    wp_enqueue_script('jquery');

    //use gutenburg polyfill if registered
    if (!wp_script_is('wp-polyfill', 'registered'))
      wp_enqueue_script(
        'babel-polyfill',
        'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.4/polyfill.js',
        null,
        false,
        true
      );
    else
      wp_enqueue_script('wp-polyfill');

    wp_enqueue_script(
      'utv-admin-js',
      plugins_url('../../../public/js/dashboard.min.js', __FILE__),
      ['jquery', 'jquery-ui-core', 'jquery-ui-sortable'],
      $this->_version,
      true
    );

    $thumbnailCacheDirectory = wp_upload_dir();
    $thumbnailCacheDirectory = $thumbnailCacheDirectory['baseurl'] . '/utubevideo-cache/';

    $embeddedJS = [
      'thumbnailCacheDirectory' => $thumbnailCacheDirectory,
      'restURL' => esc_url_raw(rest_url()),
      'restNonce' => wp_create_nonce('wp_rest'),
      'localization' => [
        'title' => __('Title', 'utvg'),
        'shortcode' => __('Shortcode', 'utvg'),
        'dateAdded' => __('Date Added', 'utvg'),
        'numberOfAlbums' => __('# Albums', 'utvg'),
        'thumbnail' => __('Thumbnail', 'utvg'),
        'published' => __('Published', 'utvg'),
        'numberOfVideos' => __('# Videos', 'utvg'),
        'source' => __('Source', 'utvg'),
        'album' => __('Album', 'utvg'),
        'lastUpdated' => __('Last Updated', 'utvg'),
        'galleries' => __('Galleries', 'utvg'),
        'savedPlaylists' => __('Saved Playlists', 'utvg'),
        'settings' => __('Settings', 'utvg'),
        'bulkActions' => __('Bulk Actions', 'utvg'),
        'delete' => __('Delete', 'utvg'),
        'publish' => __('Publish', 'utvg'),
        'unPublish' => __('Un-publish', 'utvg'),
        'albums' => __('Albums', 'utvg'),
        'videos' => __('Videos', 'utvg'),
        'playlists' => __('Playlists', 'utvg'),
        'addGallery' => __('Add Gallery', 'utvg'),
        'addAlbum' => __('Add Album', 'utvg'),
        'addVideo' => __('Add Video', 'utvg'),
        'addPlaylist' => __('Add Playlist', 'utvg'),
        'edit' => __('Edit', 'utvg'),
        'view' => __('View', 'utvg'),
        'watch' => __('Watch', 'utvg'),
        'url' => __('URL', 'utvg'),
        'description' => __('Description', 'utvg'),
        'quality' => __('Quality', 'utvg'),
        'controls' => __('Controls', 'utvg'),
        'startTime' => __('Start Time', 'utvg'),
        'endTime' => __('End Time', 'utvg'),
        'showPlayerControlsHint' => __('Show Player Controls', 'utvg'),
        'startTimeHint' => __('Beginning timestamp (seconds)', 'utvg'),
        'endTimeHint' => __('Ending timestamp (seconds)', 'utvg'),
        'cancel' => __('Cancel', 'utvg'),
        'videoSorting' => __('Video Sorting', 'utvg'),
        'firstToLast' => __('First to Last', 'utvg'),
        'lastToFirst' => __('Last to First', 'utvg'),
        'albumSorting' => __('Album Sorting', 'utvg'),
        'thumbnailType' => __('Thumbnail Type', 'utvg'),
        'displayType' => __('Display Type', 'utvg'),
        'rectangle' => __('Rectangle', 'utvg'),
        'square' => __('Square', 'utvg'),
        'justVideos' => __('Just Videos', 'utvg'),
        'playlistItems' => __('Playlist Items', 'utvg'),
        'all' => __('All', 'utvg'),
        'none' => __('None', 'utvg'),
        'editSyncPlaylist' => __('Edit / Sync Playlist', 'utvg'),
        'syncSaveChanges' => __('Sync / Save Changes', 'utvg'),
        'syncMethod' => __('Sync Method', 'utvg'),
        'syncSelected' => __('Sync Selected', 'utvg'),
        'syncNew' => __('Sync New', 'utvg'),
        'syncAll' => __('Sync All', 'utvg'),
        'editGallery' => __('Edit Gallery', 'utvg'),
        'saveGallery' => __('Save Gallery', 'utvg'),
        'editAlbum' => __('Edit Album', 'utvg'),
        'editVideo' => __('Edit Video', 'utvg'),
        'gallery' => __('Gallery', 'utvg'),
        'saveAlbum' => __('Save Album', 'utvg'),
        'albumThumbnail' => __('Album Thumbnail', 'utvg'),
        'saveVideo' => __('Save Video', 'utvg'),
        'serverInformation' => __('Server Information', 'utvg'),
        'phpVersion' => __('PHP Version', 'utvg'),
        'pluginVersion' => __('Plugin Version', 'utvg'),
        'wpVersion' => __('WordPress Version', 'utvg'),
        'updateSettings' => __('Update Settings', 'utvg'),
        'resyncThumbnails' => __('Re-Sync Thumbnails', 'utvg'),
        'general' => __('General', 'utvg'),
        'maxPlayerWidth' => __('Max Player Width', 'utvg'),
        'thumbnailWidth' => __('Thumbnail Width', 'utvg'),
        'thumbnailHorizontalPadding' => __('Thumbnail Horizontal Padding', 'utvg'),
        'thumbnailVerticalPadding' => __('Thumbnail Vertical Padding', 'utvg'),
        'thumbnailBorderRadius' => __('Thumbnail Border Radius', 'utvg'),
        'overlayColor' => __('Overlay Color', 'utvg'),
        'overlayOpactiy' => __('Overlay Opacity', 'utvg'),
        'showVideoDescription' => __('Show Video Descriptions', 'utvg'),
        'showVideoDescriptionHint' => __('Enable or disable video descriptions', 'utvg'),
        'removeVideoPopupScripts' => __('Remove Video Popup Scripts', 'utvg'),
        'removeVideoPopupScriptsHint' => __('Remove scripts if provided by another plugin'),
        'apiKey' => __('API Key', 'utvg'),
        'youtubeControlsTheme' => __('Controls Theme', 'utvg'),
        'youtubeControlsColor' => __('Controls Color', 'utvg'),
        'autoplayVideos' => __('Autoplay Videos', 'utvg'),
        'hideVideoDetails' => __('Hide Videos Details'),
        'light' => __('Light', 'utvg'),
        'dark' => __('Dark', 'utvg'),
        'red' => __('Red', 'utvg'),
        'white' => __('White', 'utvg'),
        'local' => __('Local', 'utvg'),
        'web' => __('Web', 'utvg'),
        'both' => __('Both', 'utvg'),
        'confirmGalleryDelete' => __('Are you sure you want to delete this gallery?', 'utvg'),
        'confirmGalleriesDelete' => __('Are you sure you want to delete these galleries?', 'utvg'),
        'confirmAlbumDelete' => __('Are you sure you want to delete this album?', 'utvg'),
        'confirmAlbumsDelete' => __('Are you sure you want to delete these albums?', 'utvg'),
        'confirmVideoDelete' => __('Are you sure you want to delete this video?', 'utvg'),
        'confirmVideosDelete' => __('Are you sure you want to delete these videos?', 'utvg'),
        'confirmPlaylistDelete' => __('Are you sure you want to delete this playlist?', 'utvg'),
        'confirmPlaylistsDelete' => __('Are you sure you want to delete these playlists?', 'utvg'),
        'feedbackAlbumCreated' => __('Album created', 'utvg'),
        'feedbackAlbumSaved' => __('Album changes saved', 'utvg'),
        'feedbackGalleryCreated' => __('Gallery created', 'utvg'),
        'feedbackGallerySaved' => __('Gallery changed saved', 'utvg'),
        'feedbackPlaylistAdded' => __('Playlist added', 'utvg'),
        'feedbackPlaylistAddFail' => __('Playlist failed to add', 'utvg'),
        'feedbackPlaylistSynced' => __('Playlist synced / saved', 'utvg'),
        'feedbackSettingsSaved' => __('Settings saved', 'utvg'),
        'feedbackVideoAdded' => __('Video added', 'utvg'),
        'feedbackVideoSaved' => __('Video changes saved', 'utvg'),
        'feedbackVideoPartial' => __('Video', 'utvg'),
        'feedbackUpdatedPartial' => __('updated', 'utvg'),
        'feedbackAddedPartial' => __('added', 'utvg')
      ]
    ];

    wp_localize_script('utv-admin-js', 'utvJSData', $embeddedJS);
  }

  public function loadCSS()
  {
    wp_enqueue_style(
      'utv-admin-css',
      plugins_url('../../../public/css/dashboard.min.css', __FILE__),
      false,
      $this->_version
    );

    wp_enqueue_style(
      'utv-fontawesome5',
      'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
      false
    );
  }

  public function dashboardPanel()
  {
    echo '<div id="utv-dashboard-root"></div>';
  }
}
