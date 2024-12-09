import { Input, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { AlertResetContext } from "../context/AlertResetContext";
import { CreateFormContext } from "../context/CreateFormContext";
import { useField } from "../hooks";
import { alertAndReset } from "../reducers/alertReducer";
import { createBlog } from "../reducers/blogsReducer";
import { Button } from "./ui/button.jsx";
import { Field } from "./ui/field.jsx";

const CreateBlogForm = () => {
  const [title, resetTitle] = useField("title");
  const [author, resetAuthor] = useField("author");
  const [url, resetUrl] = useField("url", "url");
  const toggleFormVisible = useContext(CreateFormContext)[1];
  const alertResetRef = useContext(AlertResetContext);
  const dispatch = useDispatch();

  const addBlog = async (e) => {
    e.preventDefault();

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    };

    try {
      dispatch(createBlog(newBlog, alertResetRef));
      toggleFormVisible();
    } catch (err) {
      dispatch(alertAndReset(err.message, alertResetRef));
    }

    [resetTitle, resetAuthor, resetUrl].forEach((it) => it());
  };

  return (
    <form onSubmit={addBlog}>
      <VStack spacing={4}>
        <Field required label="Title">
          <Input placeholder="Enter a title..." {...title}></Input>
        </Field>
        <Field required label="Author">
          <Input placeholder="Enter the author..." {...author}></Input>
        </Field>
        <Field required label="URL">
          <Input placeholder="Enter blog URL..." {...url}></Input>
        </Field>
      </VStack>
      <Button
        type="submit"
        bg="cyan.600"
        size="md"
        mt={6}
        _hover={{
          bg: "cyan.500",
        }}
      >
        Create Blog
      </Button>
    </form>
  );
};

export default CreateBlogForm;
