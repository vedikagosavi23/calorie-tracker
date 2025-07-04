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
      <Flex position="absolute" top={4} left={4} right={4} zIndex={20} justify="space-between">
        <IconButton
          bg="whiteAlpha.800"
          borderRadius="full"
          boxShadow="md"
          icon={<ArrowLeftIcon boxSize={8} />}
          onClick={() => navigate('/')}
          aria-label="Back"
          size="lg"
          w={12}
          h={12}
        />
        <Button
          bg="blue.500"
          color="white"
          onClick={() => setShowHelp(true)}
          _hover={{ bg: 'blue.600' }}
          size="lg"
          px={6}
          py={3}
          fontSize="lg"
        >
          Help
        </Button>
      </Flex>

      {/* Camera view (with aspect ratio) */}
      <Flex flex={1} w="full" justify="center" align="center" p={4}>
        <Box
          w="full"
          maxW="1000px"
          h="auto"
          aspectRatio="16/9"
          position="relative"
          overflow="hidden"
          borderRadius="xl"
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
        py={6}
        px={8}
        bg="blackAlpha.700"
        justify="space-between"
        align="center"
        zIndex={20}
        borderRadius="xl 0"
      >
        <IconButton
          bg="whiteAlpha.800"
          borderRadius="full"
          boxShadow="md"
          icon={isSwitching ? <Spinner size="md" /> : <RepeatIcon boxSize={8} />}
          onClick={toggleCamera}
          aria-label="Toggle Camera"
          isDisabled={isSwitching}
          size="lg"
          w={14}
          h={14}
        />
        <Box
          onClick={capture}
          w={20}
          h={20}
          bg="white"
          borderRadius="full"
          borderWidth={5}
          borderColor={isCapturing ? "red.400" : "gray.300"}
          boxShadow="xl"
          _hover={{ transform: 'scale(1.05)' }}
          _active={{ transform: 'scale(0.95)' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', borderColor: 'red.400' },
              '50%': { transform: 'scale(1.1)', borderColor: 'red.500' },
              '100%': { transform: 'scale(1)', borderColor: 'red.400' },
            },
          }}
          animation={isCapturing ? "pulse 0.3s" : "none"}
        />
        <Button
          bg="green.500"
          color="white"
          borderRadius="full"
          boxShadow="md"
          onClick={handleUploadClick}
          _hover={{ bg: 'green.600' }}
          size="lg"
          px={6}
          py={3}
          fontSize="lg"
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          }
        >
          Upload
        </Button>
      </Flex>

      {/* File input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/bmp,image/gif,image/tiff,image/heic"
        onChange={handleFileUpload}
        display="none"
      />
    </Flex>
  );
}
