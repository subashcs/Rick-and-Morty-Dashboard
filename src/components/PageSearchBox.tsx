import { Box, Heading, HStack, Input, VStack, Field } from '@chakra-ui/react';
import { ChangeEventHandler } from 'react';

type PageSearchBoxProps = {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  title: string;
};

const PageSearchBox = ({ onChange, title }: PageSearchBoxProps) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      shadow="sm"
      _dark={{ bg: 'gray.800' }}
    >
      <VStack gap={6} align="stretch">
        <Heading size="lg" color="blue.500">
          {title}
        </Heading>

        <HStack gap={4} wrap="wrap">
          <Field.Root orientation={'horizontal'}>
            <Field.Label>Search</Field.Label>
            <Input
              placeholder="Search by name..."
              onChange={onChange}
              bg="white"
              _dark={{ bg: 'gray.700' }}
              flex={1}
            />
          </Field.Root>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PageSearchBox;
