import { Box, Button, Flex } from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
  return (
    <Box p={4} bg="gray.100" _dark={{ bg: 'gray.800', color: 'white' }}>
      <Flex justify="space-between">
        {/* Add menu button toggler for mobile view here */}
        <Button variant="ghost">
          <FiMenu />
        </Button>
        <ColorModeButton title="Toggle Mode" />
      </Flex>
    </Box>
  );
};

export default Header;
