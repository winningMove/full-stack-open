import { test, expect } from "@playwright/test";
import helper from "./helper.js";

test.describe("Blog list app", () => {
  test.beforeEach(async ({ page, request }) => {
    await helper.clearTestDbAndAddTestUser(request);
    await page.goto("/");
  });

  test("Login form is shown by default", async ({ page }) => {
    await expect(page.getByText("Login")).toBeVisible();
    await expect(page.getByLabel("Username: ")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test.describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await helper.loginAs(page, "jdtesting", "jdtestpwd");
      await expect(page.getByText("Logged in as John Doe")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await helper.loginAs(page, "incorrectusername", "incorrectpwd");
      await expect(page.getByText("Incorrect credentials")).toBeVisible();
      await expect(page.getByText("Logged in as John Doe")).not.toBeVisible();
    });
  });

  test.describe("When logged in", () => {
    test.beforeEach(async ({ page }) => {
      await helper.loginAs(page, "jdtesting", "jdtestpwd");
      await helper.createTestBlog(page);
    });

    test("a new blog can be created", async ({ page }) => {
      await expect(page.getByText("Create a new blog")).not.toBeVisible();
      await expect(
        page.getByText("testTitle, by testAuthor", { exact: true })
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Show" })).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "Show" }).click();
      const likes = page.getByText("Likes: ");
      await expect(likes).toContainText("0");
      await page.getByRole("button", { name: "Like" }).click();
      await expect(likes).toContainText("1");
    });

    test("a blog can be deleted by the user who made it", async ({ page }) => {
      await page.getByRole("button", { name: "Show" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Remove" }).click();
      await expect(
        page.getByText("testTitle, by testAuthor", { exact: true })
      ).not.toBeVisible();
    });

    test("button to remove blog does not show for user who didn't create that blog", async ({
      page,
      request,
    }) => {
      await page.getByRole("button", { name: "Log out" }).click();
      await request.post("/api/users", {
        data: {
          name: "Temp Tempy",
          username: "tttesting",
          password: "tttestpwd",
        },
      });
      await helper.loginAs(page, "tttesting", "tttestpwd");
      await page.getByRole("button", { name: "Show" }).click();

      await expect(
        page.getByRole("button", { name: "Remove" })
      ).not.toBeVisible();
    });

    test("blogs are sorted according to likes in descending order", async ({
      page,
    }) => {
      await helper.createThreeAdditionalBlogsToTestSorting(page);
      const blogDivs = page.getByTestId("blog-div");
      await expect(blogDivs).toHaveCount(4);
      // last added blog should be at bottom of list to start
      const lastBlog = blogDivs.nth(3);
      await expect(lastBlog).toContainText("title3");
      await lastBlog.getByRole("button", { name: "Show" }).click();
      await lastBlog.getByRole("button", { name: "Like" }).click();
      // after getting 1 like, the last added blog should now be at top of list
      await expect(blogDivs.nth(0)).toContainText("title3");

      const secondAddedBlog = blogDivs
        .getByText("title2, by author2", { exact: true })
        .locator("..");
      await secondAddedBlog.getByRole("button", { name: "Show" }).click();
      const secondAddedBlogLike = secondAddedBlog.getByRole("button", {
        name: "Like",
      });
      await secondAddedBlogLike.click();
      await secondAddedBlogLike.click();

      // after getting 2 likes, second added blog should now be at top of list
      await expect(blogDivs.nth(0)).toContainText("title2");
      // the blog with 1 like should now be second on list
      await expect(blogDivs.nth(1)).toContainText("title3");
    });
  });
});
