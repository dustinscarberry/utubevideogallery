class GalleryService
{
  getGalleryClasses(iconType, selectedAlbum = undefined)
  {
    let classes = ['utv-gallery'];

    if (iconType == 'red')
      classes.push('utv-icon-red');
    else if (iconType == 'blue')
      classes.push('utv-icon-blue');
    else if (iconType == 'original')
      classes.push('utv-icon-default');

    if (selectedAlbum == undefined)
      classes.push('utv-albums');

    return classes;
  }

  getThumbnailsClasses(thumbnailType)
  {
    const classes = [
      'utv-video-gallery-thumbnails',
      'utv-align-center'
    ];

    if (thumbnailType == 'square')
      classes.push('utv-thumbnails-square');
    else
      classes.push('utv-thumbnails-rectangle');

    return classes;
  }
}

export default new GalleryService();
