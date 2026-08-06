import { Select } from "@radix-ui/themes";

interface SelectFilterProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  placeholder: string;
  unique?: boolean;
}

export default function SelectFilter({
  value,
  setValue,
  options,
  placeholder,
  unique = false,
}: SelectFilterProps) {
  function getDefaultValue() {
    return unique ? "all" : "";
  }

  return (
    <Select.Root
      value={value}
      onValueChange={setValue}
      defaultValue={getDefaultValue()}
    >
      <Select.Trigger variant="soft" placeholder={placeholder} />
      <Select.Content>
        {!unique && <Select.Item value="all">Todos</Select.Item>}
        {options.length &&
          options.map((option) => {
            return (
              <Select.Item
                key={option.toLocaleLowerCase()}
                value={option.toLocaleLowerCase()}
              >
                {option}
              </Select.Item>
            );
          })}
      </Select.Content>
    </Select.Root>
  );
}
