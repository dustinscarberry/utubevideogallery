<?php

    $galleryID = sanitize_key($_GET['id']);
    $gallery = $wpdb->get_results('SELECT DATA_NAME, DATA_ALBCOUNT   FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = "' . $galleryID . '"', ARRAY_A);
  $albumCount = $wpdb->get_results('SELECT count(ALB_ID) as ALB_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $galleryID, ARRAY_A)[0];

    if (!isset($gallery[0]))
  {
        _e('Invalid Gallery ID', 'utvg');
        return;
    }

    $gallery = $gallery[0];

    require_once(dirname(__FILE__) . '/../../class/utvAlbumListTable.php');

    $albumListTable = new utvAlbumListTable($galleryID);
    $albumListTable->prepare_items();

?>

<div id="utv-view-gallery" class="utv-formbox utv-top-formbox">
    <form method="post">
        <p class="submit utv-actionbar">
            <a href="?page=utubevideo&view=albumcreate&id=<?php echo $galleryID; ?>" class="utv-link-submit-button"><?php _e('Create New Album', 'utvg'); ?></a>
            <a href="?page=utubevideo&view=gallery&id=<?php echo $galleryID; ?>" class="utv-ok"><?php _e('Clear Sort', 'utvg'); ?></a>
            <a href="?page=utubevideo" class="utv-cancel"><?php _e('Go Back', 'utvg'); ?></a>
        </p>
    </form>
    <h3 class="utv-h3"><?php _e('Video Albums for Gallery', 'utvg'); ?></h3>
    <span class="utv-sub-h3"> ( <?php echo $gallery['DATA_NAME']; ?> ) - <span id="utv-album-count"><?php echo $albumCount['ALB_COUNT']; ?></span> <?php _e('albums', 'utvg'); ?></span>
    <form method="post">

        <?php $albumListTable->display(); ?>

    </form>
</div>
