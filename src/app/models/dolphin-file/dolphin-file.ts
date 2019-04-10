class MetaData {
  name: string;
  description: string;

  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

export class DolphinFile {
  id: string;
  file: string;
  thumbnail_256x256: string;
  thumbnail_128x128: string;
  thumbnail_48x48: string;
  ext: string;
  metaData: MetaData;
  user: string;
  fileName: string;
  sizeHuman: string;
  isImage: boolean;
  created: Date;
  updated: Date;

  isDeleted: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.file = data.file;
    this.thumbnail_256x256 = data.thumbnail_256x256;
    this.thumbnail_128x128 = data.thumbnail_128x128;
    this.thumbnail_48x48 = data.thumbnail_48x48;
    this.ext = data.ext;
    this.metaData = new MetaData(data.meta_data.name, data.meta_data.description);
    this.fileName = data.file_name;
    this.sizeHuman = data.size_human;
    this.isImage = data.is_image;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
    this.user = data.user;
  }

  get extension(): string {
    let text = this.ext.split('/')[1].toUpperCase();

    if (text === 'JPEG') {
      return text = 'JPG';
    }

    return text;
  }
}
