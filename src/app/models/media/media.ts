export class Media {
  full: string;
  medium: string;
  small: string;
  tiny: string;

  constructor(data: object) {
    this.full = data['picture'];
    this.medium = data['thumbnail_256x256'];
    this.small = data['thumbnail_128x128'];
    this.tiny = data['thumbnail_48x48'];
  }
}
