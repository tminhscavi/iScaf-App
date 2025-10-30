export type TSPListItem = {
  '@odata.context': string;
  value: TSPItem[];
};

export type TSPItem = {
  '@odata.etag': string;
  createdDateTime: string;
  eTag: string;
  id: string;
  lastModifiedDateTime: string;
  webUrl: string;
  createdBy: CreatedBy;
  lastModifiedBy: LastModifiedBy;
  parentReference: ParentReference;
  contentType: ContentType;
  'fields@odata.context': string;
};

export interface CreatedBy {
  user: User;
}

export interface User {
  email: string;
  id: string;
  displayName: string;
}

export interface LastModifiedBy {
  application: Application;
  user: User2;
}

export interface Application {
  id: string;
  displayName: string;
}

export interface User2 {
  email: string;
  id: string;
  displayName: string;
}

export interface ParentReference {
  id: string;
  siteId: string;
}

export interface ContentType {
  id: string;
  name: string;
}

export type TSPField = {
  id: string;
  '@odata.etag': string;
  Modified: string;
  Created: string;
  ContentType: string;
  AuthorLookupId: string;
  EditorLookupId: string;
  _UIVersionString: string;
  Attachments: boolean;
  Edit: string;
  LinkTitleNoMenu: string;
  LinkTitle: string;
  ItemChildCount: string;
  FolderChildCount: string;
  _ComplianceFlags: string;
  _ComplianceTag: string;
  _ComplianceTagWrittenTime: string;
  _ComplianceTagUserId: string;
  AppAuthorLookupId: string;
  AppEditorLookupId: string;
};
