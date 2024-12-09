import { Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CreateFormContext } from "../context/CreateFormContext.jsx";
import { selectBlogsSortedByLikesDesc } from "../reducers/blogsReducer.js";
import CreateBlogForm from "./CreateBlogForm";
import { Button } from "./ui/button.jsx";

const Blogs = () => {
  const blogs = useSelector(selectBlogsSortedByLikesDesc);
  const [createFormVisible, toggleFormVisible] = useContext(CreateFormContext);

  return (
    <Box>
      <Flex mb={8} alignItems="center" justifyContent="space-between">
        {createFormVisible ? (
          <Button
            bg="red.600"
            _hover={{ bg: "red.500" }}
            onClick={toggleFormVisible}
            size="md"
          >
            Cancel
          </Button>
        ) : (
          <Button onClick={toggleFormVisible} size="md">
            New Blog
          </Button>
        )}
      </Flex>
      {createFormVisible && (
        <Box
          bg="gray.50"
          color="gray.600"
          p={6}
          borderRadius="md"
          shadow="sm"
          mb={6}
        >
          <CreateBlogForm />
        </Box>
      )}

      <Box>
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <Box
              p={4}
              mb={4}
              bg="white"
              borderRadius="md"
              shadow="sm"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Text fontSize="lg" fontWeight="bold" color="cyan.600">
                {blog.title}
              </Text>
              <Text fontSize="sm" color="gray.600">
                by {blog.author}
              </Text>
            </Box>
          </Link>
        ))}
      </Box>

      {blogs.length === 0 && (
        <Box textAlign="left" color="gray.600" py={8}>
          <Text>{`No blogs available. Click "New Blog" to create one!`}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Blogs;
