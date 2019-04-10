import { Media } from '../media/media';

export class UserBlog {
  id: string;
  role: number;
  title: string;
  url: string;

  media: object = {
    logo: null
  };

  constructor(data: object) {
    this.id = data['id'];
    this.role = data['role'];
    this.title = data['title'];
    this.url = data['url'];

    if (data['media']) {
      this.media = {
        logo: data['media'].logo
      };
    } else {
      this.media['logo'] = null;
    }
  }

  public get logo(): string {
    if (this.media['logo']) {
      return this.media['logo'].thumbnail_48x48;
    }
    return '../../../assets/img/avatar.svg';
  }
}

export class User {
  email: string;
  get_absolute_uri: string;
  has_verified_email: boolean;
  id: string;
  is_active: boolean;
  name: string;
  receive_email_notification: boolean;
  username: string;

  media: Media;
  sites: Array<UserBlog> = [];

  constructor(data: object) {
    this.email = data['email'];
    this.get_absolute_uri = data['get_absolute_uri'];
    this.has_verified_email = data['has_verified_email'];
    this.id = data['id'];
    this.is_active = data['is_active'];
    this.name = data['name'];
    this.receive_email_notification = data['receive_email_notification'];
    this.username = data['username'];

    this.media = new Media(data['media']);

    // If user has any sites, then create new 'UserBlog' model for each blog.
    if (data['sites']) {
      for (const site of data['sites']) {
        this.sites.push(new UserBlog(site));
      }
    }
  }

  public avatar(size: string): string {
    if (this.media[size]) {
      return this.media[size];
    }
    return '../../assets/img/avatar.svg';
  }

}
