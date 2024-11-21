const clearTestDbAndAddTestUser = async (req) => {
  try {
    await req.post("/api/testing/reset");
    await req.post("/api/users", {
      data: {
        name: "John Doe",
        username: "jdtesting",
        password: "jdtestpwd",
      },
    });
  } catch (err) {
    console.error("Error during db setup:", err.message);
  }
};

const loginAs = async (page, username, password) => {
  await page.getByLabel("Username: ").fill(username);
  await page.getByLabel("Password: ").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const createTestBlog = async (page) => {
  await page.getByRole("button", { name: "New blog" }).click();
  await page.getByLabel("Title: ").fill("testTitle");
  await page.getByLabel("Author: ").fill("testAuthor");
  await page.getByLabel("Url: ").fill("testUrl");
  await page.getByRole("button", { name: "Create" }).click();
};

const createThreeAdditionalBlogsToTestSorting = async (page) => {
  for (let i = 1; i <= 3; i++) {
    await page.getByRole("button", { name: "New blog" }).click();
    await page.getByLabel("Title: ").fill(`title${i}`);
    await page.getByLabel("Author: ").fill(`author${i}`);
    await page.getByLabel("Url: ").fill(`url${i}`);
    await page.getByRole("button", { name: "Create" }).click();
    await page.getByText(`title${i}, by author${i}`, { exact: true }).waitFor();
  }
};

export default {
  clearTestDbAndAddTestUser,
  loginAs,
  createTestBlog,
  createThreeAdditionalBlogsToTestSorting,
};
