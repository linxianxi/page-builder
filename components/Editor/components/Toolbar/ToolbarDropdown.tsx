import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import React from 'react';

export const ToolbarDropdown = ({ title, value, onChange, children }: any) => {
  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <Select native value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </Select>
    </FormControl>
  );
};
