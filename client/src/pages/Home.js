import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Text, VStack, Input } from '@chakra-ui/react';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        navigate('/results', { state: { image: imageData } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="space-between"
      bgImage="url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')"
      bgSize="cover"
      bgPosition="center"
    >
      {/* Semi-transparent header */}
      <Box as="header" textAlign="center" py={8} bg="rgba(255,255,255,0.8)">
        <Heading as="h1" size="2xl" color="green.700" mb={2}>
          Food Calorie Manager
        </Heading>
        <Text fontSize="lg" color="gray.700" maxW="2xl" mx="auto">
          Discover your food's nutritional value in seconds
        </Text>
      </Box>

      {/* Main content area */}
      <Flex as="main" flex={1} direction="column" align="center" justify="center">
        {/* Action card */}
        <Box
          bg="rgba(255,255,255,0.95)"
          p={8}
          rounded="2xl"
          boxShadow="2xl"
          maxW="md"
          w="full"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Button
              onClick={() => navigate('/camera')}
              colorScheme="blue"
              borderRadius="full"
              w="10rem"
              h="10rem"
              boxShadow="lg"
              _hover={{ bg: 'blue.700' }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box as="span" mb={2}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2.25 2.25 0 012.25-2.25h2.379a1.5 1.5 0 001.06-.44l.94-.94A1.5 1.5 0 0111.44 2.25h1.12a1.5 1.5 0 011.06.44l.94.94A1.5 1.5 0 001.06.44h2.38A2.25 2.25 0 0121 6v1.5M3 7.5h18M3 7.5v10.125A2.625 2.625 0 005.625 20.25h12.75A2.625 2.625 0 0021 17.625V7.5M3 7.5l1.125 10.125A2.625 2.625 0 006.75 20.25h10.5a2.625 2.625 0 002.625-2.625L21 7.5" />
                </svg>
              </Box>
              <Text fontSize="lg" fontWeight="semibold">Take Picture</Text>
            </Button>
            
            <Text color="gray.600" fontSize="lg">OR</Text>
            
            <Button
              onClick={handleUploadClick}
              colorScheme="green"
              size="lg"
              w="full"
              maxW="16rem"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              }
            >
              Upload Image
            </Button>
            
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/bmp,image/gif,image/tiff,image/heic"
              onChange={handleFileUpload}
              display="none"
            />
          </VStack>
        </Box>

        {/* Calorie info card */}
        <Box
          mt={10}
          bg="rgba(255,255,255,0.92)"
          p={6}
          rounded="xl"
          boxShadow="md"
          maxW="lg"
          w="2000px"
          textAlign="left"
        >
          <Heading as="h2" size="md" color="green.700" mb={3}>
            Why Calories Matter
          </Heading>
          <Text color="gray.700" mb={3}>
            Calories are units of energy that fuel your body. Tracking them helps you:
          </Text>
          <VStack align="start" spacing={1} mb={3}>
            <Text>• Maintain a healthy weight</Text>
            <Text>• Make informed food choices</Text>
            <Text>• Understand portion sizes</Text>
            <Text>• Achieve fitness goals</Text>
          </VStack>
          <Text color="gray.700" fontWeight="medium">
            Most adults need 2,000–2,500 calories daily. Your needs depend on age, activity, and health goals.
          </Text>
        </Box>
      </Flex>

      {/* Enhanced footer */}
      <Box as="footer" textAlign="center" py={4} color="gray.600" fontSize="sm" bg="rgba(255,255,255,0.8)">
        Eat smart, live healthy. Powered by AI food recognition.
      </Box>
    </Flex>
  );
}
