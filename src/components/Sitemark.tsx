import { Flex, Heading } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

const Sitemark = () => {
  return (
    <Flex alignItems="center" justifyContent={'flex-start'}>
      <Avatar
        variant={'solid'}
        src="/favicon.ico"
        mr={2}
        name="Rick and Morty API Dashboard"
        boxSize={6}
        bg={'transparent'}
        lg={{ boxSize: 8 }}
      />
      <Heading
        size="md"
        lg={{ fontSize: 'lg' }}
        color="gray.800"
        _dark={{ color: 'gray.100' }}
      >
        R & M Dashboard
      </Heading>
    </Flex>
  );
};

export default Sitemark;
