import { Box } from '@chakra-ui/react';

export const Divider = () => (
  <Box 
    h="1px" 
    bg="gray.200" 
    _dark={{ bg: 'gray.700' }} 
    my={2} 
    w="full" 
  />
); 