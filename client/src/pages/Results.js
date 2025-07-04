import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Flex, Image, Text, Spinner, Alert, AlertIcon, IconButton, VStack, Code, Heading, Badge, HStack, Divider } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = React.useState([]);
  const [rawText, setRawText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const image = location.state?.image;

  React.useEffect(() => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setRawText('');
    console.log('🚀 Sending image to backend for Gemini analysis...');
    console.log('About to send image to backend:', image);
    axios.post('/api/analyze-image', { image })
      .then(res => {
        // Try to parse Gemini's response
        const gemini = res.data.gemini;
        let text = '';
        if (gemini && gemini.candidates && gemini.candidates[0]?.content?.parts) {
          text = gemini.candidates[0].content.parts.map(p => p.text).join('\n');
        } else {
          text = JSON.stringify(gemini, null, 2);
        }
        setRawText(text);
        // Try to extract JSON from Gemini's response
        let match = text.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed)) {
              setResults(parsed);
            } else {
              setResults([parsed]);
            }
          } catch (e) {
            // Not valid JSON, just show raw text
            setResults([]);
          }
        }
      })
      .catch(err => {
        setError('Failed to analyze image. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [image]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'green';
    if (confidence >= 0.6) return 'yellow';
    return 'red';
  };

  const getFoodIcon = (foodName) => {
    const name = foodName.toLowerCase();
    if (name.includes('apple') || name.includes('fruit')) return '🍎';
    if (name.includes('pizza') || name.includes('bread')) return '🍕';
    if (name.includes('burger') || name.includes('sandwich')) return '🍔';
    if (name.includes('salad') || name.includes('vegetable')) return '🥗';
    if (name.includes('rice') || name.includes('pasta')) return '🍚';
    if (name.includes('meat') || name.includes('chicken') || name.includes('beef')) return '🥩';
    if (name.includes('fish') || name.includes('salmon')) return '🐟';
    if (name.includes('cake') || name.includes('dessert')) return '🍰';
    if (name.includes('coffee') || name.includes('drink')) return '☕';
    return '🍽️';
  };

  return (
    <Flex minH="100vh" bg="gray.50" direction="column" align="center" py={8}>
      <IconButton
        alignSelf="flex-start"
        ml={4}
        mb={4}
        bg="whiteAlpha.800"
        borderRadius="full"
        boxShadow="md"
        icon={<AddIcon boxSize={6} />}
        onClick={() => navigate('/camera')}
        aria-label="Rescan"
      />
      {image && (
        <Image src={image} alt="Captured" boxSize="10rem" objectFit="cover" borderRadius="lg" shadow="md" mb={6} />
      )}
      {loading && <Spinner color="blue.600" size="lg" thickness="4px" label="Analyzing..." mb={4} />}
      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          <Text fontWeight="semibold">{error}</Text>
        </Alert>
      )}
      <VStack w="full" maxW="2xl" spacing={4}>
        {results.length > 0 ? (
          <>
            <Heading size="lg" color="gray.800" mb={4}>
              🍎 Food Analysis Results
            </Heading>
            <Box bg="white" borderRadius="xl" shadow="lg" p={6} w="full">
              <VStack spacing={4} align="stretch">
                {results.map((item, idx) => (
                  <Box key={idx}>
                    <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="lg">
                      <HStack spacing={3}>
                        <Text fontSize="2xl">{getFoodIcon(item.food || item.name || item.label)}</Text>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" fontSize="lg" color="gray.800">
                            {item.food || item.name || item.label || 'Food Item'}
                          </Text>
                          {item.estimated_calories && (
                            <Text color="blue.600" fontWeight="semibold" fontSize="xl">
                              {item.estimated_calories} kcal
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                      {item.confidence && (
                        <Badge 
                          colorScheme={getConfidenceColor(item.confidence)}
                          fontSize="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {Math.round(item.confidence * 100)}% confidence
                        </Badge>
                      )}
                    </Flex>
                    {idx < results.length - 1 && <Divider my={2} />}
                  </Box>
                ))}
              </VStack>
            </Box>
          </>
        ) : (
          rawText && (
            <Box bg="white" borderRadius="xl" shadow="lg" p={6} w="full">
              <Heading size="md" mb={4} color="gray.800">
                🤖 Gemini Response
              </Heading>
              <Code 
                whiteSpace="pre-wrap" 
                w="full" 
                p={4} 
                borderRadius="md" 
                bg="gray.100"
                fontSize="sm"
              >
                {rawText}
              </Code>
            </Box>
          )
        )}
      </VStack>
    </Flex>
  );
}
