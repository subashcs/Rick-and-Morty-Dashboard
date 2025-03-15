'use client';

import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: ' Inter, Helvetica' },
        body: { value: ' Inter, Helvetica' },
      },
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
