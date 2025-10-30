import {
  COMMON_DATE_FORMAT,
  COMMON_DATETIME_FORMAT,
  COMMON_TIME_FORMAT,
} from '@/constants';
import dayjs from 'dayjs';

export function toDateTimeString(datetime: string | Date) {
  return dayjs(datetime).format(COMMON_DATETIME_FORMAT);
}

export function toDateString(datetime: string | Date) {
  return dayjs(datetime).format(COMMON_DATE_FORMAT);
}

export function toTimeString(datetime: string | Date) {
  return dayjs(datetime).format(COMMON_TIME_FORMAT);
}
