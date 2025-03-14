import { useState, useCallback, useMemo } from 'react';
import { Box, Heading, Input, VStack, Field } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, IGetRowsParams } from 'ag-grid-community';
import { useLazyQuery } from '@apollo/client';
import { GetEpisodesDocument } from '@/gql/graphql';
import { tableThemeLight, tableThemeDark } from '@/lib/ag-grid/theme';
import { useColorMode } from '@/components/ui/color-mode';

const PAGE_SIZE = 20;

const Episodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const { colorMode } = useColorMode();
  const tableTheme = colorMode === 'light' ? tableThemeLight : tableThemeDark;

  const [fetchEpisodes] = useLazyQuery(GetEpisodesDocument, {
    fetchPolicy: 'network-only',
  });

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'name', filter: true, flex: 1 },
      { field: 'air_date', headerName: 'Air Date', sortable: true, width: 150 },
      {
        field: 'episode',
        headerName: 'Episode Code',
        width: 130,
      },
      {
        headerName: 'Characters',
        field: 'characterCount',
        valueGetter: (params) => params.data.characters?.length,
        width: 120,
      },
    ],
    []
  );

  const defaultColDef = useMemo(() => ({ resizable: true }), []);

  // Infinite scrolling data source
  const getRows = useCallback(
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
    [fetchEpisodes, searchTerm]
  );

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      setGridApi(params.api);
      params.api.setDatasource({ getRows });
    },
    [getRows]
  );

  return (
    <VStack gap={6} align="stretch">
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="sm"
        _dark={{ bg: 'gray.800' }}
      >
        <Heading size="lg" color="blue.500">
          Episodes
        </Heading>

        <Field.Root orientation="horizontal">
          <Field.Label>Search</Field.Label>
          <Input
            placeholder="Search by episode name..."
            value={searchTerm}
            _dark={{ bg: 'gray.700' }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              gridApi?.purgeServerSideCache(); // Refresh results
            }}
            flex={1}
          />
        </Field.Root>
      </Box>

      <Box
        className="ag-theme-alpine"
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
          animateRows={true}
          theme={tableTheme}
        />
      </Box>
    </VStack>
  );
};

export default Episodes;
