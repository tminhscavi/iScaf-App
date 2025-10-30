/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/styles';

type TOptions = {
  label: string;
  value: string;
  image?: string;
  group?: string;
};
interface IComboboxProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  value?: string;
  options: TOptions[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  hasEmptyOption?: boolean;
  onChange?: Function;
  hasGroup?: boolean;
}

export function Combobox({
  className,
  loading,
  disabled,
  value,
  options,
  placeholder = 'Chọn một mục',
  searchPlaceholder = 'Tìm kiếm',
  emptyText = 'Không tìm thấy mục nào.',
  hasEmptyOption,
  hasGroup,
  onChange,
}: IComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [renderValue, setRenderValue] = React.useState('');
  const [renderOptions, setRenderOptions] = React.useState<TOptions[]>([]);
  const [groups, setGroups] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (value) {
      setRenderValue(value);
    }
    setRenderOptions(options);
  }, [options]);

  React.useEffect(() => {
    if (hasGroup) {
      const groups = options.map((item) => item.group || '');

      if (groups.length) {
        const groupSet = new Set(groups);
        setGroups([...groupSet]);
      }
    }
  }, [hasGroup, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn('max-w-full p-3')}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between overflow-hidden text-sm font-normal hover:bg-transparent hover:text-black focus:scale-100',
            className,
          )}
          disabled={disabled}
          loading={loading}
        >
          <p className="max-w-[60vw] overflow-hidden text-ellipsis">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </p>
          {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {hasEmptyOption && (
                <CommandItem
                  onSelect={(currentValue) => {
                    setRenderValue(
                      currentValue === renderValue ? '' : currentValue,
                    );
                    if (onChange) {
                      onChange(null);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      renderValue === '' ? 'opacity-100' : 'opacity-0',
                    )}
                  />

                  {'Không chọn'}
                </CommandItem>
              )}
              {groups.length
                ? groups.map((group) => {
                    const optionsInGroup = options.filter(
                      (option) => option.group === group,
                    );
                    return (
                      <div
                        key={group}
                        className="p-1 [&:not(:first-child)]:mt-2 [&:not(:last-child)]:border-b-2"
                      >
                        <p className="mb-1 text-sm font-semibold">
                          {group || 'Chưa có phòng ban'}
                        </p>
                        {optionsInGroup.length > 0 &&
                          optionsInGroup.map((option) => (
                            <CommandItem
                              key={option.value}
                              onSelect={(currentValue) => {
                                setRenderValue(
                                  currentValue === renderValue
                                    ? ''
                                    : currentValue,
                                );
                                if (onChange) {
                                  onChange(
                                    currentValue === renderValue
                                      ? ''
                                      : option.value,
                                  );
                                }
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  renderValue === option.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {option?.image && (
                                <img
                                  src={option.image}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              )}
                              {option.label}
                            </CommandItem>
                          ))}
                      </div>
                    );
                  })
                : renderOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={(currentValue) => {
                        setRenderValue(
                          currentValue === renderValue ? '' : currentValue,
                        );
                        if (onChange) {
                          onChange(
                            currentValue === renderValue ? '' : option.value,
                          );
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          renderValue === option.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {option?.image && (
                        <img
                          src={option.image}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      {option.label}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
