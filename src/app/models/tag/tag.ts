import { DolphinFile } from '../dolphin-file/dolphin-file';

class TagMedia {
  coverImage: DolphinFile;

  constructor(cover_image: DolphinFile) {
    this.coverImage = cover_image;
  }
}

export class Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_description: string;
  site: string;
  tagged_items_count: number;
  absolute_uri: string;
  media: TagMedia;

  isDeleted: boolean;

  constructor(data: object) {
    this.id = data['id'];
    this.name = data['name'];
    this.slug = data['slug'];
    this.description = data['description'];
    this.meta_description = data['meta_description'];
    this.absolute_uri = data['absolute_uri'];
    this.site = data['site'];
    this.tagged_items_count = data['tagged_items_count'];

    let tagMedia = null;
    if (data['media']) {
      if (data['media'].cover_image) {
        tagMedia = new DolphinFile(data['media'].cover_image);
      }
    }
    this.media = new TagMedia(tagMedia);
  }
}
