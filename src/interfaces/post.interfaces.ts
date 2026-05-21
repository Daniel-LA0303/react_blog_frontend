export interface PostUpdate {
  title?: string;
  content?: string;
  categoriesPost?: any;
  categoriesSelect?: any;
  desc?: string;

  previousName?: string | null;
  linkImage?: PostImage | null;
}

export type PostImage = {
  public_id: string;
  secure_url: string;
};

export interface NewPostI {
  user: string;
  title: string;
  content: string;
  categories: string[];
  desc: string;
  date: number;
  linkImage?: any; // optional because image may not exist
}

export interface ImageResponse {
  secure_url: string;
  public_id: string;
}