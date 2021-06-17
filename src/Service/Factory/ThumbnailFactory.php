<?php

namespace Dscarberry\UTubeVideoGallery\Service\Factory;

use Dscarberry\UTubeVideoGallery\Service\Api\YouTubeApi;
use Dscarberry\UTubeVideoGallery\Repository\VideoRepository;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;

class ThumbnailFactory
{
  const IMAGE_QUALITY = 95;
  const RETINA_IMAGE_QUALITY = 65;

  static function createThumbnailFromId($videoId)
  {
    if (!$videoId)
      throw new UserMessageException(__('Thumbnail Error: Invalid Video ID', 'utvg'));

    $pluginOptions = get_option('utubevideo_main_opts');

    $video = VideoRepository::getItem($videoId);

    if (!$video)
      throw new UserMessageException(__('Database Error: Can not determine video information', 'utvg'));

    // get thumbnail source url
    $videoThumbnailSourceUrl = self::getThumbnailSourceURL(
      $video->getSource(),
      $video->getSourceID(),
      $pluginOptions['youtubeApiKey']
    );

    // save thumbnail to disk
    self::saveThumbnail($video, $videoThumbnailSourceUrl, $pluginOptions['thumbnailWidth']);
  }

  // save thumbnail
  private function saveThumbnail($video, $sourceUrl, $thumbnailWidth)
  {
    // set base paths
    $dir = wp_upload_dir();
    $destinationPath = $dir['basedir'] . '/utubevideo-cache/';
    $filename = $video->getSourceID() . $video->getID();

    // create image resource
    $image = wp_get_image_editor($sourceUrl);

    // check for bad image
    if (is_wp_error($image))
      $image = self::getMissingThumbnail();

    // save thumbnail based on type
    if ($video->getThumbnailType() == 'square')
      self::saveSquareThumbnail($image, $pluginOptions['thumbnailWidth'], $destinationPath, $filename);
    else
      self::saveRectangleThumbnail($image, $pluginOptions['thumbnailWidth'], $destinationPath, $filename);
  }

  // save square thumbnail
  private function saveSquareThumbnail($image, $thumbnailWidth, $destinationPath, $filename)
  {
    // save retina image
    $image->resize($thumbnailWidth * 2, $thumbnailWidth * 2, true);
    $image->set_quality(self::RETINA_IMAGE_QUALITY);
    $image->save($destinationPath . $filename . '@2x.jpg');

    // save regular image
    $image->resize($thumbnailWidth, $thumbnailWidth, true);
    $image->set_quality(self::IMAGE_QUALITY);
    $image->save($destinationPath . $filename . '.jpg');
  }

  // save rectangle thumbnail
  private function saveRectangleThumbnail($image, $thumbnailWidth, $destinationPath, $filename)
  {
    //check image size and crop to 1.77 if needed
    $imageSize = $image->get_size();

    $ratio = round($imageSize['width'] / $imageSize['height'], 4);

    if ($ratio != 1.7778) {
      $newHeight = round($imageSize['width'] / 1.7778);
      $yPosition = ($imageSize['height'] - $newHeight) / 2;

      $image->crop(0, $yPosition, $imageSize['width'], $newHeight);
    }

    // save retina image
    $image->resize($thumbnailWidth * 2, $thumbnailWidth * 2);
    $image->set_quality(self::RETINA_IMAGE_QUALITY);
    $image->save($destinationPath . $filename . '@2x.jpg');

    // save regular image
    $image->resize($thumbnailWidth, $thumbnailWidth);
    $image->set_quality(self::IMAGE_QUALITY);
    $image->save($destinationPath . $filename . '.jpg');
  }

  // attempt to load missing thumbnail source
  private function getMissingThumbnail()
  {
    // // TODO: fix loading path
    $image = wp_get_image_editor(plugins_url('missing.jpg', dirname(__FILE__)));

    if (is_wp_error($image))
      throw new UserMessageException(__('Imagick or GD may be missing or bad YouTube API Key', 'utvg'));

    return $image;
  }

  // get thumbnail source url
  private function getThumbnailSourceURL($videoSourceType, $videoSlug, $youTubeApiKey = '')
  {
    if ($videoSourceType == 'youtube')
      return YouTubeApi::getYouTubeVideoThumbnail($videoSlug, $youTubeApiKey);
    elseif ($videoSourceType == 'vimeo')
      return YouTubeApi::getVimeoVideoThumbnail($videoSlug);
    else
      throw new UserMessageException(__('Thumbnail Error: Invalid source type', 'utvg'));
  }
}
