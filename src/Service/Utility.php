<?php

namespace CodeClouds\UTubeVideoGallery\Service;

class Utility
{
  //checks if string is null or empty - needs work
  public static function isNullOrEmpty($value)
  {
    return (!isset($value) || trim($value) === '');
  }

  //checks if variable isset and matches value loosely
  public static function hasValue($value, $target)
  {
    return (isset($value) && $value == $target);
  }

  //checks if variable isset and matches value strictly
  public static function hasValueExact($value, $target)
  {
    return (isset($value) && $value === $target);
  }

  public static function queryAPI(string $query, $type = 'json')
  {
    $data = wp_remote_get($query);

    if ($type == 'json')
      return json_decode($data['body']);
  }
}
