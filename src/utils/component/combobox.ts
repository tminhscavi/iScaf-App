/* eslint-disable @typescript-eslint/no-explicit-any */
import { getValueByPath } from '..';

export function handleParseMultipleSelectOptions({
  optionData,
  labelKey,
  valueKey,
  groupKey,
  imageKey,
}: {
  optionData: Array<any>;
  labelKey: string;
  valueKey: string;
  groupKey?: string;
  imageKey?: { value: string; fallback: string };
}) {
  return optionData
    ? optionData.map((data) => {
        return {
          label: getValueByPath(data, labelKey) || '',
          value: valueKey ? getValueByPath(data, valueKey) : data,
          //   ...(imageKey && {
          //     image:
          //       getImage(data[imageKey.value] || data.image, imageKey.fallback) ||
          //       '',
          //   }),
          ...(groupKey && { group: getValueByPath(data, groupKey) || '' }),
        };
      })
    : [];
}
