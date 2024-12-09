import {
  Box,
  Container,
  Heading,
  Highlight,
  Input,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { AlertResetContext } from "../context/AlertResetContext";
import { useField } from "../hooks";
import { alertAndReset } from "../reducers/alertReducer";
import { setAuthenticatedUser } from "../reducers/userReducer";
import loginService from "../services/login.js";
import Notification from "./Notification.jsx";
import { Button } from "./ui/button.jsx";
import { Field } from "./ui/field.jsx";
import { PasswordInput } from "./ui/password-input.jsx";

const Login = () => {
  const [username, resetUsername] = useField("username");
  const [password, resetPassword] = useField("password", "password");
  const dispatch = useDispatch();
  const alertResetRef = useContext(AlertResetContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      });
      localStorage.setItem("bloglistUser", JSON.stringify(user));
      dispatch(setAuthenticatedUser(user));
    } catch (err) {
      dispatch(alertAndReset("Incorrect credentials", alertResetRef));
    }

    resetUsername();
    resetPassword();
  };

  return (
    <Container
      fluid
      minH="100vh"
      colorPalette="cyan"
      bgGradient="to-r"
      gradientFrom="gray.900"
      gradientTo="black"
    >
      <SimpleGrid columns={[1, null, 2]} minH="100vh">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          pl={[4, 8, 16]}
          pr={[4, 8, 16]}
          py={8}
          bg="gray.contrast"
          w="full"
        >
          <Box w="full" h={6} mb={12}>
            <Notification />
          </Box>
          <VStack spacing={6} align="stretch" w="full">
            <Heading as="h1" size="4xl" mb={8}>
              <Highlight
                query="Blog List"
                styles={{ fontWeight: "bold", color: "cyan.300" }}
              >
                Log in to the Blog List
              </Highlight>
            </Heading>

            <form onSubmit={onSubmit}>
              <VStack spacing={4}>
                <Field required label="Username">
                  <Input {...username}></Input>
                </Field>
                <Field required label="Password">
                  <PasswordInput {...password}></PasswordInput>
                </Field>
                <Button type="submit" mt={3} colorScheme="cyan">
                  Log in
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Login;
