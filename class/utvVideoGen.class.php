<?php

if (!class_exists('utvVideoGen'))
{
  class utvVideoGen
  {
    private $_validAlbum = false;
    private $_aid, $_dir, $_atts, $_options, $_gallery, $_content = '';

    public function __construct($atts, &$options, $type = null, $albumId = null)
    {
      global $wpdb;

      //set atts array
      $this->_atts = shortcode_atts(array(
        'id' => null,
        'align' => 'left', //[left, right, center]
        'panelvideocount' => 14, //video count per panel view / page
        'theme' => 'light', //[light, dark, transparent]
        'icon' => 'red', //[default, red, blue]
        'controls' => 'false', //[true, false]
        'videocount' => null, //[any integer]
        'albumcount' => null //[any integer]
      ), $atts, 'utubevideo');

      //get gallery basic data
      $this->_gallery = $wpdb->get_results('SELECT DATA_SORT, DATA_DISPLAYTYPE FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = "' . $this->_atts['id'] . '"', ARRAY_A)[0];

      //set thumbnail cache folder location
      $this->_dir = wp_upload_dir()['baseurl'];

      //set options
      $this->_options = $options;

      //check for valid album id if provided
      $albumId = sanitize_text_field($albumId);

      if ($type == 'permalink' && $albumId != null)
      {
        $meta = $wpdb->get_results('SELECT ALB_ID, DATA_ID FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_SLUG = "' . $albumId . '"', ARRAY_A)[0];

        if ($meta)
        {
          $this->_aid = $meta['ALB_ID'];

          if ($meta['DATA_ID'] == $this->_atts['id'] && $this->_gallery['DATA_DISPLAYTYPE'] == 'album')
            $this->_validAlbum = true;
        }
      }
      elseif($type == 'query' && $albumId != null)
      {
        $args = explode('-', $albumId);

        //if valid aid token
        if (count($args) == 2)
        {
          $this->_aid = $args[0];
          $check = $args[1];

          if ($check == $this->_atts['id'] && $this->_gallery['DATA_DISPLAYTYPE'] == 'album')
            $this->_validAlbum = true;
        }
      }
    }

    public function printGallery()
    {
      global $wpdb;
      $this->printGalleryOpeningTags($this->_validAlbum);

      if ($this->_validAlbum)
      {
        //set limit if needed
        if ($this->_atts['videocount'] != null)
          $limitString = ' LIMIT ' . sanitize_text_field($this->_atts['videocount']);
        else
          $limitString = '';

        //get name of video album
        $meta = $wpdb->get_results('SELECT ALB_NAME, ALB_SORT, ALB_PUBLISH FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID = ' . $this->_aid, ARRAY_A)[0];

        //get videos in album
        if ($meta != null && $meta['ALB_PUBLISH'] == 1)
          $videos = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $this->_aid . ' && VID_PUBLISH = 1 ORDER BY VID_POS ' . $meta['ALB_SORT'] . $limitString, ARRAY_A);

        global $post;

        //if there are videos in the video album
        if (!empty($videos))
        {
          //create html for breadcrumbs
          $this->_content .= '<div class="utv-breadcrumb"><a href="' . get_permalink($post->ID) . '">' . __('Albums', 'utvg') . '</a><span class="utv-albumcrumb"> | ' . stripslashes($meta['ALB_NAME']) . '</span></div>';

          $this->printGalleryOpeningContainer();

          //create html for each video
          foreach ($videos as $video)
            $this->_content .= $this->printVideo($video);

          $this->printGalleryClosingContainer();
        }
        //if the video album is empty
        else
        {
          $this->_content .= '<div class="utv-breadcrumb"><a href="' . get_permalink($post->ID) . '">' . __('Go Back', 'utvg') . '</a></div>';
          $this->_content .= '<p>' . __('Sorry... there appear to be no videos for this album yet.', 'utvg') . '</p>';
        }
      }
      else
      {
        //set limit if needed
        if ($this->_atts['albumcount'] != null)
          $limitString = ' LIMIT ' . sanitize_text_field($this->_atts['albumcount']);
        else
          $limitString = '';

        //get video albums in the gallery
        $albums = $wpdb->get_results('SELECT ' . $wpdb->prefix . 'utubevideo_album.ALB_ID, ALB_SLUG, ALB_NAME, ALB_THUMB, ALB_SORT, VID_SOURCE, VID_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_album LEFT JOIN ' . $wpdb->prefix . 'utubevideo_video ON ALB_THUMB = CONCAT(VID_URL, VID_ID) WHERE DATA_ID = ' . $this->_atts['id'] . ' && ALB_PUBLISH = 1 ORDER BY ' . $wpdb->prefix . 'utubevideo_album.ALB_POS ' . $this->_gallery['DATA_SORT'] . $limitString, ARRAY_A);

        //if there are video albums in the gallery
        if (!empty($albums))
        {
          //if skipalbums in set to true
          if ($this->_gallery['DATA_DISPLAYTYPE'] == 'video')
          {
            $this->printGalleryOpeningContainer();

            //fetch video data for above albums
            $videos = Array();

            foreach ($albums as $val)
            {
              $temp = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $val['ALB_ID'] . ' && VID_PUBLISH = 1 ORDER BY VID_POS ' . $val['ALB_SORT'], ARRAY_A);
              $videos = array_merge($videos, $temp);
            }

            //limit videos returned
            if ($this->_atts['videocount'] != null)
              $videos = array_slice($videos, 0, $this->_atts['videocount']);

            //create html for all videos in gallery
            foreach ($videos as $video)
              $this->_content .= $this->printVideo($video);
          }
          //if display type is album
          else
          {
            //create html for breadcrumbs
            $this->_content .= '<div class="utv-breadcrumb"><span class="utv-albumcrumb">' . __('Albums', 'utvg') . '</span></div>';

            $this->printGalleryOpeningContainer();

            //create html for each video album
            foreach ($albums as $album)
            {
              //use permalinks for pages, else use GET parameters
              if (is_page() && $this->_options['skipSlugs'] == 'no')
                $this->_content .= $this->printAlbum($album, 'permalink');
              else
                $this->_content .= $this->printAlbum($album);
            }
          }

          $this->printGalleryClosingContainer();
        }
        //if there are no video albums in the gallery
        else
          $this->_content .= '<p>' . __('Sorry... there appear to be no video albums yet.', 'utvg') . '</p>';
      }

      $this->printGalleryClosingTags();

      return $this->_content;
    }

    public function printPanel()
    {
      global $wpdb;

      //set limit if needed
      if ($this->_atts['albumcount'] != null)
        $limitString = ' LIMIT ' . sanitize_text_field($this->_atts['albumcount']);
      else
        $limitString = '';

      //fetch album ids
      $albumIds = $wpdb->get_results('SELECT ALB_ID, ALB_SORT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = "' . $this->_atts['id'] . '" && ALB_PUBLISH = 1 ORDER BY ALB_POS ' . $this->_gallery['DATA_SORT'] . $limitString, ARRAY_A);

      if (!empty($albumIds))
      {
        //fetch video data for above albums
        $videos = Array();

        foreach ($albumIds as $val)
        {
          $temp = $wpdb->get_results('SELECT VID_ID, VID_NAME, VID_URL, VID_THUMBTYPE, VID_QUALITY, VID_CHROME, VID_SOURCE, VID_STARTTIME, VID_ENDTIME FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $val['ALB_ID'] . ' && VID_PUBLISH = 1 ORDER BY VID_POS ' . $val['ALB_SORT'], ARRAY_A);
          $videos = array_merge($videos, $temp);
        }

        //limit videos returned
        if ($this->_atts['videocount'] != null)
          $videos = array_slice($videos, 0, $this->_atts['videocount']);

        if (!empty($videos))
        {
          $this->printPanelOpeningTags();
          $this->printPanelOpeningContainer($videos[0]);

          $index = 0;

          foreach ($videos as $video)
          {
            $this->printPanelVideo($video, $index);
            $index++;
          }

          $this->printPanelPaging(count($videos));
          $this->printPanelClosingContainer();
          $this->printPanelClosingTags();
        }
        else
          $this->_content .= '<p>' . __('Sorry... there appear to be no videos yet.', 'utvg') . '</p>';
      }
      else
        $this->_content .= '<p>' . __('Sorry... there appear to be no videos yet.', 'utvg') . '</p>';

      return $this->_content;
    }

    private function getThumbnailType($source, $type)
    {
      if ($type == 'square')
        $extraClass = ($source == 'vimeo' ? 'utv-vimeo-sq' : 'utv-youtube-sq');
      else
        $extraClass = ($source == 'vimeo' ? 'utv-vimeo-rt' : 'utv-youtube-rt');

      return $extraClass;
    }

    private function printGalleryOpeningTags($videosView)
    {
      //get gallery icon type
      if ($this->_atts['icon'] == 'blue')
        $iconClass = 'utv-icon-blue';
      elseif ($this->_atts['icon'] == 'red')
        $iconClass = 'utv-icon-red';
      else
        $iconClass = 'utv-icon-default';

      //get album or videos type
      if ($videosView || $this->_gallery['DATA_DISPLAYTYPE'] == 'video')
        $extraClasses = 'utv-videos';
      else
        $extraClasses = 'utv-albums';

      $this->_content .= '<div class="utv-container utv-invis ' . $extraClasses . ' ' . $iconClass . '">';
    }

    private function printGalleryClosingTags()
    {
      $this->_content .= '</div>';
    }

    private function printGalleryOpeningContainer()
    {
      if ($this->_atts['align'] == 'center')
        $css = 'class="utv-outer-wrapper utv-align-center"';
      elseif ($this->_atts['align'] == 'right')
        $css = 'class="utv-outer-wrapper utv-align-right"';
      else
        $css = 'class="utv-outer-wrapper"';

      $this->_content .= '<div ' . $css . '><div class="utv-inner-wrapper">';
    }

    private function printGalleryClosingContainer()
    {
      $this->_content .= '</div></div>';
    }

    private function printPanelOpeningTags()
    {
      //get panel theme
      if ($this->_atts['theme'] == 'dark')
        $themeClass = 'utv-panel-dark';
      elseif ($this->_atts['theme'] == 'transparent')
        $themeClass = 'utv-panel-transparent';
      else
        $themeClass = 'utv-panel-light';

      //get panel icon type
      if ($this->_atts['icon'] == 'blue')
        $iconClass = 'utv-icon-blue';
      elseif ($this->_atts['icon'] == 'red')
        $iconClass = 'utv-icon-red';
      else
        $iconClass = 'utv-icon-default';

      //prepare variables
      $classString = 'utv-panel utv-invis ' . $themeClass . ' ' . $iconClass;
      $dataString = 'data-panel-video-count="' . $this->_atts['panelvideocount'] . '" data-visible-controls="' . $this->_atts['controls'] . '"';

      //set content
      $this->_content .= '<div class="' . $classString . '" ' . $dataString . '>';
    }

    private function printPanelClosingTags()
    {
      $this->_content .= '</div>';
    }

    private function printPanelOpeningContainer($firstvideo)
    {
      //generate url for first video in gallery
      if ($firstvideo['VID_SOURCE'] == 'youtube')
        $url = 'https://www.youtube.com/embed/' . $firstvideo['VID_URL'] . '?modestbranding=1&rel=0&showinfo=' . ($this->_options['youtubeDetailsHide'] ? '0' : '1') . '&autohide=1&controls=' . ($this->_atts['controls'] == 'true' ? '1' : '0') . '&theme=' . $this->_options['playerControlTheme'] . '&color=' . $this->_options['playerProgressColor'] . '&autoplay=0&iv_load_policy=3&start=' . $firstvideo['VID_STARTTIME'] . '&end=' . $firstvideo['VID_ENDTIME'];
      elseif ($firstvideo['VID_SOURCE'] == 'vimeo')
        $url = 'https://player.vimeo.com/video/' . $firstvideo['VID_URL'] . '?autoplay=0&autopause=0&' . ($this->_options['vimeoDetailsHide'] ? 'title=0&portrait=0&byline=0&badge=0' : 'title=1&portrait=1&byline=1&badge=1') . '#t=' . $firstvideo['VID_STARTTIME'];
      else
        $url = '';

      $this->_content .= '<div class="utv-video-panel-wrapper">
            <iframe class="utv-video-panel-iframe" src="' . $url . '" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="utv-video-panel-controls">
            <i class="fa fa-chevron-left utv-video-panel-bkarrow"></i>
            <span class="utv-video-panel-title">' . stripslashes($firstvideo['VID_NAME']) . '</span>
            <i class="fa fa-chevron-right utv-video-panel-fwarrow"></i>
            <div class="utv-clear"></div>
          </div>
          <div class="utv-video-panel-thumbnails utv-align-center"><div class="utv-inner-wrapper">';
    }

    private function printPanelClosingContainer()
    {
      $this->_content .= '</div></div>';
    }

    private function printPanelPaging($videoCount)
    {
      $totalpages = ceil($videoCount / $this->_atts['panelvideocount']);

      $this->_content .= '<div class="utv-video-panel-paging">';

      for ($i = 1; $i <= $totalpages; $i++)
        $this->_content .= '<span class="utv-panel-paging-handle' . ($i == 1 ? ' utv-panel-paging-active' : '') . '">' . $i . '</span>';

      $this->_content .= '</div>';
    }

    private function printVideo(&$data)
    {
      if ($data['VID_SOURCE'] == 'youtube')
        $href = 'https://www.youtube.com/embed/' . $data['VID_URL'] . '?modestbranding=1&rel=0&showinfo=' . ($this->_options['youtubeDetailsHide'] ? '0' : '1') . '&autohide=1&autoplay=' . $this->_options['youtubeAutoplay'] . '&iv_load_policy=3&color=' . $this->_options['playerProgressColor'] . '&vq=' . $data['VID_QUALITY'] . '&theme=' . $this->_options['playerControlTheme'] . '&controls=' . $data['VID_CHROME'] . '&start=' . $data['VID_STARTTIME'] . '&end=' . $data['VID_ENDTIME'];
      elseif ($data['VID_SOURCE'] == 'vimeo')
        $href = 'https://player.vimeo.com/video/' . $data['VID_URL'] . '?autoplay=' . $this->_options['vimeoAutoplay'] . '&autopause=0&' . ($this->_options['vimeoDetailsHide'] ? 'title=0&portrait=0&byline=0&badge=0' : 'title=1&portrait=1&byline=1&badge=1') . '#t=' . $data['VID_STARTTIME'];

      return '<div class="utv-thumb ' . $this->getThumbnailType($data['VID_SOURCE'], $data['VID_THUMBTYPE']) . '">
        <a href="' . $href . '" title="' . stripslashes($data['VID_NAME']) . '" class="utv-popup">
          <span class="utv-play-btn"></span>
          <img src="' . $this->_dir . '/utubevideo-cache/' . $data['VID_URL'] . $data['VID_ID'] . '.jpg" data-rjs="2">
        </a>
        <span>' . stripslashes($data['VID_NAME']) . '</span>
      </div>';
    }

    private function printAlbum(&$data, $linkType = '')
    {
      if ($linkType == 'permalink')
        $link = get_site_url() . '/' . get_query_var('pagename') . '/album/' . $data['ALB_SLUG'] . '/';
      else
      {
        $currentPage = get_permalink();

        if (strpos($currentPage, '?') !== false)
          $link = $currentPage . '&aid=' . $data['ALB_ID'] . '-' . $this->_atts['id'];
        else
          $link = $currentPage . '?aid=' . $data['ALB_ID'] . '-' . $this->_atts['id'];
      }

      return '<div class="utv-thumb utv-album ' . $this->getThumbnailType($data['VID_SOURCE'], $data['VID_THUMBTYPE']) . '">
        <a href="' . $link . '">
          <img src="' . $this->_dir . '/utubevideo-cache/' . $data['ALB_THUMB']  . '.jpg" data-rjs="2"/>
        </a>
        <span>' . stripslashes($data['ALB_NAME']) . '</span>
      </div>';
    }

    private function printPanelVideo(&$data, $index)
    {
      //set variables
      $classString = 'utv-thumb ' . $this->getThumbnailType($data['VID_SOURCE'], $data['VID_THUMBTYPE']) . ($index == 0 ? ' utv-panel-video-active' : '');
      $dataString = 'data-index="' . $index . '" data-type="' . $data['VID_SOURCE'] . '" data-id="' . $data['VID_URL'] . '" data-name="' . stripslashes($data['VID_NAME']) . '" data-stime="' . $data['VID_STARTTIME'] . '" data-etime="' . $data['VID_ENDTIME'] . '"';

      //set content
      $this->_content .= '<div class="' . $classString . '"' . $dataString . '>
        <a>
          <span class="utv-play-btn"></span>
          <img src="' . $this->_dir . '/utubevideo-cache/' . $data['VID_URL'] . $data['VID_ID'] . '.jpg" data-rjs="2">
        </a>
        <span>' . stripslashes($data['VID_NAME']) . '</span>
      </div>';
    }
  }
}

?>
