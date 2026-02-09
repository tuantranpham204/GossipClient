export {};

declare global {
  interface Meta {
    total_pages: number;
    total_count: number;
    current_page: number;
    per_page: number;
  }
}
