export interface Paragraph {
  bn: string;
  en: string;
  isVerse: boolean;
}

export interface Chapter {
  number: number;
  title: string;
  artTitle: string;
  artStyle: string;
  imageUrl: string;
  paragraphs: Paragraph[];
}

export interface BookTitle {
  bn: string;
  en: string;
  transliteration: string;
}

export interface BookAuthor {
  bn: string;
  en: string;
}

export interface BookData {
  title: BookTitle;
  author: BookAuthor;
  chapters: Chapter[];
}
