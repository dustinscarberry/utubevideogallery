<?php

require_once(dirname(__FILE__) . '/../../class/utvPlaylistListTable.php');

$playlists = new utvPlaylistListTable();
$playlists->prepare_items();

?>

<div class="utv-formbox">
  <h3><?php _e('Overview', 'utvg'); ?></h3>
  <form method="post">

    <?php $playlists->display(); ?>

  </form>
</div>
