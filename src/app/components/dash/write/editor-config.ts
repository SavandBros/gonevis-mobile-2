import { environment } from '../../../../environments/environment';
import Quill from 'quill';

const iframeOrigin = environment.api.split('/api/v1/')[0] + '/toodartoo/embed/?media=';

const BlockEmbed = Quill.import('blots/block/embed');

// class VideoBlot extends BlockEmbed {
//   static create(url) {
//     const node = super.create(url);
//     const iframe = document.createElement('iframe');
//     // Set styles for wrapper
//     node.setAttribute('class', 'embed-responsive embed-responsive-16by9');
//     // Set styles for iframe
//     iframe.setAttribute('frameborder', '0');
//     iframe.setAttribute('allowfullscreen', 'true');
//     iframe.setAttribute('webkitallowfullscreen', 'true');
//     iframe.setAttribute('mozallowfullscreen', 'true');
//     iframe.setAttribute('src', url);
//     // Append iframe as child to wrapper
//     node.appendChild(iframe);
//     return node;
//   }
//
//   static value(domNode) {
//     if (domNode.querySelector('iframe')) {
//       return domNode.querySelector('iframe').getAttribute('src');
//     }
//   }
// }
//
// VideoBlot['blotName'] = 'video';
// VideoBlot['tagName'] = 'div';


/**
 * ## Purpose
 * It's purpose is to embed Github Gists, Twitter Tweets and Instagram posts.
 *
 * ## How?
 * When user pastes/provides an embed url, we create an iframe tag with these attributes:
 * - ### src
 *   It's value looks like this (`MEDIA_URL` is the URL that user pastes/provides):
 *   `https://www.gonevis.com/toodartoo/embed/?media=MEDIA_URL`
 *
 * - ### width
 *   We set it's value too `100%` so that the iframe could fit to it's mother element.
 *
 * - ### data-embed-url
 *   We set it's value to the URL that user pastes/provides.
 *
 * - ### frameborder
 *   We set it's value to `0` so that the iframe doesn't have any borders around itself.
 */
class EmbedBlot extends BlockEmbed {
  static create(url) {
    const node = super.create();
    // Handle node's url
    let src = url;
    if (!url.includes(iframeOrigin)) {
      src = iframeOrigin + url;
    }
    // Set iframe's attributes
    node.src = src;
    node.width = '100%';
    node.setAttribute('data-embed-url', src.split(iframeOrigin)[1]);
    node.setAttribute('frameborder', '0');
    // Add node
    return node;
  }

  static value(domNode) {
    if (domNode.getAttribute('src')) {
      return domNode.getAttribute('src');
    }
  }
}

EmbedBlot['blotName'] = 'embed';
EmbedBlot['tagName'] = 'iframe';

class SoundCloudBlot extends BlockEmbed {
  static create(iframe) {
    const node = super.create();

    if (typeof iframe === 'object') {
      node.appendChild(iframe);
    } else {
      node.innerHTML = iframe;
    }
    // Add node
    return node;
  }

  static value(domNode) {
    if (domNode.querySelector('iframe')) {
      return domNode.querySelector('iframe');
    }
  }
}

SoundCloudBlot['blotName'] = 'soundcloud';
SoundCloudBlot['tagName'] = 'soundcloud';

// Quill.register(VideoBlot, true);
Quill.register(EmbedBlot, true);
Quill.register(SoundCloudBlot, true);
