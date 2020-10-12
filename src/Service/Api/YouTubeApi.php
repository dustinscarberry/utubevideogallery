<?php

namespace CodeClouds\UTubeVideoGallery\Service\Api;

use CodeClouds\UTubeVideoGallery\Service\Utility;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;

class YouTubeApi
{
  static function getYouTubeVideoThumbnail($videoId, $apiKey)
  {
    $data = Utility::queryAPI('https://www.googleapis.com/youtube/v3/videos?part=id,snippet&id=' . $videoId . '&key=' . $apiKey);

    if (!$data)
      throw new UserMessageException(__('Thumbnail Error: Can\'t contact the YouTube API. Ensure your API key is set.', 'utvg'));

    $thumbnailSources = $data->items[0]->snippet->thumbnails;

    end($thumbnailSources);
    $thumbnailKey = key($thumbnailSources);

    return $thumbnailSources->{$thumbnailKey}->url;
  }

  static function getVimeoVideoThumbnail($videoId)
  {
    $data = Utility::queryAPI('https://vimeo.com/api/v2/video/' . $videoId . '.json');

    if (!$data)
      throw new UserMessageException(__('Thumbnail Error: Can\'t contact the Vimeo API', 'utvg'));

    $data = $data[0];
    return $data->thumbnail_large;
  }
}
