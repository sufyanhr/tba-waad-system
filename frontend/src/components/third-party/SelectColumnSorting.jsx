import { Select, MenuItem } from '@mui/material';

const SelectColumnSorting = ({ value, options, onChange }) => {
  return (
    <Select value={value} onChange={onChange} size="small">
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectColumnSorting;
