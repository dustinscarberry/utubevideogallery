<?php

namespace Dscarberry\UTubeVideoGallery\Service\Api;

use Dscarberry\UTubeVideoGallery\Service\Utility;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use Exception;

class YouTubeApi
{
  static function getYouTubeVideoThumbnail($videoId, $apiKey)
  {
    $data = Utility::queryAPI('https://www.googleapis.com/youtube/v3/videos?part=id,snippet&id=' . $videoId . '&key=' . $apiKey);

    if (!$data)
      throw new UserMessageException(__('Thumbnail Error: Can\'t contact the YouTube API. Ensure your API key is set.', 'utvg'));

    // check for valid response
    if (isset($data->error))
      throw new UserMessageException(__('Invalid API key or video ID', 'utvg'));

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
