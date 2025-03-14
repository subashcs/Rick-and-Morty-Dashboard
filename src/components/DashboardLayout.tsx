import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <Flex h="100vh">
      <Sidebar />

      {/* Main Content */}
      <Box
        flex={1}
        p={8}
        overflowY="auto"
        bg="gray.50"
        _dark={{ bg: 'gray.900' }}
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
