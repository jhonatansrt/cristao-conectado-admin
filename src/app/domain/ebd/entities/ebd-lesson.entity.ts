export interface EbdBook {
  id: string;
  name: string;
  chapters_count: number;
  testament: string;
}

export interface EbdLessonPassage {
  id: string;
  lesson_id: string;
  book_id: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  book: EbdBook;
}

export interface EbdLessonImage {
  id: string;
  lesson_id: string;
  image: string;
}

export interface EbdLessonPdf {
  id: string;
  lesson_id: string;
  pdf: string;
}

export interface EbdLessonVideo {
  id: string;
  lesson_id: string;
  video_url: string;
  title: string;
}

export interface EbdLesson {
  id: string;
  group_id: string;
  title: string;
  done: boolean;
  display_order: number;
  passages: EbdLessonPassage[];
  images: EbdLessonImage[];
  pdfs: EbdLessonPdf[];
  videos: EbdLessonVideo[];
}
