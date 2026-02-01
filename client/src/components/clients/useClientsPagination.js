import { useState } from "react";

export const useClientsPagination = (initialRowsPerPage = 10) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedData = (data) => {
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    getPaginatedData,
  };
};
