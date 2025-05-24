import AlbumTable from './AlbumTable';
import ActionBar from 'component/shared/ActionBar';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import SecondaryButton from 'component/shared/SecondaryButton';

const AlbumTabView = ({
  selectedGallery,
  selectedGalleryTitle,
  changeView,
  changeGallery,
  changeAlbum
}) => {
  return <div>
    <ActionBar>
      <SecondaryButton
        title={utvJSData.localization.addAlbum}
        onClick={() => changeView('addAlbum')}
      />
    </ActionBar>
    <Breadcrumbs
      crumbs={[
        {text: utvJSData.localization.galleries, onClick: () => changeGallery()},
        {text: selectedGalleryTitle}
      ]}
    />
    <AlbumTable
      changeAlbum={changeAlbum}
      changeView={changeView}
      selectedGallery={selectedGallery}
    />
  </div>
}

export default AlbumTabView;
