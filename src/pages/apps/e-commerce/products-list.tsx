import { Fragment, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
  FilterFn
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project imports
import ProductView from 'sections/apps/e-commerce/product-list/ProductView';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

// types
import { Products } from 'types/e-commerce';
import { LabelKeyObject } from 'react-csv/lib/core';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

const fuzzyFilter: FilterFn<Products> = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

interface Props {
  data: Products[];
  columns: ColumnDef<Products>[];
}

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  const headers: LabelKeyObject[] = [];
  columns.map(
    (columns) =>
      // @ts-expect-error Type 'string | undefined' is not assignable to type 'string'.
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-expect-error Type 'string | undefined' is not assignable to type 'string'.
        key: columns.accessorKey
      })
  );

  const history = useNavigate();

  const handleAddProduct = () => {
    history(`/apps/e-commerce/add-new-product`);
  };

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', p: 2 }}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />

        <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" sx={{ textWrap: 'nowrap' }} startIcon={<PlusOutlined />} onClick={handleAddProduct}>
            Add Product
          </Button>
          <CSVExport
            {...{
              data:
                table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0
                  ? data
                  : table.getSelectedRowModel().flatRows.map((row) => row.original),
              headers,
              filename: 'product-list.csv'
            }}
          />
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow
                        sx={(theme) => ({
                          bgcolor: alpha(theme.palette.primary.lighter, 0.1),
                          '&:hover': { bgcolor: `${alpha(theme.palette.primary.lighter, 0.1)} !important` }
                        })}
                      >
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <ProductView data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                  initialPageSize: 5
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| PRODUCT LIST ||============================== //

export default function ProductList() {
  const products = useLoaderData() as Products[];

  const columns = useMemo<ColumnDef<Products>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: '#',
        accessorKey: 'id',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Product Detail',
        accessorKey: 'name',
        cell: ({ row, getValue }) => (
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
            <Avatar
              variant="rounded"
              alt={getValue() as string}
              color="secondary"
              size="sm"
              src={getImageUrl(`${!row.original.image ? 'prod-11.png' : row.original.image}`, ImagePath.ECOMMERCE)}
            />
            <Stack>
              <Typography variant="subtitle1">{getValue() as string}</Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.description}
              </Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Categories',
        accessorKey: 'categories',
        cell: ({ row }) => {
          return row.original.categories ? (
            <Stack direction="row" sx={{ gap: 0.25 }}>
              {row.original?.categories.map((item: string, index: number) => (
                <Typography variant="h6" key={index} sx={{ textTransform: 'capitalize' }}>
                  {item}
                  {row.original.categories!.length > index + 1 ? ',' : ''}
                </Typography>
              ))}
            </Stack>
          ) : (
            <Typography variant="h6">-</Typography>
          );
        }
      },
      {
        header: 'Price',
        accessorKey: 'offerPrice',
        cell: ({ getValue }) => <NumericFormat value={getValue() as number} displayType="text" thousandSeparator prefix="$" />,
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Qty',
        accessorKey: 'quantity',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Status',
        accessorKey: 'isStock',
        cell: ({ getValue }) => (
          <Chip color={getValue() ? 'success' : 'error'} label={getValue() ? 'In Stock' : 'Out of Stock'} size="small" variant="light" />
        )
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? <PlusOutlined style={{ transform: 'rotate(45deg)' }} /> : <EyeOutlined />;
          return (
            <Tooltip title="View">
              <IconButton
                color={row.getIsExpanded() ? 'error' : 'secondary'}
                sx={{ '&::after': { content: 'none' } }}
                onClick={row.getToggleExpandedHandler()}
              >
                {collapseIcon}
              </IconButton>
            </Tooltip>
          );
        }
      }
    ],
    []
  );

  return <ReactTable {...{ data: products, columns }} />;
}
