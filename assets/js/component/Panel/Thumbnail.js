import classnames from 'classnames';

const Thumbnail = ({title, image, value, selected, onChangeVideo}) => {
  return <div
    className={classnames('utv-thumbnail', {'utv-panel-video-active': selected})}
    onClick={() => onChangeVideo(value)}
  >
    <a>
      <span className="utv-play-btn"></span>
      <img src={image}/>
    </a>
    <span>{title}</span>
  </div>
}

export default Thumbnail;
