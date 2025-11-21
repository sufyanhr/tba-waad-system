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
