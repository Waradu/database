import type { Tables } from "~/types/database.types";

export interface DatabaseStore {
  fetched: boolean;
  loading: boolean;
  tables: Tables<"tables">[];
  rows: Tables<"rows">[];
  tags: Tables<"tags">[];
  row_tag: Tables<"row_tag">[];
  table_tag: Tables<"table_tag">[];
}

export interface DataTable {
  content: {
    blocks: Block[];
  };
  id: number;
  row_id: number | null;
}

export interface TextBlock {
  content: string;
  bold: boolean;
  italic: boolean;
  code: boolean;
  link: string;
}

export interface ParagraphBlock {
  quote: boolean;
  children: TextBlock[];
}

export interface HeadingBlock {
  size: number;
  content: string;
}

export interface ListBlock {
  type: "ordered" | "unordered";
  children: Block[];
}

export interface CodeBlock {
  language: string;
  text: string;
}

export interface CheckListItemBlock {
  checked: boolean;
  children: TextBlock[];
}

export interface CheckListBlock {
  children: CheckListItemBlock[];
}

export interface EmbedBlock {
  service: string;
  url: string;
}

export interface TableBlock {
  columns: string[];
  rows: Block[][];
}

export interface ColumnsBlock {
  rows: Block[];
}

export interface DetailsBlock {
  summary: Block;
  children: Block[];
}

export interface ImageBlock {
  src: string;
  alt: string;
}

export type Block =
  | { type: "text"; data: TextBlock }
  | { type: "paragraph"; data: ParagraphBlock }
  | { type: "heading"; data: HeadingBlock }
  | { type: "list"; data: ListBlock }
  | { type: "code"; data: CodeBlock }
  | { type: "checklist"; data: CheckListBlock }
  | { type: "embed"; data: EmbedBlock }
  | { type: "seperator"; data: null }
  | { type: "image"; data: ImageBlock };

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

export interface Toasts {
  index: number;
  toasts: Toast[];
}

export type DatabaseData = "tags" | "tables" | "rows";
