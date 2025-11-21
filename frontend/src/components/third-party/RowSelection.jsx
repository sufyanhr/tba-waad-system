import { Checkbox } from '@mui/material';

const RowSelection = ({ checked, indeterminate, onChange }) => {
  return <Checkbox checked={checked} indeterminate={indeterminate} onChange={onChange} />;
};

export default RowSelection;
