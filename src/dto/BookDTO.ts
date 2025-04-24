/**
 * Data Transfer Objects cho Book
 */
export interface SimplifiedBookDTO {
  id: string;
  title: string;
  description: string;
  firstChapterId: string | null;
  isCollection: boolean;
}

export interface BookApiResponse {
  total: number;
  items: BookItem[];
  statuses: StatusItem[];
  _links: Links;
}

export interface BookItem {
  id: string;
  createdBy: string;
  lastModifiedBy: string;
  data: BookData;
  created: string;
  lastModified: string;
  status: string;
  statusColor: string;
  schemaId: string;
  schemaName: string;
  schemaDisplayName: string;
  version: number;
  _links: BookLinks;
}

export interface BookData {
  title: {
    iv: string;
  };
  description: {
    iv: string;
  };
  isCollection: {
    iv: boolean;
  };
  collection: {
    iv: string[] | null;
  };
  book: {
    iv: string[] | null;
  };
  includedInCollection: {
    iv: boolean;
  };
}

interface BookLinks {
  self: Link;
  previous: Link;
}

interface StatusItem {
  status: string;
  color: string;
}

interface Link {
  href: string;
  method: string;
}

interface Links {
  self: Link;
}

// DTO for simplified book data to use in the app
export interface BookDTO {
  id: string;
  title: string;
  description: string;
  isCollection: boolean;
  includedInCollection: boolean;
  chapterIds?: string[];
}
