import React from 'react'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TablePaginationActions from '../../utils/TablePaginationActions'

/**
 * The pagination footer, borrowed from MUI
 */
const PaginationFooter = ({ editMode, dataLength, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }) => (
  <TableFooter>
    <TableRow>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        colSpan={3}
        count={dataLength}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            'aria-label': 'rows per page',
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        // page changes are prohibited in the edit mode
        ActionsComponent={(subProps) => <TablePaginationActions {...subProps} editMode={editMode} />}
      />
    </TableRow>
  </TableFooter>
)

export default PaginationFooter