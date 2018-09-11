<?php

require_once(plugin_dir_path(__FILE__) . 'utvWPListTableBase.php');

class utvPlaylistListTable extends utvWPListTableBase
{
  function __construct()
  {
    global $status, $page;

    parent::__construct([
      'singular' => '',
      'plural' => '',
      'ajax' => false
    ]);
  }

  function get_columns()
  {
    $columns = [
      'cb' => '<input type="checkbox">',
      'title' => __('Title', 'utvg'),
      'source' => __('Source', 'utvg'),
      'album' => __('Album', 'utvg'),
      'updatedate' => __('Updated', 'utvg')
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
      case 'title':
      case 'source':
      case 'album':
      case 'updatedate':
        return $item[$column_name];
      default:
        return 'An unknown error has occured';
    }
  }

  function get_sortable_columns()
  {
    $sortable_columns = [
      'title'  => ['title', false],
      'source'   => ['source', false],
      'updatedate' => ['updatedate', false]
    ];

    return $sortable_columns;
  }

  function usort_reorder($a, $b)
  {
    // If no sort, default to title
    $orderby = (!empty($_GET['orderby'])) ? $_GET['orderby'] : 'dateadd';
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
      //'syncnew' => __('Sync New Items', 'utvg'),
      //'refreshall' => __('Refresh All Items', 'utvg')
      'delete' => __('Delete', 'utvg')
    ];

    return $actions;
  }

  function process_bulk_action()
  {
    $action = $this->current_action();

    if ($action != -1)
    {
      global $wpdb;
      require_once 'utvAdminGen.php';

      $options = get_option('utubevideo_main_opts');

      utvAdminGen::initialize($options);

      if ($action == 'delete')
        utvAdminGen::deletePlaylists($_POST['playlist'], $wpdb);
    }
  }

  function column_cb($item)
  {
    return sprintf('<input type="checkbox" name="playlist[]" value="%s">', $item['ID']);
  }

  function no_items()
  {
    _e('No playlists found', 'utvg');
  }

  function setup_items()
  {
    global $wpdb;
    $cells = [];

    $data = $wpdb->get_results('SELECT p.*, ALB_NAME FROM ' . $wpdb->prefix . 'utubevideo_playlist p INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON p.ALB_ID = a.ALB_ID ORDER BY PLAY_ID', ARRAY_A);

    foreach ($data as $val)
    {
      $title = stripcslashes($val['PLAY_TITLE']);
      $viewURL = ($val['PLAY_SOURCE'] == 'youtube' ? 'https://www.youtube.com/playlist?list=' . $val['PLAY_SOURCEID'] : 'https://vimeo.com/album/' . $val['PLAY_SOURCEID']);
      $source = ($val['PLAY_SOURCE'] == 'youtube' ? 'YouTube' : 'Vimeo');
      $updateDate = date('Y/m/d', $val['PLAY_UPDATEDATE']);

      array_push($cells, [
        'ID' => $val['PLAY_ID'],
        'title' => '<a href="?page=utubevideo_playlists&view=playlistview&id=' . $val['PLAY_ID'] . '" title="' . __('Edit / Sync', 'utvg') . '" class="utv-row-title">' . $title . '</a>
          <div class="utv-row-actions">
            <a href="?page=utubevideo_playlists&view=playlistview&id=' . $val['PLAY_ID'] . '" title="' . __('Edit / Sync', 'utvg') . '">' . __('Edit / Sync', 'utvg') . '</a>
            <span class="utv-row-divider">|</span>
            <a href="" class="utv-delete-playlist" title="' . __('Delete this item', 'utvg') . '">' . __('Delete', 'utvg') . '</a>
            <span class="utv-row-divider">|</span>
            <a href="' . $viewURL . '" title="' . __('View', 'utvg') . '" target="_blank">' . __('View', 'utvg') . '</a>
           </div>',
        'source' => $source,
        'album' => $val['ALB_NAME'],
        'updatedate' => $updateDate
      ]);
    }

    return $cells;
  }
}

?>
