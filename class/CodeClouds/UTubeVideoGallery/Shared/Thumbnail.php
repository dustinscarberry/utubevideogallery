<?php

namespace CodeClouds\UTubeVideoGallery\Shared;

class Thumbnail
{
  private $_options;
  private $_destinationPath;
  private $_videoID;
  private $_videoSource;
  private $_videoSlug;
  private $_thumbnailType;
  private $_sourceURL;
  private $_imageQuality = 95;
  private $_4kImageQuality = 65;

  public function __construct($videoID, $options)
  {
    $this->_options = $options;

    $dir = wp_upload_dir();
    $this->_destinationPath = $dir['basedir'] . '/utubevideo-cache/';
  }

  public function save()
  {
    global $wpdb;

    if (!$videoID)
      return false;

    $this->setThumbnailData();
    $this->setSourceURL();

    return 'yes';

return $this->saveThumbnail();
    if (!$this->saveThumbnail())
      return false;

    return true;
  }

  private function saveThumbnail()
  {
    $image = wp_get_image_editor($this->_sourceURL);
    $baseFilename = $this->_videoSlug . $this->_videoID;

    return $baseFilename;

    if (is_wp_error($image))
    {
      $image = wp_get_image_editor(plugins_url('missing.jpg', dirname(__FILE__)));

      if (is_wp_error($image))
        return false;//image magick or gd is required
    }

    if ($this->_thumbnailType == 'square')
    {
      $image->resize($this->_options['thumbnailWidth'] * 2, $this->_options['thumbnailWidth'] * 2, true);
      $image->set_quality(65);
      $image->save($this->_destinationPath . $baseFilename . '@2x.jpg');

      $image->resize($this->_options['thumbnailWidth'], $this->_options['thumbnailWidth'], true);
      $image->set_quality(95);
      $image->save($this->_destinationPath . $baseFilename . '.jpg');
    }
    else
    {
      $image->resize($this->_options['thumbnailWidth'] * 2, $this->_options['thumbnailWidth'] * 2);
      $image->set_quality(65);
      $image->save($this->_destinationPath . $baseFilename . '@2x.jpg');

      $image->resize($this->_options['thumbnailWidth'], $this->_options['thumbnailWidth']);
      $image->set_quality(95);
      $image->save($this->_destinationPath . $baseFilename . '.jpg');
    }

    return true;
  }

  private function setThumbnailData()
  {
    $thumbnailData = $wpdb->get_results(
      'SELECT d.DATA_THUMBTYPE AS THUMBNAIL_TYPE, v.VID_ID AS VIDEO_ID, v.VID_SOURCE AS VIDEO_SOURCE, v.VID_URL AS VIDEO_SLUG FROM '
      . $wpdb->prefix . 'utubevideo_video v INNER JOIN '
      . $wpdb->prefix . 'utubevideo_album a ON v.ALB_ID = a.ALB_ID INNER JOIN '
      . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID '
      . 'WHERE v.VID_ID = ' . $videoID
    );

    if (!$thumbnailData)
      return false;

    $thumbnailData = $thumbnailData[0];
    $this->_videoID = $thumbnailData->VIDEO_ID;
    $this->_videoSource = $thumbnailData->VIDEO_SOURCE;
    $this->_videoSlug = $thumbnailData->VIDEO_SLUG;
    $this->_thumbnailType = $thumbnailData->THUMBNAIL_TYPE;
  }

  private function setSourceURL()
  {
    $thumbnailData = $this->getThumbnailData();

    if ($thumbnailData->VIDEO_SOURCE == 'youtube')
      $this->_sourceURL = $this->getYouTubeSource();
    elseif ($thumbnailData->VIDEO_SOURCE == 'vimeo')
      $this->_sourceURL = $this->getVimeoSource();
  }

  private function getYouTubeSource()
  {
    return 'https://img.youtube.com/vi/' . $thumbnailData->VID_URL . '/0.jpg';
  }

  private function getVimeoSource()
  {
    $data = $this->queryAPI('https://vimeo.com/api/v2/video/' . $thumbnailData->VID_URL . '.json');
    return $data['thumbnail_large'];
  }

  private function queryAPI($query)
  {
    $data = wp_remote_get($query);
    return json_decode($data['body']);
  }
}
