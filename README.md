
# uTubeVideo Gallery

A YouTube and Vimeo video gallery plugin for WordPress.

## Getting Started

### Installation

Search for "uTubeVideo Gallery" within your WordPress plugins page and select install.
Alternatively you may [download the plugin here](https://wordpress.org/plugins/utubevideo-gallery/). If downloading directly you must unzip the plugin folder to your WordPress plugins directory on your webserver.

### Configuration

- **Max Player Width** - Max width of popup video player for gallery views.

- **Thumbnail Width** - Thumbnail size used for all video thumbnails, unless overwritten in shortcode.

- **Thumbnail Horizontal Padding** - Horizontal padding between video thumbnails.

- **Thumbnail Vertical Padding** - Vertical padding between video thumbnails.

- **Thumbnail Border Radius** - Border rounding for video thumbnails.

- **Overlay Color** - Video popup player overlay background color.

- **Overlay Opacity** - Video popup player overlay opacity.

- **Remove Video Popup Scripts** - Remove video popup player scripts if using a plugin that already loads "Magnific Popup"

- **(YouTube) API Key** - Your API key for YouTube API's

1. Go to [Google Developers Console](https://console.developers.google.com/) and log in with your Google account.
2. Create a new project for your website.
3. On the sidebar on the left click "Credentials".
4. Click "Create Credentials" and then "API key". (This will be the key you insert into the plugin settings)
5. On the sidebar on the left click "Library".
6. Select the "YouTube Data API v3" and enable it.

- **(YouTube) Controls Theme** - Controls theme for the YouTube video player.

- **(YouTube) Controls Color** - Controls color for the YouTube video player.

- **(YouTube) Autoplay Videos** - Autoplay YouTube videos (does not apply to panel views).

- **(YouTube) Hide Video Details** - Hide extra details in YouTube video player (does not apply to panel views).

- **(Vimeo) Autoplay Videos** - Autoplay Vimeo videos (may be overridden by Vimeo).

- **(Vimeo) Hide Video Details** - Hide extra details in Vimeo video player (may be overridden by Vimeo).

### Creating and Using Galleries / Albums

To create a video gallery under the "Galleries" tab click the "Add Gallery" button. Here you can set the album sort direction, thumbnail type, and display type for a gallery view. Display type of "Just Videos" will display all videos without showing individual albums.

After creating a gallery you can enter it by clicking on the name. Inside you will be able to create albums. Each album can have a video sort direction.

After creating an album you can enter it by clicking on the name or thumbnail. You can now add videos to the album. Supported video sources are YouTube and Vimeo.

Valid video url formats include:

-- https://www.youtube.com/watch?v=xxxx  
-- https://youtu.be/xxxx  
-- https://vimeo.com/xxxx

When adding videos you can choose from a few options per video.

To edit a gallery, album or video, click the edit action next to the item. Editing a video and clicking "Save Changes" will regenerate the video thumbnail.

To insert a gallery into a page or post, just copy and paste the shortcode given on the galleries page.

### Creating / Editing Playlists

To create a playlist under the "Saved Playlists" tab click the "Add Playlist" button. Here you can add playlists from either YouTube or Vimeo and select which videos you want to import. When importing videos you must choose an album for them to be added to.

Valid playlist url formats include:

-- https://www.youtube.com/watch?v=xxxxx&list=xxxx  
-- https://vimeo.com/album/xxxx

To edit a playlist / re-sync videos, click the edit action next to the item.

## Shortcode Options

There are a few options you can use with your shortcodes to modify / over-ride settings.

### Panel Options

- panelvideocount - Set the number of videos per page to display (default: panelvideocount="14")
- theme - Set theme of panel [light, dark, transparent] (default: theme="light")
- controls - Set whether controls are displayed for videos, does not apply to Vimeo videos [true, false] (default: controls="false")
- maxvideos - Set the max number of videos displayed (default: n/a)

### Gallery Options

- align - Removed in version 2.0
- maxvideos - Set the max number of videos displayed (default: n/a) NOTE: changed from "videocount"
- maxalbums - Set the max number of albums displayed (default: n/a) NOTE: change from "albumcount"

### Shared Options

- view - Set the display type of your shortcode [gallery, panel] (default: view="gallery")
- icon - Set style of video play icon for shortcode [red, blue, default] (default: icon="red")

## FAQ's

#### How many video galleries, albums or videos can I create?

As many as needed.

#### Can I use any YouTube or Vimeo video?

Yes, all YouTube and Vimeo videos should work unless embedding has been disabled.

#### Are any other types of videos supported (ie not YouTube)?

Yes, Even though the plugin is named uTubeVideo Gallery, Vimeo videos are supported also.

#### Can I change the size of the video player?

Yes the video player size can be set in the ‘General’ section in the settings page.

#### How do I set a thumbnail for a new album?

After adding at least one video to the album click on the edit action for the album and select a thumbnail and then click "Save Changes".

#### How do I just display videos with no albums?

There is an option called Display Type in each gallery’s settings; set it to Just Videos.

#### How big of a playlist can I add to an album at a time?

Playlist size, currently, has no limit to the amount of videos you can add. As videos are added you can view the progress at the top of the screen.

#### What determines the video order for a panel?

Video order is based on the order of the album(s) in the gallery and then ordering of the videos within each album(s).

#### What happened to permalinks / permalink status?

Galleries are now based on React and therefore do not cause a page reload. In doing so permalinks have been removed. This also allows multisite compatibility.

#### What user permissions are required to use this plugin?

A user must be an editor or above in order to manage video galleries and change settings.

## License

This project is licensed under the GPL2 License - see the [LICENSE.md](LICENSE.md) file for details.
