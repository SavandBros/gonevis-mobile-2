import { DolphinFile } from '../dolphin-file/dolphin-file';
import { Media } from '../media/media';
import { Tag } from '../tag/tag';

class EntryMedia {
  cover_image: DolphinFile;

  constructor(cover_image: DolphinFile) {
    this.cover_image = cover_image;
  }

}

class EntryUser {
  get_absolute_uri: string;
  name: string;
  username: string;

  media: Media;

  constructor(data: object) {
    this.get_absolute_uri = data['get_absolute_uri'];
    this.name = data['name'];
    this.username = data['username'];

    this.media = new Media(data['media']);
  }
}

export default class Entry {
  absolute_uri: string;
  active_comment_count: number;
  comment_count: number;
  comment_enabled: boolean;
  content: string;
  created: Date;
  excerpt: string;
  featured: boolean;
  format: number;
  hidden_comment_count: number;
  id: string;
  is_page: boolean;
  meta_description: string;
  password: string;
  pending_comment_count: number;
  published: Date;
  site: string;
  slug: string;
  start_publication: Date;
  status: number;
  title: string;
  updated: Date;
  user: string;
  view_count: number;
  vote_count: number;

  entrydraft: Entry | null;
  media: EntryMedia;
  updated_by: EntryUser | null;
  tags: Array<Tag> = [];


  constructor(data: object) {
    this.absolute_uri = data['absolute_uri'];
    this.active_comment_count = data['active_comment_count'];
    this.comment_count = data['comment_count'];
    this.comment_enabled = data['comment_enabled'];
    this.content = data['content'];
    this.created = new Date(data['created']);
    this.excerpt = data['excerpt'];
    this.featured = data['featured'];
    this.format = data['format'];
    this.hidden_comment_count = data['hidden_comment_count'];
    this.id = data['id'];
    this.is_page = data['is_page'];
    this.meta_description = data['meta_description'];
    this.password = data['password'];
    this.pending_comment_count = data['pending_comment_count'];
    this.published = new Date(data['published']);
    this.site = data['site'];
    this.slug = data['slug'];
    this.start_publication = new Date(data['start_publication']);
    this.status = data['status'];
    this.title = data['title'];
    this.updated = new Date(data['updated']);
    this.user = data['user'];
    this.view_count = data['view_count'];
    this.vote_count = data['vote_count'];

    // Entry draft default value
    let entryDraftValue = null;

    // Check if property 'entrydraft' has a value.
    if (data['entrydraft']) {
      entryDraftValue = new Entry(data['entrydraft']);
    }

    this.entrydraft = entryDraftValue;

    // Entry media default value
    let entryMediaValue = null;

    // Check if property 'cover_image' has a value.
    if (data['media'] && data['media'].cover_image) {
      entryMediaValue = new DolphinFile(data['media'].cover_image);
    }

    this.media = new EntryMedia(entryMediaValue);

    // Entry updated by default value
    let updatedByValue = null;

    // Check if property 'updated_by' has a value.
    if (data['updated_by']) {
      updatedByValue = new EntryUser(data['updated_by']);
    }

    this.updated_by = updatedByValue;

    if (data['tags']) {
      for (const tag of data['tags']) {
        this.tags.push(new Tag(tag));
      }
    }
  }
}
