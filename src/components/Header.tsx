import { Box, Button, Flex } from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import { FiMenu } from 'react-icons/fi';
import Sitemark from './Sitemark';

type HeaderProps = {
  onMenuToggle: () => void;
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <Box py={4} px={2} bg="gray.100" _dark={{ bg: 'gray.800', color: 'white' }}>
      <Flex justify="space-between">
        {/* Add menu button toggler for mobile view here */}
        <Flex alignItems="center" justifyContent="center">
          <Button variant="ghost" onClick={onMenuToggle}>
            <FiMenu />
          </Button>
          {/* Header */}
          <Sitemark />
        </Flex>
        <ColorModeButton title="Toggle Mode" />
      </Flex>
    </Box>
  );
};

export default Header;
