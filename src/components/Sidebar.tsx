// Sidebar.tsx
import { Box, VStack, Heading, Link, Flex, Icon, Text } from '@chakra-ui/react';
import { Divider } from '@/components/ui/divider';
import { Avatar } from '@/components/ui/avatar';

import { FiUsers, FiTv, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const flexItemProps = {
  p: 3,
  cursor: 'pointer',
  _dark: { _hover: { bg: 'gray.900' } },
  _hover: { bg: 'gray.200' },
  fontWeight: 'medium',
  align: 'center',
  borderRadius: 'lg',
};

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <Box
      w="250px"
      bg="var(--chakra-colors-bg-surface)"
      borderRight="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      p={5}
      shadow="sm"
    >
      <VStack gap={8} align="stretch" h="full">
        {/* Header */}
        <Heading size="md" color="blue.500">
          Rick & Morty Dashboard
        </Heading>

        {/* Navigation Links */}
        <VStack gap={2} align="stretch">
          <Link
            as={RouterLink}
            to="/characters"
            p={3}
            borderRadius="lg"
            bg={
              location.pathname === '/characters' ? 'blue.500' : 'transparent'
            }
            color={location.pathname === '/characters' ? 'white' : 'inherit'}
            _hover={{ bg: 'blue.400', color: 'white' }}
            transition="all 0.2s"
          >
            <Flex align="center" gap={3}>
              <Icon as={FiUsers} boxSize={5} />
              Characters
            </Flex>
          </Link>

          <Link
            as={RouterLink}
            to="/episodes"
            p={3}
            borderRadius="lg"
            bg={location.pathname === '/episodes' ? 'blue.500' : 'transparent'}
            color={location.pathname === '/episodes' ? 'white' : 'inherit'}
            _hover={{ bg: 'blue.400', color: 'white' }}
            transition="all 0.2s"
          >
            <Flex align="center" gap={3}>
              <Icon as={FiTv} boxSize={5} />
              Episodes
            </Flex>
          </Link>
        </VStack>

        {/* Divider */}
        <Divider />

        {/* User Info and Logout Button */}
        <Flex height={'100%'} direction="column" justifyContent={'flex-end'}>
          <Flex
            direction={'column'}
            gap={2}
            p={2}
            mt="auto"
            bg="gray.100"
            borderRadius="lg"
            _dark={{ bg: 'gray.800' }}
          >
            <Flex {...flexItemProps}>
              <Avatar
                size={'xs'}
                name={user?.username}
                src="https://bit.ly/sage-adebayo"
                mr={2}
              />
              <Text>{user?.username}</Text>
            </Flex>
            <Flex onClick={handleLogout} {...flexItemProps}>
              <FiLogOut />
              <Text ml={2}>Logout</Text>
            </Flex>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Sidebar;
