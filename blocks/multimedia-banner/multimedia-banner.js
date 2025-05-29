import { makeVideo } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Structure the block
  const [mediaContainer, infoContainer] = block.children;
  mediaContainer?.classList.add('media-container');
  infoContainer?.classList.add('information');

  // Check for media type
  const videoLink = mediaContainer.querySelector('a');

  if (videoLink?.href) {
    // Handle video
    makeVideo(mediaContainer, videoLink.href);
    videoLink.remove();
  } 
}