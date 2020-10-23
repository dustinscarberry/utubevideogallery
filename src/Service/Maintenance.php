<?php

namespace CodeClouds\UTubeVideoGallery\Service;

class Maintenance
{
  function __construct()
  {
    // extra include due to libaries not being loaded at this hook point
    if (!function_exists('wp_get_current_user'))
      require_once(ABSPATH . 'wp-includes/pluggable.php');

    // standard maintenance
    $this->checkRequiredPHPVersion();
    $this->setupDatabaseTables();
    $this->createThumbnailCacheDirectory();
    $this->copyMissingThumbnailsToCache();

    // patch fixes
    $this->fixVideoSorting();
    $this->fixAlbumSorting();
    $this->addAlbumSlugs();
    $this->fixThumbnailFilenames();

    // update default options
    $this->updateDefaultOptions();
  }

  // check for supported php version
  private function checkRequiredPHPVersion()
  {
    if (strnatcmp(phpversion(), CC_UTUBEVIDEOGALLERY_MIN_PHP_VERSION) < 0)
      die('PHP version ' . CC_UTUBEVIDEOGALLERY_MIN_PHP_VERSION . ' or greater required. You currently have version ' . phpversion());
  }

  // create database tables
  private function setupDatabaseTables()
  {
    global $wpdb;
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    $dbTables = [];
    $dbTables['galleryTable'] = $wpdb->prefix . 'utubevideo_dataset';
    $dbTables['albumTable'] = $wpdb->prefix . 'utubevideo_album';
    $dbTables['videoTable'] = $wpdb->prefix . 'utubevideo_video';
    $dbTables['playlistTable'] = $wpdb->prefix . 'utubevideo_playlist';

    $sql = "CREATE TABLE " . $dbTables['galleryTable'] . " (
      DATA_ID int(11) NOT NULL AUTO_INCREMENT,
      DATA_NAME varchar(150) NOT NULL,
      DATA_SORT varchar(4) DEFAULT 'desc' NOT NULL,
      DATA_DISPLAYTYPE varchar(6) DEFAULT 'album' NOT NULL,
      DATA_UPDATEDATE int(11) NOT NULL,
      DATA_ALBCOUNT int(7) DEFAULT 0 NOT NULL,
      DATA_THUMBTYPE varchar(9) DEFAULT 'rectangle' NOT NULL,
      UNIQUE KEY DATA_ID (DATA_ID)
    );
    CREATE TABLE " . $dbTables['albumTable'] . " (
      ALB_ID int(11) NOT NULL AUTO_INCREMENT,
      ALB_NAME varchar(150) NOT NULL,
      ALB_SLUG varchar(50) DEFAULT '--empty--' NOT NULL,
      ALB_THUMB varchar(50) NOT NULL,
      ALB_SORT varchar(4) DEFAULT 'desc' NOT NULL,
      ALB_POS int(11) NOT NULL,
      ALB_PUBLISH tinyint(1) DEFAULT 1 NOT NULL,
      ALB_UPDATEDATE int(11) NOT NULL,
      ALB_VIDCOUNT int(7) DEFAULT 0 NOT NULL,
      DATA_ID int(11) NOT NULL,
      UNIQUE KEY ALB_ID (ALB_ID)
    );
    CREATE TABLE " . $dbTables['videoTable'] . " (
      VID_ID int(11) NOT NULL AUTO_INCREMENT,
      VID_SOURCE varchar(30) NOT NULL,
      VID_NAME varchar(150) NOT NULL,
      VID_DESCRIPTION text,
      VID_URL varchar(50) NOT NULL,
      VID_THUMBTYPE varchar(9) DEFAULT 'rectangle' NOT NULL,
      VID_QUALITY varchar(6) DEFAULT 'large' NOT NULL,
      VID_CHROME tinyint(1) DEFAULT 1 NOT NULL,
      VID_STARTTIME int(11),
      VID_ENDTIME int(11),
      VID_POS int(11) NOT NULL,
      VID_PUBLISH tinyint(1) DEFAULT 1 NOT NULL,
      VID_UPDATEDATE int(11) NOT NULL,
      ALB_ID int(11) NOT NULL,
      PLAY_ID int(11),
      UNIQUE KEY VID_ID (VID_ID)
    );
    CREATE TABLE " . $dbTables['playlistTable'] . " (
      PLAY_ID int(11) NOT NULL AUTO_INCREMENT,
      PLAY_TITLE varchar(150) NOT NULL,
      PLAY_SOURCE varchar(25) NOT NULL,
      PLAY_SOURCEID varchar(60) NOT NULL,
      PLAY_QUALITY varchar(6) NOT NULL,
      PLAY_CHROME tinyint(1) NOT NULL,
      PLAY_UPDATEDATE int(11) NOT NULL,
      ALB_ID int(11) NOT NULL,
      UNIQUE KEY PLAY_ID (PLAY_ID)
    );";

