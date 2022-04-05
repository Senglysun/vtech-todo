import React, {
  Fragment,
  LegacyRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Flex,
  Heading,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Text,
  Divider,
  List,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import TodoItem from "./todoItem";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { Firestore, serverTimestamp } from "firebase/firestore";

export interface Todo {
  id: string;
  todo: string;
  isComplete: boolean;
  createdAt: any;
}

const Todos = () => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Array<Todo> | undefined>(undefined);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    fetchTodo();
  }, []);

  useEffect(() => {
    const checkIfClickOutside = (e: any) => {
      if (!inputAreaRef.current?.contains(e.target)) {
        setInput("");
        setSelectedTodo(undefined);
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   window.addEventListener("offline", (e) => {
  //     alert("Todo app is offline!");
  //   });
  // });

  const fetchTodo = async () => {
    try {
      const response = await axios("/api/todo");
      const data = response.data as Array<Todo>;
      setTodos(data);
    } catch (error) {
      alert(`Something went wrong! ${error}`);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      if (input != "") {
        event.stopPropagation();
        onAddTodo();
      } else {
        alert("Please input something!");
      }
    }
  };

  const onAddTodo = async () => {
    if (input != "" && input.trim()) {
      const existedTodo = todos?.find((t) => t.todo === input);
      if (!existedTodo) {
        if (!selectedTodo) {
          try {
            const response = await axios.post("/api/todo", {
              todo: input,
            });
            if (response.data.response === "success") {
              var timestamp = new Date();
              // alert(`${input} is added successfully!`);
              setTodos((prev) => [
                {
                  id: "",
                  todo: input,
                  isComplete: false,
                  createdAt: timestamp,
                },
                ...prev,
              ]);
              setInput("");
            }
          } catch (error) {
            alert(`Error ${error}`);
          }
        } else {
          try {
            const response = await axios.put(`/api/todo/${selectedTodo.id}`, {
              ...selectedTodo,
              todo: input,
            });
            if (response.data.response === "success") {
              var newTodos = todos ? [...todos] : [];
              var timestamp = new Date();
              todos?.map((todo, index) => {
                if (todo.id === selectedTodo.id) {
                  newTodos[index] = {
                    ...selectedTodo,
                    todo: input,
                    createdAt: timestamp,
                  };
                }
              });
              setTodos(newTodos);
              // alert(`Todo id "${selectedTodo.id}" is updated successfully!`);
              setSelectedTodo(undefined);
              setInput("");
            }
          } catch (error) {
            alert(`Error ${error}`);
          }
        }
      } else {
        alert("This todo is already in the list!");
      }
    } else {
      alert("Please input something!");
    }
  };

  const onDeleteClicked = async (id: string, e: any) => {
    try {
      e.stopPropagation();
      const response = await axios.delete(`/api/todo/${id}`);
      if (response.data.response === "success") {
        setTodos(todos?.filter((item) => item.id !== id));
        // alert(`Todo id "${id}" is deleted successfully!`);
      }
    } catch (error) {
      alert(`Something went wrong! ${error}`);
    }
  };

  const onEditClicked = async (item: Todo, e: any) => {
    try {
      e.stopPropagation();
      setSelectedTodo(item);
      setInput(item.todo);
    } catch (error) {
      alert(`Something went wrong! ${error}`);
    }
  };

  const onMarkAsCompleteClicked = async (item: Todo) => {
    var newTodos = todos ? [...todos] : [];
    todos?.map((todo, index) => {
      if (todo.id === item.id) {
        newTodos[index] = {
          id: item.id,
          todo: item.todo,
          isComplete: !item.isComplete,
          createdAt: item.createdAt,
        };
      }
    });
    setTodos(newTodos);
    try {
      const response = await axios.patch(`/api/todo/${item.id}`, {
        ...item,
        isComplete: !item.isComplete,
      });
      if (response.data.response === "success") {
        // alert(
        //   `Todo id ${item.todo} is mark to ${
        //     item.isComplete ? "incomplete" : "completed"
        //   } successfully!`
        // );
        setInput("");
        setSelectedTodo(undefined);
      }
    } catch (error) {
      alert(`Erorr ${error}`);
    }
  };

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    setInput(e.target.value);
  };

  return (
    <Flex
      flexDir="column"
      maxW={800}
      align="center"
      justify="center"
      minH="100vh"
      m="auto"
      px={4}
      ref={inputAreaRef}
    >
      <Flex justify="space-between" w="100%" align="center">
        <Heading mb={4}>Todo App!</Heading>
        {/* <Button
          onClick={onSearchPressed}
          colorScheme={isSearching ? "gray" : "blue"}
          leftIcon={<MdSearch />}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button> */}
      </Flex>
      <InputGroup>
        <InputLeftElement
          children={
            isSearching ? (
              <MdSearch color="gray.300" />
            ) : (
              <AddIcon color="gray.300" />
            )
          }
        />
        <Input
          type="text"
          placeholder={isSearching ? "Search todo" : "New todo"}
          value={input}
          onKeyDown={onKeyDown}
          onChange={(e) => onTextChanged(e)}
        />
        {!isSearching && (
          <Button ml="2" onClick={onAddTodo}>
            {!selectedTodo ? "Add Todo" : "Edit"}
          </Button>
        )}
      </InputGroup>
      {todos && todos?.length > 0 ? (
        <List w="100%">
          {todos
            .filter((val) => {
              if (!isSearching) {
                return val;
              } else {
                if (input == "") {
                  return val;
                } else if (
                  val.todo.toLowerCase().includes(input.toLowerCase())
                ) {
                  return val;
                }
              }
            })
            .map((t, i) => {
              return (
                <Fragment key={i}>
                  {i > 0 && <Divider />}
                  <TodoItem
                    key={t.id}
                    item={t}
                    index={i}
                    isSelected={selectedTodo?.id === t.id}
                    onMarkAsCompleteClicked={onMarkAsCompleteClicked}
                    onDeleteClicked={onDeleteClicked}
                    onEditClicked={onEditClicked}
                  />
                </Fragment>
              );
            })}
        </List>
      ) : (
        <Text>{"No todo"}</Text>
      )}
    </Flex>
  );
};

export default Todos;
