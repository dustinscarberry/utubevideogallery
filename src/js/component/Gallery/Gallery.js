import React from 'react';
import axios from 'axios';

class Gallery extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      albums: [],
      thumbnailType: undefined,
      selectedAlbum: undefined
    };

    this.loadAPIData = this.loadAPIData.bind(this);
  }

  componentWillMount()
  {
    this.loadAPIData();
  }

  async loadAPIData()
  {
    let results = await axios.get('http://localhost/wp-json/utubevideogallery/v1/galleries/' + this.props.id);

    console.log(results.data);

    if (results.status == 200)
    {
      this.setState({
        albums: results.data.albums || [],
        thumbnailType: results.data.thumbtype || undefined
      });
    }
  }

  render()
  {



    /*


    render
      albums
      videos of album
      all videos of all albums


      <BreadCrumb/>
      <AlbumThumbnails/> || <VideoThumbnails/> //needs all album and video data given to it



      <VideoThumbnails/> needs all video data given to it






    */



    return (
      <div className="utv-container utv-albums utv-icon-red">





        <div className="utv-outer-wrapper utv-align-center">
          <div className="utv-inner-wrapper" style={{'width': '1120px'}}>


            <div className="utv-thumb utv-album utv-youtube-rt">
      				<a href="https://www.codeclouds.net/utubevideo-gallery/album/trailers/">
      					<img src="https://www.codeclouds.net/wp-content/uploads/utubevideo-cache/iVAgTiBrrDA44.jpg" data-rjs="2"/>
      				</a>
      				<span>Trailers</span>
      			</div>


            <div className="utv-thumb utv-album utv-vimeo-rt">
      				<a href="https://www.codeclouds.net/utubevideo-gallery/album/vimeo/">
      					<img src="https://www.codeclouds.net/wp-content/uploads/utubevideo-cache/5746539239.jpg" data-rjs="2"/>
      				</a>
      				<span>Vimeo</span>
      			</div>
            <div className="utv-thumb utv-album utv-youtube-rt">
      				<a href="https://www.codeclouds.net/utubevideo-gallery/album/music-videos/">
      					<img src="https://www.codeclouds.net/wp-content/uploads/utubevideo-cache/n5HexLIqWY841.jpg" data-rjs="2"/>
      				</a>
      				<span>Music Videos</span>
      			</div>
            <div className="utv-thumb utv-album utv-youtube-rt">
      				<a href="https://www.codeclouds.net/utubevideo-gallery/album/disney/">
      					<img src="https://www.codeclouds.net/wp-content/uploads/utubevideo-cache/ywjX6AF6oVc13.jpg" data-rjs="2"/>
      				</a>
      				<span>Disney</span>
      			</div>
          </div>
        </div>



      </div>
    );
  }
}

Gallery.defaultProps = {

};

export default Gallery;
