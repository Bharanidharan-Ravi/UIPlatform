import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Search } from "lucide-react";

/**
 * CustomTable - A highly modular and responsive data grid for the platform.
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions: { id, label, align, render }
 * @param {Array} props.data - Array of row data objects
 * @param {boolean} props.enableSizeAdjustment - Whether to show the size toggle (compact/comfortable)
 * @param {boolean} props.enableGlobalSearch - Whether to show the global autocomplete search field
 * @param {React.ReactNode} props.footerContent - Custom footer (totals, etc.) passed from app
 * @param {Array} props.searchData - Array of objects for the autocomplete dropdown: { label, value, ...rest }
 * @param {function} props.onSearchSelect - Callback when an item is selected from search dropdown
 * @param {string} props.className - Tailwind classes to override default wrapper container
 * @param {string} props.searchPlaceholder - Placeholder text for search field
 */
const CustomTable = ({
  columns = [],
  data = [],
  enableSizeAdjustment = true,
  enableGlobalSearch = true,
  footerContent = null,
  searchData = [],
  onSearchSelect = () => {},
  className = "w-full flex flex-col gap-4",
  searchPlaceholder = "Search by item code or name...",
}) => {
  const [size, setSize] = useState("medium"); // "small" or "medium"
  const [searchValue, setSearchValue] = useState(null);

  const handleSizeToggle = (event) => {
    setSize(event.target.checked ? "small" : "medium");
  };

  const handleSearchChange = (event, newValue) => {
    setSearchValue(null); // Clear search after selection to act like a quick add
    if (newValue) {
      onSearchSelect(newValue);
    }
  };

  return (
    <Box className={className}>
      {/* Header Controls (Search & Size Toggle) */}
      {(enableGlobalSearch || enableSizeAdjustment) && (
        <Box className={`flex flex-col md:flex-row md:items-center ${enableGlobalSearch ? 'justify-between' : 'justify-end'} gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200`}>
          {enableGlobalSearch && (
            <Box className="w-full md:w-1/2 lg:w-1/3">
              <Autocomplete
                value={searchValue}
                onChange={handleSearchChange}
                options={searchData}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={searchPlaceholder}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Search className="text-gray-400 w-4 h-4 ml-2 mr-1" />
                          {params.InputProps?.startAdornment}
                        </>
                      ),
                    }}
                    className="bg-gray-50"
                  />
                )}
                noOptionsText="No items found"
              />
            </Box>
          )}

          {enableSizeAdjustment && (
            <FormControlLabel
              control={
                <Switch
                  checked={size === "small"}
                  onChange={handleSizeToggle}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" className="text-gray-600">
                  Compact View
                </Typography>
              }
              className="m-0"
            />
          )}
        </Box>
      )}

      {/* Table Container */}
      <TableContainer component={Paper} className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <Table size={size} aria-label="custom data table">
          <TableHead className="bg-gray-100">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  className="font-semibold text-gray-700 py-3"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || "left"} className="text-gray-800">
                      {col.render ? col.render(row) : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" className="py-8 text-gray-500">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Footer Area */}
      {footerContent && (
        <Box className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          {footerContent}
        </Box>
      )}
    </Box>
  );
};

export default CustomTable;
