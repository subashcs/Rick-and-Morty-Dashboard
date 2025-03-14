import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  Box,
  Field,
  Icon,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock, FaEyeSlash, FaEye } from 'react-icons/fa';
import { toaster } from '@/components/ui/toaster';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { ColorModeButton } from '@/components/ui/color-mode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user?.isAuthenticated) {
    return <Navigate to="/characters" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username || !password) {
        throw new Error('Please enter both username and password');
      }
      await login(username, password);
      navigate('/characters');
    } catch (error) {
      setError((error as Error).message);
      toaster.create({
        title: 'Error',
        description: (error as Error).message,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
      justifyContent="center"
      alignItems="center"
    >
      <ColorModeButton position="absolute" top={4} right={4} />

      <Stack alignItems="center">
        <Box
          w={{ base: '90%', md: '400px' }}
          bg="white"
          _dark={{ bg: 'gray.800' }}
          borderRadius="xl"
          boxShadow="lg"
          p={8}
        >
          <Flex alignItems="center" justifyContent={'flex-start'} mb={2}>
            <Avatar
              variant={'solid'}
              mr={4}
              name="Rick and Morty API Dashboard"
            />
            <Heading>Rick and Morty Dashboard</Heading>
          </Flex>
          <Heading size="sm" mb={8} fontWeight={'normal'}>
            Welcome ! Login to view dashboard
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack gap="8" maxW="md">
              <Field.Root invalid={!!error} required orientation={'vertical'}>
                <Field.Label>Username</Field.Label>
                <Box position="relative" width={'full'}>
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FaUserAlt />
                  </Box>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    size="lg"
                    pl={10}
                    flex={1}
                  />
                </Box>
              </Field.Root>

              <Field.Root invalid={!!error} required>
                <Field.Label>Password</Field.Label>
                <Box position="relative" width={'full'}>
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FaLock />
                  </Box>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    size="lg"
                    pl={10}
                    pr={20}
                  />
                  <Box
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                  >
                    <Icon
                      size="sm"
                      cursor="pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Icon>
                  </Box>
                </Box>
                {error && <Field.ErrorText>{error}</Field.ErrorText>}
              </Field.Root>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                loading={isLoading}
                loadingText="Logging in..."
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
