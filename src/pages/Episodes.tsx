import { useState, useCallback, useMemo } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  IGetRowsParams,
} from 'ag-grid-community';
import { useLazyQuery } from '@apollo/client';
import { GetEpisodesDocument } from '@/gql/graphql';
import { tableThemeLight, tableThemeDark } from '@/lib/ag-grid/theme';
import { useColorMode } from '@/components/ui/color-mode';
import PageSearchBox from '@/components/PageSearchBox';

const PAGE_SIZE = 20;

const Episodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gridApi, setGridApi] = useState<GridApi<any> | null>(null);
  const { colorMode } = useColorMode();
  const tableTheme = colorMode === 'light' ? tableThemeLight : tableThemeDark;

  const [fetchEpisodes] = useLazyQuery(GetEpisodesDocument, {
    fetchPolicy: 'network-only',
  });

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'id' },
      {
        field: 'name',
        filter: true,
        flex: 1,
      },
      {
        field: 'air_date',
        headerName: 'Air Date',
        sortable: true,
        comparator: (valueA, valueB) => valueA - valueB,
        width: 150,
      },
      { field: 'episode', headerName: 'Episode Code', width: 130 },
      {
        headerName: 'Characters',
        field: 'characterCount',
        valueGetter: (params) => params.data?.characters?.length,
        width: 120,
      },
    ],
    []
  );

  const defaultColDef = useMemo(() => ({ resizable: true }), []);

  // Fetch Data (Once Per Search)
  const getRowsFunction = useCallback(
    (
      searchTerm: string,
      sortModel?: { colId: string; sort: string | null | undefined }[]
    ) =>
      async (params: IGetRowsParams) => {
        const { startRow } = params;
        const page = Math.ceil(startRow / PAGE_SIZE) + 1;

        try {
          const { data } = await fetchEpisodes({
            variables: { page, filter: { name: searchTerm || undefined } },
          });

          const episodes = data?.episodes?.results || [];
          const totalRows = data?.episodes?.info?.count || 0;

          params.successCallback(episodes, totalRows);
        } catch (error) {
          console.error('Error fetching data:', error);
          params.failCallback();
        }
      },
    [fetchEpisodes]
  );

  // Handle Sorting Locally
  const onSortChanged = useCallback(() => {
    if (!gridApi) return;

    const columnState = gridApi.getColumnState(); // Get sorting details
    const sortModel = columnState
      .filter((col) => col.sort)
      .map((col) => ({ colId: col.colId, sort: col.sort })); // Extract sorting details

    console.debug('Updated sort model:', sortModel);

    // Update the data source with the new sorting model
    gridApi.setGridOption('datasource', {
      getRows: getRowsFunction(searchTerm, sortModel), // Pass sorting info
    });
  }, [gridApi, searchTerm, getRowsFunction]);

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      setGridApi(params.api);
      params.api.setGridOption('datasource', {
        getRows: getRowsFunction(searchTerm),
      });
    },
    [getRowsFunction, searchTerm]
  );

  return (
    <VStack gap={6} align="stretch">
      <PageSearchBox
        title="Episodes"
        onChange={(e) => {
          setSearchTerm(e.target.value);
          gridApi.setGridOption('datasource', {
            getRows: getRowsFunction(e.target.value),
          });
        }}
      />

      <Box
        height="600px"
        bg="white"
        borderRadius="xl"
        shadow="sm"
        overflow="hidden"
        _dark={{ bg: 'gray.800' }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="infinite"
          cacheBlockSize={PAGE_SIZE}
          paginationPageSize={PAGE_SIZE}
          onGridReady={onGridReady}
          onSortChanged={onSortChanged} // Sort locally, no refetch
          animateRows={true}
          theme={tableTheme}
        />
      </Box>
    </VStack>
  );
};

export default Episodes;
