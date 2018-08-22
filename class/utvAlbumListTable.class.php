<?php

require_once(plugin_dir_path(__FILE__) . 'utvWPListTableBase.class.php');

class utvAlbumListTable extends utvWPListTableBase
{
  private $_id, $_baseURL;

  function __construct($id)
  {
    global $status, $page;

    parent::__construct([
      'singular' => '',
      'plural' => 'utv-sortable-table',
      'ajax' => false
    ]);

    $this->_id = $id;
    $this->_baseURL = wp_upload_dir();
    $this->_baseURL = $this->_baseURL['baseurl'] . '/utubevideo-cache/';
  }

  function get_columns()
  {
    $columns = [
      'cb' => '<input type="checkbox"/>',
      'utv-albthumbnail' => __('Thumbnail', 'utvg'),
      'name' => __('Name', 'utvg'),
      'published' => __('Published', 'utvg'),
      'dateadd' => __('Date Added', 'utvg'),
      'videos' => __('# Videos', 'utvg')
    ];

    return $columns;
  }

  function prepare_items()
  {
    $this->process_bulk_action();

    $columns = $this->get_columns();
    $hidden = [];
    $sortable = $this->get_sortable_columns();
    $this->_column_headers = [$columns, $hidden, $sortable];

    $this->items = $this->setup_items();

    if (!empty($_GET['orderby']) && !empty($_GET['order']))
      usort($this->items, [$this, 'usort_reorder']);
  }

  function column_default($item, $column_name)
  {
    switch ($column_name)
    {
      case 'utv-albthumbnail':
      case 'name':
      case 'published':
      case 'dateadd':
      case 'videos':
        return $item[ $column_name ];
      default:
        return 'An unknown error has occured';
    }
  }

  function get_sortable_columns()
  {
    $sortable_columns = [
      'name'  => ['name', false],
      'published' => ['published', false],
      'dateadd' => ['dateadd', false],
      'videos'   => ['videos', false]
    ];

    return $sortable_columns;
  }

  function usort_reorder($a, $b)
  {
    // If no sort, default to title
    $orderby = (!empty($_GET['orderby'])) ? $_GET['orderby'] : 'name';
    // If no order, default to asc
    $order = (!empty($_GET['order'])) ? $_GET['order'] : 'asc';
    // Determine sort order
    $result = strcmp($a[$orderby], $b[$orderby]);
    // Send final sort direction to usort
    return ($order === 'asc') ? $result : -$result;
  }

  //add id to table rows
  function single_row($item)
  {
    static $row_class = '';
    $row_class = ($row_class == '' ? ' class="alternate"' : '');

    echo '<tr id="' . $item['ID'] . '" ' . $row_class . '>';
    $this->single_row_columns($item);
    echo '</tr>';
  }

  function get_bulk_actions()
  {
    $actions = [
      'delete' => __('Delete', 'utvg'),
      'publish' => __('Publish', 'utvg'),
      'unpublish' => __('Unpublish', 'utvg')
    ];

    return $actions;
  }

  function process_bulk_action()
  {
    $action = $this->current_action();

    if ($action != -1)
    {
      global $wpdb;
      require_once 'utvAdminGen.class.php';

      $options = get_option('utubevideo_main_opts');
      utvAdminGen::initialize($options);

      if ($action == 'delete')
        utvAdminGen::deleteAlbums($_POST['album'], $wpdb);
      elseif ($action == 'publish')
        utvAdminGen::toggleAlbumsPublish($_POST['album'], '1', $wpdb);
      elseif ($action == 'unpublish')
        utvAdminGen::toggleAlbumsPublish($_POST['album'], '0', $wpdb);
    }
  }

  function column_cb($item)
  {
    return sprintf('<input type="checkbox" name="album[]" value="%s" />', $item['ID']);
  }

  function no_items()
  {
    _e('No albums found', 'utvg');
  }

  function setup_items()
  {
    global $wpdb;
    $cells = [];

    $albums = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $this->_id . ' ORDER BY ALB_POS', ARRAY_A);

    foreach ($albums as $album)
    {
      $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VID_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $album['ALB_ID'], ARRAY_A)[0];

      array_push($cells, [
        'ID' => $album['ALB_ID'],
        'utv-albthumbnail' => '<a href="?page=utubevideo&view=album&id=' . $album['ALB_ID'] . '&pid=' . $this->_id . '" title="' . __('View', 'utvg') . '"><img src="' . $this->_baseURL . $album['ALB_THUMB'] . '.jpg" class="utv-preview-thumb" data-rjs="2"></a><span class="utv-sortable-handle" title="' . __('Click and drag to reorder') . '">::</span>',
        'name' => '<a href="?page=utubevideo&view=album&id=' . $album['ALB_ID'] . '&pid=' . $this->_id . '" class="utv-row-title" title="' . __('View', 'utvg') . '">' . stripslashes($album['ALB_NAME']) . '</a>
        <div class="utv-row-actions">
        <a href="?page=utubevideo&view=albumedit&id=' . $album['ALB_ID'] . '&pid=' . $this->_id . '" title="' . __('Edit this item', 'utvg') . '">' . __('Edit', 'utvg') . '</a>
        <span class="utv-row-divider">|</span>
        <a href="" class="ut-delete-album" title="' . __('Delete this item', 'utvg') . '">' . __('Delete', 'utvg') . '</a>
        <span class="utv-row-divider">|</span>
        <a href="?page=utubevideo&view=videoadd&id=' . $album['ALB_ID'] . '&pid=' . $this->_id . '" title="' . __('Add video to this album', 'utvg') . '">' . __('Add Video', 'utvg') . '</a>
        <span class="utv-row-divider">|</span>
        <a href="?page=utubevideo&view=playlistadd&id=' . $album['ALB_ID'] . '&pid=' . $this->_id . '" title="' . __('Add playlist to this album', 'utvg') . '">' . __('Add Playlist', 'utvg') . '</a>
        <span class="utv-row-divider">|</span>
        <a href="?page=utubevideo&view=album&id=' . $album['ALB_ID'] . '&pid=' . $this->_id . '" title="' . __('View', 'utvg') . '">' . __('View', 'utvg') . '</a>
        </div>',
        'published' => $album['ALB_PUBLISH'] == '1' ? '<a href="" class="utv-publish" title="' . __('Click to toggle', 'utvg') . '"/>' : '<a href="" class="utv-unpublish" title="' . __('Click to toggle', 'utvg') . '"/>',

        'dateadd' => date('Y/m/d', $album['ALB_UPDATEDATE']),
        'videos' => $videoCount['VID_COUNT']
      ]);
    }

    return $cells;
  }
}

?>
