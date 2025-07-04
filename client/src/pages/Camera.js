import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, RepeatIcon } from '@chakra-ui/icons';

export default function Camera() {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const capture = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        navigate('/results', { state: { image: imageSrc } });
      }
      setIsCapturing(false);
    }, 300);
  }, [webcamRef, navigate]);

  const toggleCamera = () => {
    setIsSwitching(true);
    setTimeout(() => {
      setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
      setIsSwitching(false);
    }, 500);
  };

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
    <Flex position="relative" w="full" h="100vh" bg="black" direction="column">
      {/* Flash effect */}
      {isCapturing && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bg="white"
          opacity={0.7}
          zIndex={15}
          animation="flash 0.3s"
          sx={{
            '@keyframes flash': {
              '0%': { opacity: 0 },
              '50%': { opacity: 0.7 },
              '100%': { opacity: 0 },
            },
          }}
        />
      )}

      {/* Help overlay */}
      {showHelp && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bg="blackAlpha.700"
          zIndex={25}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={4}
          onClick={() => setShowHelp(false)}
        >
          <Box bg="white" p={6} borderRadius="xl" maxW="md" textAlign="center">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              📸 Camera Tips
            </Text>
            <Text mb={2}>• Center your food in the frame</Text>
            <Text mb={2}>• Use good lighting for best results</Text>
            <Text mb={2}>• Avoid shadows on your food</Text>
            <Text mb={4}>• Capture from directly above</Text>
            <Button colorScheme="blue" onClick={() => setShowHelp(false)}>
              Got it!
            </Button>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <Flex position="absolute" top={4} left={4} right={4} zIndex={20} justify="space-between" px={{ base: 2, md: 4 }}>
        <IconButton
          bg="whiteAlpha.800"
          borderRadius="full"
          boxShadow="md"
          icon={<ArrowLeftIcon boxSize={{ base: 6, md: 8 }} />}
          onClick={() => navigate('/')} 
          aria-label="Back"
          size={{ base: 'md', md: 'lg' }}
          w={{ base: 10, md: 12 }}
          h={{ base: 10, md: 12 }}
        />
        <Button
          bg="blue.500"
          color="white"
          onClick={() => setShowHelp(true)}
          _hover={{ bg: 'blue.600' }}
          size={{ base: 'md', md: 'lg' }}
          px={{ base: 3, md: 6 }}
          py={{ base: 2, md: 3 }}
          fontSize={{ base: 'md', md: 'lg' }}
        >
          Help
        </Button>
      </Flex>

      {/* Camera view (with aspect ratio) */}
      <Flex flex={1} w="full" justify="center" align="center" p={{ base: 1, md: 4 }}>
        <Box
          w="full"
          maxW={{ base: '100vw', md: '1000px' }}
          h="auto"
          aspectRatio={{ base: '4/3', md: '16/9' }}
          position="relative"
          overflow="hidden"
          borderRadius={{ base: 'md', md: 'xl' }}
          boxShadow="xl"
        >
          {isSwitching ? (
            <Flex
              w="full"
              h="full"
              justify="center"
              align="center"
              bg="black"
            >
              <Spinner size="xl" color="white" />
            </Flex>
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          {/* Grid overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            pointerEvents="none"
            zIndex={10}
            backgroundImage="linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)"
            backgroundSize="25% 25%"
          />
        </Box>
      </Flex>

      {/* Controls bar (translucent black) */}
      <Flex
        position="absolute"
        bottom={0}
        left={0}
        w="full"
        py={{ base: 3, md: 6 }}
        px={{ base: 2, md: 8 }}
        bg="blackAlpha.700"
        justify="space-between"
        align="center"
        zIndex={20}
        borderRadius={{ base: 'none', md: 'xl 0' }}
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 2, md: 0 }}
      >
        <IconButton
          bg="whiteAlpha.800"
          borderRadius="full"
          boxShadow="md"
          icon={isSwitching ? <Spinner size="md" /> : <RepeatIcon boxSize={{ base: 6, md: 8 }} />}
          onClick={toggleCamera}
          aria-label="Toggle Camera"
          size={{ base: 'md', md: 'lg' }}
          w={{ base: 10, md: 12 }}
          h={{ base: 10, md: 12 }}
        />
        <Button
          colorScheme="blue"
          onClick={capture}
          isLoading={isCapturing}
          size={{ base: 'md', md: 'lg' }}
          px={{ base: 4, md: 8 }}
          py={{ base: 2, md: 4 }}
          fontSize={{ base: 'lg', md: '2xl' }}
          borderRadius="full"
        >
          Capture
        </Button>
        <Button
          colorScheme="gray"
          onClick={handleUploadClick}
          size={{ base: 'sm', md: 'md' }}
          px={{ base: 2, md: 4 }}
          py={{ base: 1, md: 2 }}
          fontSize={{ base: 'sm', md: 'md' }}
          borderRadius="full"
        >
          Upload
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          display="none"
          onChange={handleFileUpload}
        />
      </Flex>
    </Flex>
  );
}
