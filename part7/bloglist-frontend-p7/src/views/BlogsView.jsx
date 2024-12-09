import Blogs from "../components/Blogs";
import CreateFormProvider from "../context/CreateFormContext";

const BlogsView = () => {
  return (
    <CreateFormProvider>
      <Blogs />
    </CreateFormProvider>
  );
};

export default BlogsView;
