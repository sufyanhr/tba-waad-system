#!/bin/bash

# Create pagination hook
cat > src/hooks/usePagination.js << 'EOF'
import { useState } from 'react';

const usePagination = (items, itemsPerPage = 10) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedItems = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return {
    page,
    rowsPerPage,
    paginatedItems,
    handleChangePage,
    handleChangeRowsPerPage
  };
};

export default usePagination;
EOF

# Other common hooks
cat > src/hooks/useLocalStorage.js << 'EOF'
import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
EOF

# Create sorting utility
cat > src/utils/sort.js << 'EOF'
export const compareStrings = (a, b) => {
  return a.localeCompare(b);
};

export const compareNumbers = (a, b) => {
  return a - b;
};

export default { compareStrings, compareNumbers };
EOF

echo "Hooks and utils created!"
