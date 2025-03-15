import { Box, VStack, Link, Flex, Icon, Text } from '@chakra-ui/react';
import { Divider } from '@/components/ui/divider';
import { Avatar } from '@/components/ui/avatar';

import { FiUsers, FiTv, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const flexItemProps = {
  gap: 3,
  p: 3,
  cursor: 'pointer',
  align: 'center',
  _dark: { _hover: { bg: 'gray.900' } },
  _hover: { bg: 'gray.200' },
  fontWeight: 'medium',
  borderRadius: 'lg',
};

const boxProps = {
  bg: 'var(--chakra-colors-bg)',
  borderRight: '1px',
  borderColor: 'var(--chakra-colors-border)',
  shadow: 'sm',
  overflow: 'hidden',
  transition: 'width 0.4s ease-in-out',
  position: 'fixed',
  top: '70px',
  bottom: '0',
  zIndex: 20,
};

type SidebarProps = {
  collapsed?: boolean;
};

const menus = [
  {
    path: '/characters',
    title: 'Characters',
    icon: FiUsers,
  },
  {
    path: '/episodes',
    title: 'Episodes',
    icon: FiTv,
  },
];

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <Box
      {...boxProps}
      w={collapsed ? '0px' : 'full'}
      lg={{ w: collapsed ? '95px' : '250px', position: 'static' }}
    >
      <VStack p={5} gap={8} align="stretch" h="full">
        {/* Navigation Links */}
        <VStack gap={2} align="stretch">
          {menus.map((item) => (
            <Link
              key={item.title}
              as={RouterLink}
              //@ts-expect-error need to extend Router Link props with Chakra Link Props
              to={item.path}
              borderRadius="lg"
              bg={location.pathname === item.path ? 'blue.500' : 'transparent'}
              color={location.pathname === item.path ? 'white' : 'inherit'}
              _hover={{ bg: 'blue.400', color: 'white' }}
              transition="all 0.2s"
            >
              <Flex align="center" justify="center" gap={3} p={3}>
                <Icon as={item.icon} boxSize={7} p={1} />
                <Text hidden={collapsed}>{item.title}</Text>
              </Flex>
            </Link>
          ))}
        </VStack>

        {/* Divider */}
        <Divider />

        {/* User Info and Logout Button */}
        <Flex height={'100%'} direction="column" justifyContent={'flex-end'}>
          <Flex
            direction={'column'}
            gap={2}
            mt="auto"
            bg="gray.100"
            borderRadius="lg"
            _dark={{ bg: 'gray.800' }}
          >
            <Box>
              <Flex {...flexItemProps}>
                <Avatar
                  name={user?.username}
                  src="https://bit.ly/sage-adebayo"
                  objectFit={'cover'}
                  boxSize={7}
                />

                {!collapsed && <Text>{user?.username}</Text>}
              </Flex>
            </Box>
            <Box>
              <Flex onClick={handleLogout} {...flexItemProps}>
                <Icon as={FiLogOut} boxSize={7} p={1} />
                {!collapsed && <Text>Logout</Text>}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Sidebar;
