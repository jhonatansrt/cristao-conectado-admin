export interface CreateEbdLessonPassageDTO {
  lesson_id: string;
  book_id: string;
  chapter: number;
  verse_start?: number;
  verse_end?: number;
}
