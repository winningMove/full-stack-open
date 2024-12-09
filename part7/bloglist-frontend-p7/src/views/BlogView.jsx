import {
  Box,
  Heading,
  Highlight,
  HStack,
  Input,
  List,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import { Field } from "../components/ui/field.jsx";
import { AlertResetContext } from "../context/AlertResetContext";
import { useField } from "../hooks/index.js";
import { alertAndReset } from "../reducers/alertReducer";
import {
  addCommentToBlog,
  deleteBlog,
  selectBlogById,
  updateBlog,
} from "../reducers/blogsReducer";
import { selectUser } from "../reducers/userReducer";

const BlogView = () => {
  const { blogId } = useParams();
  const blog = useSelector((state) => selectBlogById(state, blogId));
  const loggedInUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const alertResetRef = useContext(AlertResetContext);
  const [comment, resetComment] = useField("comment");
  const navigate = useNavigate();

  const updateLikes = async () => {
    const { id, ...updatedBlog } = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };
    delete updatedBlog.comments;

    try {
      await dispatch(updateBlog(id, updatedBlog));
    } catch (err) {
      dispatch(alertAndReset(err.message, alertResetRef));
    }
  };

  const removeBlog = async () => {
    if (!confirm(`Remove blog ${blog.title}, by ${blog.author}?`)) return;

    try {
      await dispatch(deleteBlog(blog.id));
      navigate("/");
    } catch (err) {
      dispatch(alertAndReset(err.message, alertResetRef));
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = { comment: comment.value };
      await dispatch(addCommentToBlog(blog.id, newComment));
    } catch (err) {
      dispatch(alertAndReset(err.message, alertResetRef));
    } finally {
      resetComment();
    }
  };

  return (
    blog && (
      <Box
        maxW="full"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        color="gray.600"
        p={5}
        bg="gray.200"
        boxShadow="md"
        mb={4}
      >
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <VStack align="center" spacing={4}>
            <Heading
              as="h2"
              size="2xl"
              textAlign="center"
              fontWeight="bold"
              color="cyan.600"
            >
              {blog.title}
            </Heading>
            <Text
              color="blue.600"
              as="a"
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              textAlign="center"
            >
              {blog.url}
            </Text>
            <Text textAlign="center">Added by: {blog.user.name}</Text>
          </VStack>

          <VStack spacing={4} justify="center" align="center">
            <HStack justify="center">
              <Text>
                <Highlight
                  query={`${blog.likes}`}
                  styles={{
                    fontWeight: "bold",
                    fontSize: "lg",
                    color: "green.500",
                  }}
                >
                  {`${blog.likes} likes`}
                </Highlight>
              </Text>
              <Button
                bg="green.500"
                onClick={updateLikes}
                _hover={{ bg: "green.600" }}
              >
                Like
              </Button>
              <Spacer />
              {blog.user.username === loggedInUser.username && (
                <Button
                  bg="red.600"
                  onClick={removeBlog}
                  _hover={{ bg: "red.500" }}
                >
                  Remove
                </Button>
              )}
            </HStack>
          </VStack>
        </SimpleGrid>

        <Box height="2px" bg="gray.300" my={4} />

        <Heading as="h3">Comments</Heading>

        <Box as="form" onSubmit={addComment} my={4}>
          <HStack>
            <Field orientation="horizontal" label="Comment:">
              <Input
                required
                placeholder="Type a new comment here..."
                {...comment}
              ></Input>
            </Field>
            <Button type="submit">Add</Button>
          </HStack>
        </Box>

        <List.Root
          color="gray.700"
          maxH="200px"
          overflowY="auto"
          p={4}
          bg="gray.100"
          borderRadius="md"
        >
          {blog.comments.length === 0 ? (
            <Text>No comments yet!</Text>
          ) : (
            blog.comments.map((comment, i) => (
              <List.Item as="li" key={i} mb={3}>
                {comment}
              </List.Item>
            ))
          )}
        </List.Root>
      </Box>
    )
  );
};

export default BlogView;
