import { Box, Heading, Highlight, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectUserById } from "../reducers/usersReducer";

const UserView = () => {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, userId));
  return (
    user && (
      <Box color="gray.600">
        <Heading as="h2" size="lg" mb={8} textAlign="left">
          <Highlight
            query={`${user.name}`}
            styles={{ fontWeight: "bold", color: "cyan.600" }}
          >{`Blogs added by ${user.name}`}</Highlight>
        </Heading>

        <VStack spacing={4} align="stretch">
          {user.blogs.map((blog) => (
            <Link key={blog.id} to={`/blogs/${blog.id}`}>
              <Box
                p={4}
                bg="white"
                borderRadius="md"
                shadow="sm"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Text fontSize="lg" fontWeight="bold" color="cyan.600">
                  {blog.title}
                </Text>
              </Box>
            </Link>
          ))}
        </VStack>
      </Box>
    )
  );
};

export default UserView;
