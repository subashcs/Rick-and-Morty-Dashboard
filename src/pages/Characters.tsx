import { useMemo, useState, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';

import {
  ICellRendererParams,
  ValueGetterParams,
  type ColDef,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { VStack, Box } from '@chakra-ui/react';
import { Character, GetCharactersDocument } from '@/gql/graphql';
import { tableThemeDark, tableThemeLight } from '@/lib/ag-grid/theme';
import { useColorMode } from '@/components/ui/color-mode';
import PageSearchBox from '@/components/PageSearchBox';
import { debounce } from '@/utils/debounce';
import { toaster } from '@/components/ui/toaster';

// Column definitions
const columnDefs = [
  {
    headerName: 'ID',
    maxWidth: 100,
    // it is important to have node.id here, so that when the id changes (which happens
    // when the row is loaded) then the cell is refreshed.
    valueGetter: 'node.id',
    sortable: false,
    cellRenderer: (props: ICellRendererParams) => {
      if (props.value !== undefined) {
        return props.value;
      } else {
        return <img src="https://www.ag-grid.com/example-assets/loading.gif" />;
      }
    },
  },
  {
    field: 'name',
    headerName: 'Character Name',
    minWidth: 200,
    sortable: true,
    filter: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    filter: true,
  },
  {
    field: 'species',
    headerName: 'Species',
    filter: true,
  },
  {
    field: 'gender',
    headerName: 'Gender',
    filter: true,
  },
  {
    field: 'origin.name',
    headerName: 'Origin',
    minWidth: 180,
  },
  {
    headerName: 'Episodes',
    field: 'episodeCount',
    valueGetter: (params: ValueGetterParams) => params.data?.episode?.length,
    sortable: true,
    width: 120,
  },
  {
    field: 'image',
    headerName: 'Avatar',
    minWidth: 150,
    cellRenderer: ({ value, data }: ICellRendererParams) => {
      if (value) {
        return (
          <img
            src={
              value ||
              'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/' // default empty avatar
            }
            alt={data.name || 'avatar'}
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        );
      }
      return null;
    },
  },
];

const Characters = () => {
  const gridRef = useRef<AgGridReact>(null);

  const [fetchCharacters, { loading, error }] = useLazyQuery(
    GetCharactersDocument
  );
  const [allData, setAllData] = useState<Character[]>([]);
  const { colorMode } = useColorMode();
  const tableTheme = colorMode === 'light' ? tableThemeLight : tableThemeDark;

  // Fetch all characters from the API
  // Sorting, filtering is all handled client side
  useEffect(() => {
    const fetchData = async () => {
      let allResults: Character[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          //  NOTE: Currently we are using client side filter, we can pass filter variable
          //  to implement server side filtering
          const result = await fetchCharacters({
            variables: { page },
          });

          const characters =
            (result.data?.characters?.results as Character[]) || [];
          const totalCount = result.data?.characters?.info?.count || 0;

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
        onChange={debounce((e) => {
          gridRef.current?.api.setGridOption('quickFilterText', e.target.value);
        }, 500)}
        title="Characters"
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
          rowData={allData} // Pass all data to the grid
          rowBuffer={0}
          theme={tableTheme}
          loading={loading}
        />
      </Box>
    </VStack>
  );
};

export default Characters;
