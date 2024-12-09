import {
  Box,
  Flex,
  Heading,
  Highlight,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import Notification from "../components/Notification";
import { Button } from "../components/ui/button";
import { resetUser, selectUser } from "../reducers/userReducer";

const Home = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetUser());
    localStorage.removeItem("bloglistUser");
  };

  return (
    <Box
      minH="100vh"
      bgGradient="to-r"
      gradientFrom="gray.700"
      gradientTo="gray.800"
      colorPalette="cyan"
    >
      <Flex
        as="header"
        bg="cyan.600"
        color="white"
        px={8}
        py={4}
        align="center"
        shadow="md"
      >
        <HStack gap={6}>
          <Link to="blogs">
            <Box
              _hover={{
                bg: "cyan.700",
                transform: "translateY(-2px)",
                transition: "all 0.3s ease-in-out",
              }}
              borderRadius="md"
              p={2}
            >
              <Text fontWeight="bold" fontSize="lg">
                Blogs
              </Text>
            </Box>
          </Link>
          <Link to="users">
            <Box
              _hover={{
                bg: "cyan.700",
                transform: "translateY(-2px)",
                transition: "all 0.3s ease-in-out",
              }}
              borderRadius="md"
              p={2}
            >
              <Text fontWeight="bold" fontSize="lg">
                Users
              </Text>
            </Box>
          </Link>
        </HStack>
        <Spacer />
        <HStack spacing={4}>
          <Text>
            <Highlight
              query={user.name}
              styles={{ fontWeight: "bold", color: "cyan.200" }}
            >
              {`Logged in as ${user.name}`}
            </Highlight>
          </Text>
          <Button
            size="md"
            bg="red.600"
            color="white"
            onClick={handleLogout}
            variant="solid"
            _hover={{
              bg: "red.500",
            }}
          >
            Log out
          </Button>
        </HStack>
      </Flex>

      <Box as="main" px={8} py={6}>
        <Box h={6} mb={12} maxW="50%">
          <Notification />
        </Box>

        <Heading
          as="h1"
          size="6xl"
          mb={6}
          textAlign="left"
          borderBottom="2px solid"
          borderColor="cyan.600"
          pb={2}
        >
          Blog List
        </Heading>

        <Box
          bg="gray.100"
          borderRadius="md"
          p={10}
          shadow="md"
          minH="60vh"
          maxW="50%"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