    dbDelta($sql);

    // upgrade database tables
    foreach ($dbTables as $table)
      maybe_convert_table_to_utf8mb4($table);
  }

  // create thumbnail cache directory
  private function createThumbnailCacheDirectory()
  {
    $dir = wp_upload_dir();
    $dir = $dir['basedir'];
    wp_mkdir_p($dir . '/utubevideo-cache');
  }

  // copy missing thumbnails to cache
  private function copyMissingThumbnailsToCache()
  {
    $dir = wp_upload_dir();
    $dir = $dir['basedir'];
    copy(plugins_url('public/img/missing.jpg', __FILE__), $dir . '/utubevideo-cache/missing.jpg');
    copy(plugins_url('public/img/missing@2x.jpg', __FILE__), $dir . '/utubevideo-cache/missing@2x.jpg');
  }

  // fix video sorting
  private function fixVideoSorting()
  {
    global $wpdb;

    $options = get_option('utubevideo_main_opts');

    if (!isset($options['sortFix'])) {
      $albumIds = $wpdb->get_results(
        'SELECT ALB_ID
        FROM ' . $wpdb->prefix . 'utubevideo_album',
        ARRAY_A
      );

      foreach ($albumIds as $value) {
        $videoIds = $wpdb->get_results(
          'SELECT VID_ID
          FROM ' . $wpdb->prefix . 'utubevideo_video
          WHERE ALB_ID = ' . $value['ALB_ID'] .
          ' ORDER BY VID_POS',
          ARRAY_A
        );

        $posCounter = 0;

        foreach ($videoIds as $video) {
          $wpdb->update($wpdb->prefix . 'utubevideo_video',
            ['VID_POS' => $posCounter],
            ['VID_ID' => $video['VID_ID']]
          );

          $posCounter++;
        }
      }
    }
  }

  // fix album sorting
  private function fixAlbumSorting()
  {
    global $wpdb;

    $options = get_option('utubevideo_main_opts');

    if (!isset($options['albumSortFix'])) {
      $galleryIds = $wpdb->get_results(
        'SELECT DATA_ID
        FROM ' . $wpdb->prefix . 'utubevideo_dataset',
        ARRAY_A
      );

      foreach ($galleryIds as $value) {
        $albumIds = $wpdb->get_results(
          'SELECT ALB_ID
          FROM ' . $wpdb->prefix . 'utubevideo_album
          WHERE DATA_ID = ' . $value['DATA_ID'] .
          ' ORDER BY ALB_POS',
          ARRAY_A
        );

        $posCounter = 0;

        foreach ($albumIds as $album) {
          $wpdb->update($wpdb->prefix . 'utubevideo_album',
            ['ALB_POS' => $posCounter],
            ['ALB_ID' => $album['ALB_ID']]
          );

          $posCounter++;
        }
      }
    }
  }

  // add album slugs
  private function addAlbumSlugs()
  {
    global $wpdb;

    $options = get_option('utubevideo_main_opts');

    if (!isset($options['setSlugs'])) {
      $mark = 1;
      $sluglist = [];

      $data = $wpdb->get_results(
        'SELECT ALB_ID, ALB_NAME
        FROM ' . $wpdb->prefix . 'utubevideo_album',
        ARRAY_A
      );

      foreach ($data as $value) {
        $slug = strtolower($value['ALB_NAME']);
        $slug = str_replace(' ', '-', $slug);
        $slug = html_entity_decode($slug, ENT_QUOTES, 'UTF-8');
        $slug = preg_replace("/[^a-zA-Z0-9-]+/", "", $slug);

        if (!empty($sluglist))
          $this->checkslug($slug, $sluglist, $mark);

        $sluglist[] = $slug;
        $mark = 1;

        $wpdb->update($wpdb->prefix . 'utubevideo_album',
          ['ALB_SLUG' => $slug],
          ['ALB_ID' => $value['ALB_ID']]
        );
      }
    }
  }

  // fix thumbnail filenames
  private function fixThumbnailFilenames()
  {
    global $wpdb;

    $options = get_option('utubevideo_main_opts');

    if (!isset($options['filenameFix'])) {
      error_reporting(0);

      // rename thumbnails
      $dir = wp_upload_dir();
      $dir = $dir['basedir'] . '/utubevideo-cache/';
      $data = $wpdb->get_results(
        'SELECT VID_ID, VID_URL
        FROM ' . $wpdb->prefix . 'utubevideo_video',
        ARRAY_A
      );

      foreach ($data as $val) {
        $old = $dir . $val['VID_URL'] . '.jpg';
        $new = $dir . $val['VID_URL'] . $val['VID_ID'] . '.jpg';
        rename($old, $new);
      }

      // update album thumbnails
      $albumData = $wpdb->get_results(
        'SELECT a.ALB_ID, ALB_THUMB, VID_ID
        FROM ' . $wpdb->prefix . 'utubevideo_album a
        LEFT JOIN ' . $wpdb->prefix . 'utubevideo_video v ON (ALB_THUMB=VID_URL)
        WHERE ALB_THUMB != "missing"',
        ARRAY_A
      );

      foreach ($albumData as $val) {
        $wpdb->update(
          $wpdb->prefix . 'utubevideo_album',
          ['ALB_THUMB' => $val['ALB_THUMB'] . $val['VID_ID']],
          ['ALB_ID' => $val['ALB_ID']]
        );
      }
    }
  }

  // update default plugin options
  private function updateDefaultOptions()
  {
    $options = get_option('utubevideo_main_opts');

    // initalize if empty
    if (empty($options))
      $options = [];

    $dft['skipMagnificPopup'] = 'no';
    $dft['skipSlugs'] = 'no';
    $dft['playerWidth'] = 1274;
    $dft['playerHeight'] = 720;
    $dft['playerControlTheme'] = 'dark';
    $dft['playerProgressColor'] = 'red';
    $dft['fancyboxOverlayOpacity'] = '0.85';
    $dft['fancyboxOverlayColor'] = '#000';
    $dft['thumbnailWidth'] = 150;
    $dft['thumbnailPadding'] = 10;
    $dft['thumbnailVerticalPadding'] = 10;
    $dft['thumbnailBorderRadius'] = 3;
    $dft['youtubeApiKey'] = '';
    $dft['youtubeAutoplay'] = 1;
    $dft['youtubeDetailsHide'] = 1;
    $dft['vimeoAutoplay'] = 1;
    $dft['vimeoDetailsHide'] = 1;
    $dft['showVideoDescription'] = true;
    $dft['version'] = CC_UTUBEVIDEOGALLERY_VERSION;
    $dft['sortFix'] = 'ok';
    $dft['albumSortFix'] = 'ok';
    $dft['setSlugs'] = true;
    $dft['filenameFix'] = true;

    $options = $options + $dft;

    update_option('utubevideo_main_opts', $options);
  }

  // recursive function for making sure slugs are unique
  private function checkslug($slug, $sluglist, $mark)
  {
    if (in_array($slug, $sluglist)) {
      $slug = $slug . '-' . $mark;
      $mark++;
      $this->checkslug($slug, $sluglist, $mark);
    } else
      return;
  }
}
