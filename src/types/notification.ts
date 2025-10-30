import { TSPField, TSPItem } from './sharepoint';

export type TUserNotification = TSPItem & {
  fields: TSPField & {
    'ID-MSTV': string;
    Email: string;
    Title: string;
    ID_x002d_MSTV: string;
    Description: string;
    IsRead: boolean;
    RunID: string;
    Readers?: string;
  };
};
