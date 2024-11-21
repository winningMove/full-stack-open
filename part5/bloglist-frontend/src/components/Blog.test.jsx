import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const testBlogObj = {
  title: "Testz",
  author: "Authorz",
  url: "urlz",
  likes: 13,
  user: {
    id: "testuserid",
    name: "Test Name",
    username: "Test Username",
  },
};

describe("<Blog />", () => {
  let mockUpdate;

  beforeEach(() => {
    mockUpdate = vi.fn();
    render(<Blog blog={testBlogObj} handleUpdateBlog={mockUpdate} />);
  });

  it("renders title and author by default, but not url and likes", () => {
    const p = screen.getByText(
      `${testBlogObj.title}, by ${testBlogObj.author}`
    );
    expect(p).toBeDefined();
    const url = screen.queryByText("Url: ", { exact: false });
    const likes = screen.queryByText("Likes: ", { exact: false });
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  it("renders expanded view with url and likes when Show button is clicked", async () => {
    const user = userEvent.setup();
    const showButton = screen.getByText("Show");
    let url = screen.queryByText("Url: ", { exact: false });
    expect(url).toBeNull();
    await user.click(showButton);
    url = screen.queryByText(`Url: ${testBlogObj.url}`);
    expect(url).not.toBeNull();
    const likes = screen.queryByText(`Likes: ${testBlogObj.likes}`);
    expect(likes).not.toBeNull();
  });

  it("handleUpdateBlog prop gets called twice if Like button is clicked twice", async () => {
    const user = userEvent.setup();
    const showButton = screen.getByText("Show");
    await user.click(showButton);
    const likeButton = screen.getByText("Like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockUpdate.mock.calls).toHaveLength(2);
  });
});
