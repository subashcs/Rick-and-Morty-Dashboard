import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import type { ColDef, GridReadyEvent, SortModelItem } from 'ag-grid-community';
import {
  InfiniteRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { AgGridReact } from 'ag-grid-react';
import { GET_CHARACTERS_ALL } from '@/graphql/queries/characters';
import { VStack, Box, Heading, HStack, Field, Input } from '@chakra-ui/react';

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  ValidationModule /* Development Only */,
]);

const Characters = () => {
  const [fetchCharacters] = useLazyQuery(GET_CHARACTERS_ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridApi, setGridApi] = useState(null);

  // Sorting state
  const [sortModel, setSortModel] = useState<SortModelItem[]>([]);

  const [columnDefs] = useState<ColDef[]>([
    // this row shows the row index, doesn't use any data from the row
    {
      headerName: 'ID',
      maxWidth: 100,
      // it is important to have node.id here, so that when the id changes (which happens
      // when the row is loaded) then the cell is refreshed.
      valueGetter: 'node.id',
      sortable: false,
      cellRenderer: (props: CustomCellRendererProps) => {
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
      sortable: true, // Enable sorting for name
      filter: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      filter: true,
      sortable: false,
    },
    {
      field: 'species',
      headerName: 'Species',
      filter: true,
      sortable: false,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      filter: true,
      sortable: false,
    },
    {
      field: 'origin.name',
      headerName: 'Origin',
      minWidth: 180,
      sortable: false,
    },
    {
      headerName: 'Episodes',
      field: 'episodeCount',
      valueGetter: (params) => params.data?.episode?.length,
      sortable: true, // Enable sorting for episode count
      width: 120,
    },
    {
      field: 'image',
      headerName: 'Avatar',
      minWidth: 150,
      sortable: false,
      cellRenderer: (props: CustomCellRendererProps) => {
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
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: false, // Disable sorting by default
    };
  }, []);

  // Create a datasource factory to handle refreshing with search and sorting
  const createDatasource = useCallback(
    (searchName = '', sortInfo: SortModelItem[] = []) => {
      return {
        rowCount: undefined,
        getRows: (params) => {
          console.log('asking for ' + params.startRow + ' to ' + params.endRow);

          // Calculate page number based on startRow and items per page (20 is default for Rick & Morty API)
          const page = Math.floor(params.startRow / 20) + 1;

          // Prepare variables for the GraphQL query
          const variables: any = { page };

          // Add name filter if provided
          if (searchName) {
            variables.filter = { name: searchName };
          }

          // Add sorting if provided
          if (sortInfo.length > 0) {
            const sortItem = sortInfo[0]; // Get the first sort item

            // Handle name sorting - this can be done server-side via API
            if (sortItem.colId === 'name') {
              variables.sort = { name: sortItem.sort.toUpperCase() };
            }

            // For episode count sorting, we'll need to implement client-side sorting
            // Since the API doesn't directly support sorting by episode count
            fetchCharacters({ variables })
              .then((result) => {
                let characters = result.data.characters.results;
                const totalCount = result.data.characters.info.count;

                // If sorting by episode count, sort the data client-side
                if (sortItem.colId === 'episodeCount') {
                  characters = [...characters].sort((a, b) => {
                    const aCount = a.episode?.length || 0;
                    const bCount = b.episode?.length || 0;
                    return sortItem.sort === 'asc'
                      ? aCount - bCount
                      : bCount - aCount;
                  });
                }

                // Calculate last row based on whether we've reached the end
                let lastRow = -1;
                if (page * 20 >= totalCount) {
                  lastRow = totalCount;
                }

                // Call the success callback with the data
                params.successCallback(characters, lastRow);
              })
              .catch((error) => {
                console.error('Error fetching Rick and Morty data:', error);
                params.failCallback();
              });

            return; // Return early since we've handled the request
          }

          // Standard request with no episode count sorting
          fetchCharacters({ variables })
            .then((result) => {
              const characters = result.data.characters.results;
              const totalCount = result.data.characters.info.count;

              // Calculate last row based on whether we've reached the end
              let lastRow = -1;
              if (page * 20 >= totalCount) {
                lastRow = totalCount;
              }

              // Call the success callback with the data
              params.successCallback(characters, lastRow);
            })
            .catch((error) => {
              console.error('Error fetching Rick and Morty data:', error);
              params.failCallback();
            });
        },
      };
    },
    [fetchCharacters]
  );

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      // Save grid API for later use
      setGridApi(params.api);

      // Set initial datasource
      params.api.setGridOption('datasource', createDatasource());
    },
    [createDatasource]
  );

  // Handle sort changed event
  const onSortChanged = useCallback(() => {
    if (gridApi) {
      const sortModel = gridApi.getSortModel();
      setSortModel(sortModel);

      // Refresh the datasource with new sort model
      gridApi.setGridOption(
        'datasource',
        createDatasource(searchTerm, sortModel)
      );
    }
  }, [gridApi, createDatasource, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    // Use a timer to debounce the search
    const timer = setTimeout(() => {
      if (gridApi) {
        // Refresh the grid with the new search term
        gridApi.setGridOption(
          'datasource',
          createDatasource(searchTerm, sortModel)
        );
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, gridApi, createDatasource, sortModel]);

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          rowBuffer={0}
          rowModelType={'infinite'}
          cacheBlockSize={20} // Match Rick & Morty API page size
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={100}
          maxBlocksInCache={10}
          onGridReady={onGridReady}
          onSortChanged={onSortChanged}
        />
      </Box>
    </VStack>
  );
};

export default Characters;
