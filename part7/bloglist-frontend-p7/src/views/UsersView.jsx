import { Box, Heading, Table, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUsers } from "../reducers/usersReducer";

const UsersView = () => {
  const users = useSelector(selectUsers);
  return (
    <Box color="cyan.600">
      <Heading as="h3" fontSize="4xl" fontWeight="bold" mb={8} textAlign="left">
        Users
      </Heading>

      <Box
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        shadow="sm"
        bg="white"
      >
        <Table.Root variant="simple" size="md">
          <Table.Header bg="cyan.400">
            <Table.Row>
              <Table.ColumnHeader
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
              >
                User
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
              >
                Blogs created
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map((user) => (
              <Table.Row
                key={user.id}
                _hover={{ bg: "gray.200", transform: "translateY(-2px)" }}
                transition="all 0.2s ease-in-out"
              >
                <Table.Cell>
                  <Link to={`/users/${user.id}`}>
                    <Text fontSize="sm" fontWeight="bold" color="cyan.600">
                      {user.name}
                    </Text>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    {user.blogs.length}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default UsersView;
