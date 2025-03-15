import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import {
  GridReadyEvent,
  IGetRowsParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { useLazyQuery } from '@apollo/client';
import { Episode, GetEpisodesDocument } from '@/gql/graphql';
import { tableThemeLight, tableThemeDark } from '@/lib/ag-grid/theme';
import { useColorMode } from '@/components/ui/color-mode';
import PageSearchBox from '@/components/PageSearchBox';
import { debounce } from '@/utils/debounce';
import { toaster } from '@/components/ui/toaster';

const PAGE_SIZE = 20;

const columnDefs = [
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
    width: 150,
  },
  { field: 'episode', headerName: 'Episode Code', width: 130 },
  {
    headerName: 'Characters',
    field: 'characterCount',
    valueGetter: (params: ValueGetterParams) => params.data?.characters?.length,
    width: 120,
  },
];

const Episodes = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { colorMode } = useColorMode();
  const tableTheme = colorMode === 'light' ? tableThemeLight : tableThemeDark;

  const [fetchEpisodes, { loading, error }] = useLazyQuery(
    GetEpisodesDocument,
    {
      fetchPolicy: 'network-only',
    }
  );

  const defaultColDef = useMemo(() => ({ resizable: true }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption('datasource', {
      getRows: async (params: IGetRowsParams) => {
        const { startRow } = params;
        const page = Math.ceil(startRow / PAGE_SIZE) + 1;

        // Reduce the filterModel to match the variables expected by the API
        const filter: { [key: string]: string } = {};
        Object.keys(params.filterModel).forEach((key) => {
          if (params.filterModel[key].filter) {
            filter[key] = params.filterModel[key].filter;
          }
        });

        // NOTE: The rick and morty api does not support server side sorting so leaving this as is
        // TODO: Add support for server side sorting
        if (params.sortModel?.length) {
          //
        }

        try {
          const { data } = await fetchEpisodes({
            variables: { page, filter: filter },
          });

          const episodes = (data?.episodes?.results as Episode[]) || [];
          const totalRows = data?.episodes?.info?.count || 0;
          params.successCallback(episodes, totalRows);
        } catch (error) {
          console.error('Error fetching data:', error);
          params.failCallback();
        }
      },
    });
  }, []);

  useEffect(() => {
    if (error) {
      toaster.create({
        description: 'Could not load characters',
        type: 'error',
      });
    }
  }, [error]);

  return (
    <VStack gap={6} align="stretch">
      <PageSearchBox
        title="Episodes"
        onChange={debounce((e) => {
          gridRef.current?.api.setFilterModel({
            name: {
              filter: e.target.value,
            },
          });
        }, 500)}
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
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="infinite"
          cacheBlockSize={PAGE_SIZE}
          paginationPageSize={PAGE_SIZE}
          maxConcurrentDatasourceRequests={1}
          maxBlocksInCache={2}
          onGridReady={onGridReady}
          animateRows={true}
          theme={tableTheme}
          loading={loading}
        />
      </Box>
    </VStack>
  );
};

export default Episodes;
