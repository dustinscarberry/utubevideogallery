<?php

namespace CodeClouds\UTubeVideoGallery\Shared;

class Thumbnail
{
  private $_pluginOptions;
  private $_destinationPath;
  private $_videoID;
  private $_videoSource;
  private $_videoSlug;
  private $_thumbnailType;
  private $_sourceURL;
  private $_imageQuality = 95;
  private $_4kImageQuality = 65;

  //constructor
  public function __construct($videoID, $options = [])
  {
    $this->_videoID = $videoID;
    $this->_pluginOptions = get_option('utubevideo_main_opts');

    $dir = wp_upload_dir();
    $this->_destinationPath = $dir['basedir'] . '/utubevideo-cache/';
  }

  //load data and save thumbnails
  public function save()
  {
    if (!$this->_videoID)
      return false;

    $this->setThumbnailData();
    $this->setSourceURL();

    if (!$this->saveThumbnail())
      return false;

    return true;
  }

  //save thumbnails
  private function saveThumbnail()
  {
    $image = wp_get_image_editor($this->_sourceURL);
    $baseFilename = $this->_videoSlug . $this->_videoID;

    var_dump($image);

    if (is_wp_error($image))
    {
      $image = wp_get_image_editor(plugins_url('missing.jpg', dirname(__FILE__)));

      if (is_wp_error($image))
        return false;//image magick or gd is required or bad api key
    }

    if ($this->_thumbnailType == 'square')
    {
      $image->resize($this->_pluginOptions['thumbnailWidth'] * 2, $this->_pluginOptions['thumbnailWidth'] * 2, true);
      $image->set_quality($this->_4kImageQuality);
      $image->save($this->_destinationPath . $baseFilename . '@2x.jpg');

      $image->resize($this->_pluginOptions['thumbnailWidth'], $this->_pluginOptions['thumbnailWidth'], true);
      $image->set_quality($this->_imageQuality);
      $image->save($this->_destinationPath . $baseFilename . '.jpg');
    }
    else
    {
      $image->resize($this->_pluginOptions['thumbnailWidth'] * 2, $this->_pluginOptions['thumbnailWidth'] * 2);
      $image->set_quality($this->_4kImageQuality);
      $image->save($this->_destinationPath . $baseFilename . '@2x.jpg');

      $image->resize($this->_pluginOptions['thumbnailWidth'], $this->_pluginOptions['thumbnailWidth']);
      $image->set_quality($this->_imageQuality);
      $image->save($this->_destinationPath . $baseFilename . '.jpg');
    }

    return true;
  }

  //load thumbnail data
  private function setThumbnailData()
  {
    global $wpdb;

    $thumbnailData = $wpdb->get_results(
      'SELECT d.DATA_THUMBTYPE AS THUMBNAIL_TYPE, v.VID_ID AS VIDEO_ID, v.VID_SOURCE AS VIDEO_SOURCE, v.VID_URL AS VIDEO_SLUG FROM '
      . $wpdb->prefix . 'utubevideo_video v INNER JOIN '
      . $wpdb->prefix . 'utubevideo_album a ON v.ALB_ID = a.ALB_ID INNER JOIN '
      . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID '
      . 'WHERE v.VID_ID = ' . $this->_videoID
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
    if ($this->_videoSource == 'youtube')
      $this->_sourceURL = $this->getYouTubeSource();
    elseif ($this->_videoSource == 'vimeo')
      $this->_sourceURL = $this->getVimeoSource();
  }

  private function getYouTubeSource()
  {
    $data = $this->queryAPI('https://www.googleapis.com/youtube/v3/videos?part=id,snippet&id=' . $this->_videoSlug . '&key=' . $this->_pluginOptions['youtubeApiKey']);

    if (!$data)
      return false;

    $thumbnailSources = $data->items[0]->snippet->thumbnails;

    end($thumbnailSources);
    $thumbnailKey = key($thumbnailSources);

    return $thumbnailSources->{$thumbnailKey}->url;
  }

  private function getVimeoSource()
  {
    $data = $this->queryAPI('https://vimeo.com/api/v2/video/' . $this->_videoSlug . '.json');

    if (!$data)
      return false;

    $data = $data[0];

    return $data->thumbnail_large;
  }

  private function queryAPI($query)
  {
    $data = wp_remote_get($query);
    return json_decode($data['body']);
  }
}
