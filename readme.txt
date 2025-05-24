=== uTubeVideo Gallery ===
Contributors: dustinscarberry
Donate link: https://www.dscarberry.com/utubevideo-gallery/
Tags: video, gallery, youtube, vimeo
Requires at least: 4.9.0
Requires PHP: 8.0
Tested up to: 6.8
Stable tag: 2.0.11
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Display unlimited galleries of YouTube videos in any post or page within your site.

== Description ==

This plugin allows embedding galleries of YouTube videos within any post or page within your site. Just install and start creating.

Features Include:

- Unlimited video galleries (YouTube and Vimeo support)
- Set size of video player
- Set progress bar color of video player
- Order video albums by newest or oldest videos first, as well as custom re-ordering of videos / albums
- Ability to display albums or just  videos
- Use either square or rectangle thumbnails for videos
- Add YouTube and Vimeo playlists to albums
- Publish and un-publish videos and albums without having to delete them
- And more...

== Installation ==

1. Unzip 'utubevideo-gallery.zip' and upload `utubevideo-gallery` to the `/wp-content/plugins/` directory.
2. Activate the plugin (uTubeVideo Gallery) through the 'Plugins' menu in WordPress.
3. Create a gallery and copy shortcode onto a page or post.
4. Create video albums for gallery just created.
5. Add videos to video album just created.
6. Set thumbnail of video album by clicking on 'edit' while on the video album page in uTubeVideo gallery settings.

== Frequently Asked Questions ==

= How many video galleries, albums or videos can I create? =

As many as needed.

= Can I use any YouTube or Vimeo video? =

Yes, all YouTube and Vimeo videos should work unless embedding has been disabled.

= Are any other types of videos supported (ie not YouTube)? =

Yes, Even though the plugin is named uTubeVideo Gallery, Vimeo videos are supported also.

= Can I change the size of the video player? =

Yes the video player size can be set in the ‘General’ section in the settings page.

= How do I set a thumbnail for a new album? =

After adding at least one video to the album click on the edit action for the album and select a thumbnail and then click "Save Changes".

= How do I just display videos with no albums? =

There is an option called Display Type in each gallery’s settings; set it to Just Videos.

= How big of a playlist can I add to an album at a time? =

Playlist size, currently, has no limit to the amount of videos you can add. As videos are added you can view the progress at the top of the screen.

= What determines the video order for a panel? =

Video order is based on the order of the album(s) in the gallery and then ordering of the videos within each album(s).

= What happened to permalinks / permalink status? =

Galleries are now based on React and therefore do not cause a page reload. In doing so permalinks have been removed. This also allows multisite compatibility.

= What user permissions are required to use this plugin? =

A user must be an editor or above in order to manage video galleries and change settings.

== Screenshots ==

1. Album view of gallery
2. Video view of gallery
3. Gallery video playing
4. Gallery video playing with description
5. Panel view
6. Admin view

== Changelog ==

= 2.0.11 =

* Refactoring / compatibility with latest version of WordPress

= 2.0.10 =

* Bug fixes

= 2.0.9 =

* Security updates

= 2.0.8 =

* Security updates

= 2.0.7 =

* Security updates
* Support changed to security fixes only, no new features

= 2.0.6 =

* Code restructuring
* Grid thumbnail layout
* API Key validity checks
* Updated missing image
* Removed controls theme color (no longer used by YouTube)
* Removed script removal feature
* Removed video quality (no longer relevant)
* PHP 8 support
* Bug fixes

= 2.0.5 =

* Security fixes
* Code restructuring
* Dependency updates
* Added Imagick and GD versions
* Bug fixes
* PHP >= 7.0 is now required (DO NOT UPDATE UNLESS YOU HAVE REQUIRED VERSION)

= 2.0.4 =
* Fixed issue where empty albums would refuse to delete
* Added detailed error handling to video api endpoints

= 2.0.3 =
* Race condition with drag n drop reordering corrected
* Possible fix for babel polyfill issues
* Bumped supported WordPress version to 5.2.0
* Upgraded Babel 6 to 7
* Updated npm packages

= 2.0.2 =
* Compatibility fix for NextGEN gallery
* Updated supported version to WordPress 5.0.3

= 2.0.1 =
* Compatibility fix for 5.x PHP with array accessor syntax
* Fixed an issue with playlist table being left behind on uninstall

= 2.0.0 =
* Complete rewrite of most of the plugin code
* Plugin built on React
* PHP 5.6 > required
* YouTube API key required
* Video descriptions added

= 1.9.8 =
* Corrected bug involving using query parameters to view galleries

= 1.9.7 =
* Added retina support to thumbnails
* Added playlist syncing / management
* Corrected playlist import issues
* Reorganized settings panel
* Added new settings - show/hide video details and disable autoplay
* Improved frontend html
* New mini logo icon
* General CSS and JS fixes
* Code optimization and uniformity changes (ongoing)
* Added 'videocount' and 'albumcount' shortcode options
* Changed static video and album counts to dynamic
* Added option for specifying horizontal and vertical padding for thumbnails
* Small bug fix in javascript for slow loading galleries and panels

= 1.9.4 =
* Minor code optimizations
* More mobile friendly for small devices - frontend and backend
* Feature to move videos between albums and albums between galleries
* Fixes to add videos and playlists
* Corrected bug related to deleting galleries

= 1.9.3 =
* Improved mobile support for administration
* Random code optimizations
* Fixed PHP version issues

= 1.9.1 =
* Corrected bug with JavaScript code

