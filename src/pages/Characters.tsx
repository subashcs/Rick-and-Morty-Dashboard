import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { type ColDef, type GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { VStack, Box, Heading, HStack, Field, Input } from '@chakra-ui/react';
import { GetCharactersDocument } from '@/gql/graphql';
import { tableThemeDark, tableThemeLight } from '@/lib/ag-grid/theme';
import { useColorMode } from '@/components/ui/color-mode';

const Characters = () => {
  const [fetchCharacters, { loading }] = useLazyQuery(GetCharactersDocument);
  const [allData, setAllData] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const { colorMode } = useColorMode();
  const tableTheme = colorMode === 'light' ? tableThemeLight : tableThemeDark;

  // Fetch all characters from the API
  useEffect(() => {
    const fetchData = async () => {
      let allResults: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          //  NOTE: Currently we are using client side filter, we can pass filter variable
          //  to implement server side filtering
          const result = await fetchCharacters({
            variables: { page },
          });

          const characters = result.data.characters.results;
          const totalCount = result.data.characters.info.count;

          allResults = [...allResults, ...characters];

          if (page * 20 >= totalCount) {
            hasMore = false;
          } else {
            page++;
          }
        } catch (error) {
          console.error('Error fetching Rick and Morty data:', error);
          hasMore = false;
        }
      }

      setAllData(allResults); // Store all fetched data
    };

    fetchData();
  }, [fetchCharacters]);

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'ID',
        maxWidth: 100,
        // it is important to have node.id here, so that when the id changes (which happens
        // when the row is loaded) then the cell is refreshed.
        valueGetter: 'node.id',
        sortable: false,
        cellRenderer: (props) => {
          if (props.value !== undefined) {
            return props.value;
          } else {
            return (
              <img src="https://www.ag-grid.com/example-assets/loading.gif" />
            );
          }
        },
      },
      {
        field: 'name',
        headerName: 'Character Name',
        minWidth: 200,
        sortable: true,
      },
      {
        field: 'status',
        headerName: 'Status',
        filter: 'agSetColumnFilter', // Enable set-based filtering
      },
      {
        field: 'species',
        headerName: 'Species',
        filter: 'agSetColumnFilter', // Enable set-based filtering
      },
      {
        field: 'gender',
        headerName: 'Gender',
        filter: 'agSetColumnFilter', // Enable set-based filtering
      },
      {
        field: 'origin.name',
        headerName: 'Origin',
        minWidth: 180,
      },
      {
        headerName: 'Episodes',
        field: 'episodeCount',
        valueGetter: (params) => params.data?.episode?.length,
        sortable: true,
        width: 120,
      },
      {
        field: 'image',
        headerName: 'Avatar',
        minWidth: 150,
        cellRenderer: (props: any) => {
          if (props.value) {
            return (
              <img
                src={props.value}
                alt={props.data.name}
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
            );
          }
          return null;
        },
      },
    ],
    []
  );

  // Default column definition
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 100,
      sortable: false,
      filter: false, // Enable filtering by default
    }),
    []
  );

  const onFilterTextBoxChanged: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    gridApi.setGridOption('quickFilterText', e.target.value);
  };

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  return (
    <VStack gap={6} align="stretch">
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="sm"
        _dark={{ bg: 'gray.800' }}
      >
        <VStack gap={6} align="stretch">
          <Heading size="lg" color="blue.500">
            Characters
          </Heading>

          <HStack gap={4} wrap="wrap">
            <Field.Root orientation={'horizontal'}>
              <Field.Label>Search</Field.Label>
              <Input
                placeholder="Search by name..."
                onChange={onFilterTextBoxChanged}
                width="300px"
                bg="white"
                _dark={{ bg: 'gray.700' }}
                flex={1}
              />
            </Field.Root>
          </HStack>
        </VStack>
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
          rowData={allData} // Pass all data to the grid
          rowBuffer={0}
          onGridReady={onGridReady}
          theme={tableTheme}
          loading={loading}
        />
      </Box>
    </VStack>
  );
};

export default Characters;
