import React from "react";
import {
  Flex,
  ListItem,
  Text,
  Button,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { Todo } from "./todos";
import { MdDelete, MdEdit } from "react-icons/md";
import { on } from "events";

interface ITodoItemProps {
  item: Todo;
  index: number;
  isSelected: boolean;
  onMarkAsCompleteClicked: (item: Todo) => void;
  onDeleteClicked: (id: string, e: any) => void;
  onEditClicked: (item: Todo, e: any) => void;
}

const TodoItem = (props: ITodoItemProps) => {
  return (
    <ListItem>
      <Flex
        key={props.item.id}
        w="100%"
        p={5}
        my={2}
        align="center"
        borderRadius={5}
        justifyContent="space-between"
        // backgroundColor={"white"}
      >
        <Flex align="center">
          <Text fontSize="x1" mr={4}>
            {props.index + 1}.
          </Text>
          <Flex flexDirection="column">
            <Text
              textDecoration={!props.item.isComplete ? "none" : "line-through"}
              fontWeight={props.item.isComplete ? "normal" : "bold"}
            >
              {props.item.todo}
            </Text>
            <Text style={{ color: "gray" }}>
              {new Date(props.item.createdAt).toLocaleDateString("default", {
                month: "short",
                year: "numeric",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Flex>
        </Flex>
        {/* {!props.item.isComplete ? (
          <Button bgColor={"blue.100"} onClick={props.onMarkAsCompletePressed}>
            {"Mark as complete"}
          </Button>
        ) : (
          <Text>Completed!</Text>
        )} */}
        <ButtonGroup>
          {!props.isSelected && (
            <Button
              onClick={(e) => props.onDeleteClicked(props.item.id, e)}
              leftIcon={<MdDelete />}
              variant="solid"
              colorScheme="red"
            >
              Delete
            </Button>
          )}
          <Button
            onClick={(e) => props.onEditClicked(props.item, e)}
            leftIcon={!props.isSelected ? <MdEdit /> : <div />}
            variant="outline"
            colorScheme="blue"
          >
            {props.isSelected ? "Editing..." : "Edit"}
          </Button>
          {!props.isSelected && (
            <Button
              onClick={() => props.onMarkAsCompleteClicked(props.item)}
              variant={props.item.isComplete ? "solid" : "outline"}
              colorScheme="green"
            >
              {props.item.isComplete
                ? "Mark as Incomplete"
                : "Mark as complete"}
            </Button>
          )}
        </ButtonGroup>
      </Flex>
    </ListItem>
  );
};

export default TodoItem;