= 1.9 =
* Added new panel view for video gallery
* Restructured admin and clientside code
* Removed inline JavaScript to external files
* Added red and blue video play icons and changed default
* Changed way of adding playlists to include previews and selection / changing video names
* Added action to refresh video thumbnail cache
* Added video previews in admin
* Added start and end video times
* Fixed issue where video thumbnails were shared if same video was added more than once
* Various admin style changes
* Moved thumbnail type option, square or rectangle, to gallery level instead of each video
* and more...

= 1.7.3 =
* Checked code for any failures due to changing API's (YouTube, Vimeo)
* Updated Magnific Popup to version 1.1.0 (Dimsemenov)
* Fixed bug with youtu.be URL's not parsing correctly when they included a "-" or "_" character
* More error checking added involving API requests to prevent some errors
* Fixed issue when could not load thumbnail from YouTube for video
* Added status indicators for GD and Imagick
* Changed missing image

= 1.7.2 =
* Fixed an overlooked sorting issue with albums
* Fixed an odd glitch with newer versions of jQuery

= 1.7.1 =
* Updated Magnific Popup to version 1.0.0 (Dimsemenov)
* Changed YouTube playlists to use API version 3 to fix playlist features
* Added ability to use youtu.be link format to add videos
* Fixed video sorting issues
* Made video name field optional

= 1.7 =
* Fixed upgrade script bug
* Admin interface usability improved
* Fixed a compatibility issue with older versions of PHP
* Made options for changing thumbnail size and padding global, instead of gallery specific
* Improved layout of thumbnails within galleries
* Videos now auto switch between http and https based on site
* Added support for Vimeo
* Improved localization
* Added bulk management options
* Better error checking
* Updated Magnific Popup to version 0.9.9 (Dimsemenov)
* And other tweaks and fixes

= 1.6.2 =
* Fixed a further CSS issue conflict with some themes
* Fixed language encoding to support characters from more languages
* Implemented an update script to hopefully fix a lot of update issues

= 1.6.1 =
* Fixed a CSS bug when hovering over player close button
* Removed overlooked stray code bits
* Discovered bug with upgrade, de-activate and re-activation seems to fix

= 1.6 =
* Added ability to customize size and padding of thumbnails
* Replaced Fancybox lightbox with Magnific Popup, a faster responsive lightbox
* Tweaked front-end UI
* Admin - added button to fix broken permalink issues
* Admin - added album sorting feature
* Admin - moved skipalbums into each galleries settings, instead of a shortcode option
* Admin - added ability to publish and un-publish videos and albums
* Admin - added ability to drag / sort video and album order
* Admin - admin tables are now sortable, by attributes such as: Name, Published, Date Added, etc.
* Admin - added client side error checking to all forms / as well as fixed server side bugs
* Created documentation page on website regarding plugin
* Removed YouTube hack for thumbnails that would not save, finally figured out what the issue was.

= 1.5.1 =
* Fixed bug with not being able to add videos when the image editor failed to save thumbnails
* Added option to skip using slugs/permalinks for album links for those who have trouble with slugs
* Added better status messages to "Permalink Status"
* Fixed bug where themes could overwrite border and margins of video thumbnails

= 1.5 =
* Slight changes to frontend gallery interface
* Fixed issue with thumbnail sizes defaulting to square and stretching rectangular thumbnails
* Moved all scripts to the footer
* Patched included fancybox library to support jQuery 1.10
* Optimized fancybox call JavaScript
* Slight changes to admin interface
* Added settings for fancybox overlay color and opacity
* Added support for adding YouTube playlists to an album
* Fixed admin navigation link bugs
* Changed main icon for admin interface and moved menu out of settings, into its own menu slot
* Added better error messages to admin section for forms
* Fixed uninstall script - it now deletes thumbnails when plugin is uninstalled
* Added workaround for thumbnail problems by loading thumbnails directly from YouTube
* Localized plugin, translations not provided, however
* Adding permalinks for albums for galleries embedded on a page, posts still use old method
* And possibly some other stuff I forgot....

= 1.3.5 =
* Fixed admin script processing hook
* Fixed general settings not showing as updated when first updated
* Fixed a link from appearing when no albums were found in a gallery
* Fixed a problem with single quotes being escaped when displayed in album titles in admin
* Added support for skipping video albums from being displayed in a gallery
* Added a button to add videos from admin video display page
* Fixed album and video counting bug
* Added ability to set starting resolution of videos
* Added setting to set the color of the player progress bar
* Added better security to plugin

= 1.3 =
* Complete redesign of code to a more object oriented design for namespacing
* Tweaks to admin interface, more minimal
* Added video album and video count to admin interface
* Added album backlink for video albums on frontend with no videos

= 1.2.5 =
* Added setting for video ordering in albums
* Added setting for video thumbnail type
* Fixed version information on included files
* Fixed bug when including multiple galleries on the same post or page

= 1.2 =
* Minor tweaks to administrative panel
* Changed the way album thumbnails are set
* Added settings for video player size
* Added confirmation for deleting galleries, albums, and videos
* Added FAQ's to administrative panel
* Updated readme to correct a typo and more FAQ's/installation instructions
* Updated code documentation
* Minor tweaks to CSS

= 1.1.1 =
* Fixed issue with cached images getting deleted on update. This update will invalidate older galleries, unfortunately

= 1.1 =
* Fixed major script inclusion bug and prevented some styles from being overridden

= 1.0 =
* Initial release of uTubeVideo Gallery
