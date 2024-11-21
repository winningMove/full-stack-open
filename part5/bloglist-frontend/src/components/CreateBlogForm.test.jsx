import CreateBlogForm from "./CreateBlogForm";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

describe("<CreateBlogForm />", () => {
  let mockCreate, container;

  beforeEach(() => {
    mockCreate = vi.fn();
    container = render(
      <CreateBlogForm handleCreateBlog={mockCreate} />
    ).container;
  });

  it("calls onSubmit handler with correct data", async () => {
    const user = userEvent.setup();
    const createButton = screen.getByText("Create");
    const inputElements = ["title", "author", "url"].map((v) =>
      container.querySelector(`#${v}`)
    );
    for (const el of inputElements) {
      await user.type(el, `test ${el.id}`);
    }
    await user.click(createButton);
    expect(mockCreate.mock.calls).toHaveLength(1);
    expect(mockCreate).toHaveBeenCalledWith({
      title: "test title",
      author: "test author",
      url: "test url",
    });
  });
});
