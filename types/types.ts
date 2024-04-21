import type { Tables } from "~/types/database.types";

export interface RowExtend {
  blocks: Block[];
}

export interface DatabaseStore {
  fetched: boolean;
  tables: Record<string, Tables<"tables">>;
  rows: Record<string, Tables<"rows"> & RowExtend>;
  tags: Record<string, Tables<"tags">>;
  row_tag: Record<string, Tables<"row_tag">>;
  table_tag: Record<string, Tables<"table_tag">>;
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
