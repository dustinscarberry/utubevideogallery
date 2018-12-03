<?php
/*
Plugin Name: uTubeVideo Gallery
Plugin URI: http://www.codeclouds.net/
Description: This plugin allows you to create YouTube video galleries to embed in a WordPress site.
Version: 1.9.8
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

use CodeClouds\UTubeVideoGallery\Dashboard;
use CodeClouds\UTubeVideoGallery\UI;
use CodeClouds\UTubeVideoGallery\API\GalleryAPIv1;
use CodeClouds\UTubeVideoGallery\API\AlbumAPIv1;
use CodeClouds\UTubeVideoGallery\API\VideoAPIv1;
use CodeClouds\UTubeVideoGallery\API\GalleryDataAPIv1;
use CodeClouds\UTubeVideoGallery\API\PlaylistAPIv1;
use CodeClouds\UTubeVideoGallery\API\VideoOrderAPIv1;
use CodeClouds\UTubeVideoGallery\API\AlbumOrderAPIv1;
use CodeClouds\UTubeVideoGallery\API\YouTubePlaylistAPIv1;
use CodeClouds\UTubeVideoGallery\API\VimeoPlaylistAPIv1;
use CodeClouds\UTubeVideoGallery\API\SettingsAPIv1;

if (!class_exists('CodeClouds\UTubeVideoGallery\App'))
{
  class App
  {
    private $_options;
    const CURRENT_VERSION = '1.9.8';

    public function __construct()
    {
      //register autoloader
      spl_autoload_register([$this, 'autoloader']);

      //load options
      $this->_options = get_option('utubevideo_main_opts');

      //call upgrade check if in dashboard
      if (is_admin())
        $this->upgrade_check();

      //load external files
      $this->load_dependencies();

      //hook APIs
      $this->hookAPIs();

      //activation hook
      register_activation_hook(__FILE__, [$this, 'activate']);





      $this->maintenance();
    }

    //activate plugin
    public function activate($network)
    {
      //multisite activation
      if (
        function_exists('is_multisite')
        && is_multisite()
        && $network)
      {
        global $wpdb;

        $old_blog =  $wpdb->blogid;
        $blogids =  $wpdb->get_col('SELECT blog_id FROM ' .  $wpdb->blogs);

        foreach ($blogids as $blog_id)
        {
          switch_to_blog($blog_id);
          $this->maintenance();
        }

        switch_to_blog($old_blog);
      }

      //single site activation
      $this->maintenance();
    }

    //hook apis
    public function hookAPIs()
    {
      //hook APIs
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
    }

    //version check for updates
    private function upgrade_check()
    {
      if (
        !isset($this->_options['version'])
        || $this->_options['version'] < self::CURRENT_VERSION
      )
      {
        $this->maintenance();
        $this->_options['version'] = self::CURRENT_VERSION;
        update_option('utubevideo_main_opts', $this->_options);
      }
    }

    //load dependencies for plugin
    private function load_dependencies()
    {
      load_plugin_textdomain('utvg', false, 'utubevideo-gallery/language');

      //load app or dashboard
      if (is_admin())
        new Dashboard(self::CURRENT_VERSION);
      else
        new UI(self::CURRENT_VERSION);
    }

    public function autoloader($className)
    {
      if (strpos($className, 'CodeClouds\UTubeVideoGallery') !== false)
      {
        $className = str_replace('\\', '/', $className);
        include_once('class/' . $className . '.php');
      }
    }

    private function maintenance()
    {
      //set up globals
      global $wpdb;

      //get directory path
      $dirpath = dirname(__FILE__);

      //extra include due to libaries not being loaded at this hook point
      if (!function_exists('wp_get_current_user'))
          require_once(ABSPATH . 'wp-includes/pluggable.php');

      //create database tables for plugin
      require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

      $tbname[0] = $wpdb->prefix . 'utubevideo_dataset';
      $tbname[1] = $wpdb->prefix . 'utubevideo_album';
      $tbname[2] = $wpdb->prefix . 'utubevideo_video';
      $tbname[3] = $wpdb->prefix . 'utubevideo_playlist';

      $sql = "CREATE TABLE $tbname[0] (
        DATA_ID int(11) NOT NULL AUTO_INCREMENT,
        DATA_NAME varchar(150) NOT NULL,
        DATA_SORT varchar(4) DEFAULT 'desc' NOT NULL,
        DATA_DISPLAYTYPE varchar(6) DEFAULT 'album' NOT NULL,
        DATA_UPDATEDATE int(11) NOT NULL,
        DATA_ALBCOUNT int(4) DEFAULT '0' NOT NULL,
        DATA_THUMBTYPE varchar(9) DEFAULT 'rectangle' NOT NULL,
        UNIQUE KEY DATA_ID (DATA_ID)
      );
      CREATE TABLE $tbname[1] (
        ALB_ID int(11) NOT NULL AUTO_INCREMENT,
        ALB_NAME varchar(150) NOT NULL,
        ALB_SLUG varchar(50) DEFAULT '--empty--' NOT NULL,
        ALB_THUMB varchar(40) NOT NULL,
        ALB_SORT varchar(4) DEFAULT 'desc' NOT NULL,
        ALB_POS int(11) NOT NULL,
        ALB_PUBLISH int(11) DEFAULT 1 NOT NULL,
        ALB_UPDATEDATE int(11) NOT NULL,
        ALB_VIDCOUNT int(4) DEFAULT '0' NOT NULL,
        DATA_ID int(11) NOT NULL,
        UNIQUE KEY ALB_ID (ALB_ID)
      );
      CREATE TABLE $tbname[2] (
        VID_ID int(11) NOT NULL AUTO_INCREMENT,
        VID_SOURCE varchar(15) NOT NULL,
        VID_NAME varchar(150) NOT NULL,
        VID_URL varchar(40) NOT NULL,
        VID_THUMBTYPE varchar(9) DEFAULT 'rectangle' NOT NULL,
        VID_QUALITY varchar(6) DEFAULT 'large' NOT NULL,
        VID_CHROME tinyint(1) DEFAULT 1 NOT NULL,
        VID_STARTTIME varchar(10) DEFAULT '' NOT NULL,
        VID_ENDTIME varchar(10) DEFAULT '' NOT NULL,
        VID_POS int(11) NOT NULL,
        VID_PUBLISH int(11) DEFAULT 1 NOT NULL,
        VID_UPDATEDATE int(11) NOT NULL,
        ALB_ID int(11) NOT NULL,
        PLAY_ID int(11),
        UNIQUE KEY VID_ID (VID_ID)
      );
      CREATE TABLE $tbname[3] (
        PLAY_ID int(11) NOT NULL AUTO_INCREMENT,
        PLAY_TITLE varchar(150) NOT NULL,
        PLAY_SOURCE varchar(15) NOT NULL,
        PLAY_SOURCEID varchar(60) NOT NULL,
        PLAY_QUALITY varchar(6) NOT NULL,
        PLAY_CHROME tinyint(1) NOT NULL,
        PLAY_UPDATEDATE int(11) NOT NULL,
        ALB_ID int(11) NOT NULL,
        UNIQUE KEY PLAY_ID (PLAY_ID)
      );";

      dbDelta($sql);

      //try to update database tables charset
      foreach ($tbname as $table)
        maybe_convert_table_to_utf8mb4($table);

      //set up main option defaults if needed

      //initalize main if empty
      if (empty($this->_options))
        $this->_options = [];

      //fix video sorting if not done yet
      if (!isset($this->_options['sortFix']))
      {
        $albumIds = $wpdb->get_results(
          'SELECT ALB_ID
          FROM ' . $wpdb->prefix . 'utubevideo_album',
          ARRAY_A
        );

        foreach ($albumIds as $value)
        {
          $videoIds = $wpdb->get_results(
            'SELECT VID_ID
            FROM ' . $wpdb->prefix . 'utubevideo_video
            WHERE ALB_ID = ' . $value['ALB_ID'] .
            ' ORDER BY VID_POS',
            ARRAY_A
          );

          $posCounter = 0;

          foreach ($videoIds as $video)
          {
            $wpdb->update($wpdb->prefix . 'utubevideo_video',
              ['VID_POS' => $posCounter],
              ['VID_ID' => $video['VID_ID']]
            );

            $posCounter++;
          }
        }

        $dft['sortFix'] = 'ok';
      }

      //album sort fix
      if (!isset($this->_options['albumSortFix']))
      {
        $galleryIds = $wpdb->get_results(
          'SELECT DATA_ID
          FROM ' . $wpdb->prefix . 'utubevideo_dataset',
          ARRAY_A
        );

        foreach ($galleryIds as $value)
        {
          $albumIds = $wpdb->get_results(
            'SELECT ALB_ID
            FROM ' . $wpdb->prefix . 'utubevideo_album
            WHERE DATA_ID = ' . $value['DATA_ID'] .
            ' ORDER BY ALB_POS',
            ARRAY_A
          );

          $posCounter = 0;

          foreach ($albumIds as $album)
          {
            $wpdb->update($wpdb->prefix . 'utubevideo_album',
              ['ALB_POS' => $posCounter],
              ['ALB_ID' => $album['ALB_ID']]
            );

            $posCounter++;
          }
        }

        $dft['albumSortFix'] = 'ok';
      }

      //set slugs if not set yet
      if (!isset($this->_options['setSlugs']))
      {
        $mark = 1;
        $sluglist = [];

        $data = $wpdb->get_results(
          'SELECT ALB_ID, ALB_NAME
          FROM ' . $wpdb->prefix . 'utubevideo_album',
          ARRAY_A
        );

        foreach ($data as $value)
        {
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

        $dft['setSlugs'] = true;
      }

      //set filenames in not set yet
      if (!isset($this->_options['filenameFix']))
      {
        //suppress odd warning messages temporarily
        error_reporting(0);

        //rename thumbnails
        $dir = wp_upload_dir();
        $dir = $dir['basedir'] . '/utubevideo-cache/';
        $data = $wpdb->get_results(
          'SELECT VID_ID, VID_URL
          FROM ' . $wpdb->prefix . 'utubevideo_video',
          ARRAY_A
        );

        foreach ($data as $val)
        {
          $old = $dir . $val['VID_URL'] . '.jpg';
          $new = $dir . $val['VID_URL'] . $val['VID_ID'] . '.jpg';

          rename($old, $new);
        }

        //update album thumbnails
        $albumData = $wpdb->get_results(
          'SELECT a.ALB_ID, ALB_THUMB, VID_ID
          FROM ' . $wpdb->prefix . 'utubevideo_album a
          LEFT JOIN ' . $wpdb->prefix . 'utubevideo_video v ON (ALB_THUMB=VID_URL)
          WHERE ALB_THUMB != "missing"',
          ARRAY_A
        );

        foreach ($albumData as $val)
        {
          $wpdb->update(
            $wpdb->prefix . 'utubevideo_album',
            ['ALB_THUMB' => $val['ALB_THUMB'] . $val['VID_ID']],
            ['ALB_ID' => $val['ALB_ID']]
          );
        }

        $dft['filenameFix'] = true;
      }

      //add @2x images if needed
      if (!isset($this->_options['retinaFix']))
      {
        //suppress odd warning messages temporarily
        error_reporting(0);

        //get thumbnail directory
        $dir = wp_upload_dir();
        $dir = $dir['basedir'] . '/utubevideo-cache/';

        //get video listing
        $videoData = $wpdb->get_results(
          'SELECT VID_ID, VID_URL, VID_SOURCE, VID_THUMBTYPE, DATA_THUMBTYPE
          FROM ' . $wpdb->prefix . 'utubevideo_video v
          INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON a.ALB_ID = v.ALB_ID
          INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON d.DATA_ID = a.DATA_ID',
          ARRAY_A
        );

        //process each video thumbnail if not avaiable
        foreach($videoData as $val)
        {
          $filename = $val['VID_URL'] . $val['VID_ID'];

          if (!file_exists($dir . $filename . '@2x.jpg'))
          {
            if ($val['VID_SOURCE'] == 'youtube')
              $sourceURL = 'http://img.youtube.com/vi/' . $val['VID_URL'] . '/0.jpg';
            elseif ($val['VID_SOURCE'] == 'vimeo')
            {
              $data = $this->queryAPI('https://vimeo.com/api/v2/video/' . $val['VID_URL'] . '.json');
              $sourceURL = $data[0]['thumbnail_large'];
            }

            $this->saveThumbnail($sourceURL, $filename, $val['DATA_THUMBTYPE'], true);
          }
        }

        $dft['retinaFix'] = true;
      }

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
      $dft['version'] = self::CURRENT_VERSION;

      $this->_options = $this->_options + $dft;

      update_option('utubevideo_main_opts', $this->_options);

      //create photo cache directory if needed
      $dir = wp_upload_dir();
      $dir = $dir['basedir'];
      wp_mkdir_p($dir . '/utubevideo-cache');

      //copy 'missing.jpg' into cache directory
      copy(plugins_url('public/img/missing.jpg', __FILE__), $dir . '/utubevideo-cache/missing.jpg');

      //add rewrite rules to rewrite engine
      add_action('init', [$this, 'setup_rewrite_rules']);
    }

    /* Extra Functions For Backwards Compatibility */

    //recursive function for making sure slugs are unique
    private function checkslug($slug, $sluglist, $mark)
    {
      if (in_array($slug, $sluglist))
      {
        $slug = $slug . '-' . $mark;
        $mark++;
        $this->checkslug($slug, $sluglist, $mark);
      }
      else
        return;
    }

    public function saveThumbnail($sourceURL, $destFilename, $thumbType, $suppressErrors = false)
    {
      $basePath = wp_upload_dir();
      $basePath = $basePath['basedir'] . '/utubevideo-cache/';

      $image = wp_get_image_editor($sourceURL);
      //valid video thumbnail image
      if (!is_wp_error($image))
      {
        if ($thumbType == 'square')
        {
          $image->resize($this->_options['thumbnailWidth'] * 2, $this->_options['thumbnailWidth'] * 2, true);
          $image->set_quality(65);
          $image->save($basePath . $destFilename . '@2x.jpg');
          $image->resize($this->_options['thumbnailWidth'], $this->_options['thumbnailWidth'], true);
          $image->set_quality(95);
          $image->save($basePath . $destFilename . '.jpg');
        }
        else
        {
          $image->resize($this->_options['thumbnailWidth'] * 2, $this->_options['thumbnailWidth'] * 2);
          $image->set_quality(65);
          $image->save($basePath . $destFilename . '@2x.jpg');
          $image->resize($this->_options['thumbnailWidth'], $this->_options['thumbnailWidth']);
          $image->set_quality(95);
          $image->save($basePath . $destFilename . '.jpg');
        }
        return true;
      }
      //invalid video thumbnail image or blank
      elseif (is_wp_error($image))
      {
        //reload missing image into editor
        $image = wp_get_image_editor(plugins_url('missing.jpg', dirname(__FILE__)));
        if (!is_wp_error($image))
        {
          if ($thumbType == 'square')
          {
            $image->resize($this->_options['thumbnailWidth'] * 2, $this->_options['thumbnailWidth'] * 2, true);
            $image->set_quality(65);
            $image->save($basePath . $destFilename . '@2x.jpg');
            $image->resize($this->_options['thumbnailWidth'], $this->_options['thumbnailWidth'], true);
            $image->set_quality(95);
            $image->save($basePath . $destFilename . '.jpg');
          }
          else
          {
            $image->resize($this->_options['thumbnailWidth'] * 2, $this->_options['thumbnailWidth'] * 2);
            $image->set_quality(65);
            $image->save($basePath . $destFilename . '@2x.jpg');
            $image->resize($this->_options['thumbnailWidth'], $this->_options['thumbnailWidth']);
            $image->set_quality(95);
            $image->save($basePath . $destFilename . '.jpg');
          }
          return true;
        }
        else
          return true;
      }
      else
        return true;
    }

    public function queryAPI($query)
    {
      $data = wp_remote_get($query);
      return json_decode($data['body'], true);
    }
  }

  //bootrap
  new App();
}
