import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableRow, Skeleton, Typography } from '@mui/material';

/**
 * Mini Table Component
 * Displays a compact table for latest/recent items
 */
const MiniTable = ({ title, columns = [], rows = [], loading = false, emptyMessage = 'No data available' }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="40%" />} />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((row) => (
                <TableRow key={row}>
                  {columns.map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton width="90%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ p: 0 }}>
        {rows.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ p: 3, textAlign: 'center' }}>
            {emptyMessage}
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align || 'left'} sx={{ fontWeight: 600 }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIdx) => (
                <TableRow key={rowIdx} hover>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || 'left'}>
                      {col.render ? col.render(row[col.id], row) : row[col.id] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

MiniTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func
    })
  ),
  rows: PropTypes.array,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string
};

export default MiniTable;
