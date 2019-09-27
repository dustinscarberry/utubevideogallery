<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
use UTubeVideoGallery\Repository\PlaylistRepository;
use UTubeVideoGallery\Repository\VideoRepository;
use WP_REST_Request;
use WP_REST_Server;

class PlaylistAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      '/playlists',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getAllItems']
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );

    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'playlists/(?P<playlistID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'playlistID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'playlistID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'playlistID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  public function getItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid playlistID
      if (!$req['playlistID'])
        return $this->errorResponse(__('Invalid playlist ID', 'utvg'));

      //get playlist
      $playlistRepository = new PlaylistRepository();
      $playlist = $playlistRepository->getItem($req['playlistID']);

      //check if playlist exists
      if (!$playlist)
        return $this->errorResponse(__('The specified video resource was not found', 'utvg'));

      return $this->response($playlist);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  public function createItem(WP_REST_Request $req)
  {
    try
    {
      //create repository
      $playlistRepository = new PlaylistRepository();

      //gather data fields
      $title = sanitize_text_field($req['title']);
      $source = sanitize_text_field($req['source']);
      $sourceID = sanitize_text_field($req['sourceID']);
      $videoQuality = sanitize_text_field($req['videoQuality']);
      $showControls = $req['showControls'] ? 0 : 1;
      $albumID = sanitize_key($req['albumID']);

      //check for required fields
      if (empty($title)
        || empty($source)
        || empty($sourceID)
        || empty($videoQuality)
        || empty($albumID)
      )
        throw new \Exception(__('Invalid parameters', 'utvg'));

      //insert new playlist
      $playlistID = $playlistRepository->createItem(
        $title,
        $source,
        $sourceID,
        $videoQuality,
        $showControls,
        $albumID
      );

      //if successfull playlist creation..
      if ($playlistID)
        return $this->response((object)['id' => $playlistID], 201);
      else
        throw new \Exception(__('Database Error: Playlist failed to save', 'utvg'));
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  public function deleteItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid playlistID
      if (!$req['playlistID'])
        return $this->errorResponse(__('Invalid playlist ID', 'utvg'));

      //sanitize fields
      $playlistID = sanitize_key($req['playlistID']);

      //get playlist
      $playlistRepository = new PlaylistRepository();
      $playlist = $playlistRepository->getItem($playlistID);

      //check if playlist exists
      if (!$playlist)
        return $this->errorResponse(__('Playlist does not exist', 'utvg'));

      //get playlist videos
      $videoRepository = new VideoRepository();
      $playlistVideos = $videoRepository->getItemsByPlaylist($playlistID);

      //delete videos
      foreach ($playlistVideos as $video)
      {
        if (!$videoRepository->deleteItem($video->getID()))
          return $this->errorResponse(__('A database error has occurred', 'utvg'));

        //delete video thumbnail
        $thumbnailPath = wp_upload_dir();
        $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';
        unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
        unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');
      }

      //delete playlist
      if (!$playlistRepository->deleteItem($playlistID))
        return $this->errorResponse(__('A database error has occurred', 'utvg'));

      return $this->response(null);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid playlistID
      if (!$req['playlistID'])
        return $this->errorResponse(__('Invalid playlist ID', 'utvg'));

      //gather data fields
      $playlistID = sanitize_key($req['playlistID']);
      $title = sanitize_text_field($req['title']);
      $videoQuality = sanitize_text_field($req['videoQuality']);

      if (isset($req['showControls']))
        $showControls = $req['showControls'] ? 0 : 1;
      else
        $showControls = null;

      $currentTime = current_time('timestamp');

      //create updatedFields array
      $updatedFields = [];

      //set optional update fields
      if ($title != null)
        $updatedFields['PLAY_TITLE'] = $title;

      if ($videoQuality != null)
        $updatedFields['PLAY_QUALITY'] = $videoQuality;

      if ($showControls != null)
        $updatedFields['PLAY_CHROME'] = $showControls;

      //set required update fields
      $updatedFields['PLAY_UPDATEDATE'] = $currentTime;

      $playlistRepository = new PlaylistRepository();

      if ($playlistRepository->updateItem($playlistID, $updatedFields))
        return $this->response(null);
      else
        return $this->errorResponse(__('A database error has occurred', 'utvg'));
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  public function getAllItems(WP_REST_Request $req)
  {
    try
    {
      $playlistRepository = new PlaylistRepository();
      $playlists = $playlistRepository->getItems();

      return $this->response($playlists);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }
}
