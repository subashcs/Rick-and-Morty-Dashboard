import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Flex h="100vh" position={'relative'}>
      <Sidebar collapsed={collapsed} />

      {/* Main Content */}
      <Flex flex={1} direction={'column'}>
        <Header onMenuToggle={handleMenuToggle} />
        <Box p={8} overflowY="auto" bg="gray.50" _dark={{ bg: 'gray.900' }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
