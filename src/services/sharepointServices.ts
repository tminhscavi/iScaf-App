import {
  SHAREPOINT_LIST,
  SHAREPOINT_LIST_ENUM,
  SHAREPOINT_SITE_ID,
} from '@/constants/msalConfig';
import { createApiInstance } from '@/utils/axios';

const sharepointInstance = createApiInstance('payment', {
  baseURL: 'https://graph.microsoft.com/v1.0/',
  tokenCookieName: 'msal-token',
  enableTokenRefresh: false, // No refresh for third-party API
  timeout: 10000,
});

async function getList(listId: string, queryParams = '') {
  const response = await sharepointInstance.api.get(
    `sites/${SHAREPOINT_SITE_ID}/lists/${listId}/items?expand=fields` +
      queryParams,
  );
  return response?.value || [];
}

const getNotifications = async (memberCode = '') => {
  const notiListId = SHAREPOINT_LIST[SHAREPOINT_LIST_ENUM.USER_NOTIFICATION].id;

  try {
    const response = await getList(
      notiListId,
      `&$filter=fields/ID_x002d_MSTV eq '${memberCode}'&$top=1000`,
    );
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export { getNotifications };
