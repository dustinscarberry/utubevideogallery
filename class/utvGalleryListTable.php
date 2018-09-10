<?php

require_once(plugin_dir_path(__FILE__) . 'utvWPListTableBase.class.php');

class utvGalleryListTable extends utvWPListTableBase
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
      'name' => __('Name', 'utvg'),
      'shortcode' => __('Shortcode', 'utvg'),
      'dateadd' => __('Date Added', 'utvg'),
      'albums' => __('# Albums', 'utvg')
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
      case 'name':
      case 'shortcode':
      case 'dateadd':
      case 'albums':
        return $item[$column_name];
      default:
        return 'An unknown error has occured';
    }
  }

  function get_sortable_columns()
  {

    $sortable_columns = [
      'name'  => ['name', false],
      'dateadd' => ['dateadd', false],
      'albums'   => ['albums', false]
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
      require_once 'utvAdminGen.class.php';

      $options = get_option('utubevideo_main_opts');

      utvAdminGen::initialize($options);

      if ($action == 'delete')
        utvAdminGen::deleteGalleries($_POST['gallery'], $wpdb);
    }
  }

  function column_cb($item)
  {
    return sprintf('<input type="checkbox" name="gallery[]" value="%s">', $item['ID']);
  }

  function no_items()
  {
    _e('No galleries found', 'utvg');
  }

  function setup_items()
  {
    global $wpdb;
    $cells = [];

    $galleries = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_dataset ORDER BY DATA_ID', ARRAY_A);

    foreach ($galleries as $gallery)
    {
      $albumCount = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALB_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $gallery['DATA_ID'], ARRAY_A)[0];

      array_push($cells, [
        'ID' => $gallery['DATA_ID'],
        'name' => '<a href="?page=utubevideo&view=gallery&id=' . $gallery['DATA_ID'] . '" title="' . __('View', 'utvg') . '" class="utv-row-title">' . $gallery['DATA_NAME'] . '</a>
        <div class="utv-row-actions">
        <a href="?page=utubevideo&view=galleryedit&id=' . $gallery['DATA_ID']  . '" title="' . __('Edit this item', 'utvg') . '">' . __('Edit', 'utvg') . '</a>
        <span class="utv-row-divider">|</span>
        <a href="" class="ut-delete-gallery" title="' . __('Delete this item', 'utvg') . '">' . __('Delete', 'utvg') . '</a>
        <span class="utv-row-divider">|</span>
        <a href="?page=utubevideo&view=gallery&id=' . $gallery['DATA_ID'] . '" title="' . __('View', 'utvg') . '">' . __('View', 'utvg') . '</a>
        </div>',
        'shortcode' => '[utubevideo id="' . $gallery['DATA_ID'] . '"]',
        'dateadd' => date('Y/m/d', $gallery['DATA_UPDATEDATE']),
        'albums' => $albumCount['ALB_COUNT']
      ]);
    }

    return $cells;
  }
}

?>
