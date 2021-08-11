import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  LogBox,
} from "react-native";
import { Task } from "./src/Task";
import RNPickerSelect from "react-native-picker-select";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import "react-native-gesture-handler";

// import { Task } from "./src/Task";
LogBox.ignoreLogs([
  "ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.",
]);

LogBox.ignoreLogs(["Remote debugger"]);

type TaskPriority = "low" | "medium" | "high" | undefined;

export interface ITask {
  description: string;
  priority: TaskPriority;
  isDone: boolean;
  createdAt: Date;
  id: string;
  onDrag: () => void;
  isActive: boolean;
}

const initialTasks: ITask[] = [
  {
    description: "task description",
    priority: "low",
    isDone: false,
    createdAt: new Date(),
    id: new Date().toISOString(),
    onDrag: () => {},
    isActive: false,
  },
];

export default function App() {
  const [taskText, setText] = useState("");
  const [taskItems, setTaskItems] = useState<ITask[]>(initialTasks);
  const [searchText, setSearchText] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredArray, setFilteredArray] = useState<ITask[]>(initialTasks);
  const [priority, setPriority] = useState();

  console.log(taskItems);

  const addTask = () => {
    const newTask: ITask = {
      description: taskText,
      priority: priority,
      isDone: false,
      createdAt: new Date(),
      id: new Date().toISOString(),
    };
    setTaskItems((tasksArray) => [newTask, ...tasksArray]);
    setText("");
  };

  // console.log({ taskItems });
  const handleDeleteTask = (id: ITask["id"]) => () => {
    setTaskItems((tasksArray) => tasksArray.filter((task) => task.id !== id));
  };

  const handleTaskSave = (id: ITask["id"], newDescription: string) => {
    setTaskItems((taskItems) =>
      taskItems.map((task) =>
        task.id === id ? { ...task, description: newDescription } : task
      )
    );
  };

  const filteredText = () => {
    setFilteredArray(
      taskItems.filter((text) =>
        text.description.toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setIsFiltered(true);
  };

  const onOffFiltration = () => {
    setSearchText("");
    setIsFiltered(false);
  };

  const renderItem = useCallback(
    ({ item, index, drag, isActive }: RenderItemParams<ITask>) => {
      return (
        <Task
          description={item.description}
          onDeletePress={handleDeleteTask(item.id)}
          onTaskSave={handleTaskSave}
          id={item.id}
          priority={item.priority}
          onDrag={drag}
          isActive={isActive}
        />
      );
    },
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <View style={styles.container}> */}
        <Text>Todays tasks</Text>
        {/* NEW TASK INPPUT + BUTTON */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={taskText}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.button} onPress={addTask}>
            <View>
              <Text>+</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* END - NEW TASK INPPUT + BUTTON */}

        <View style={styles.search}>
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
          />
          {isFiltered ? (
            <TouchableOpacity style={styles.button} onPress={onOffFiltration}>
              <View>
                <Text>x</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={filteredText}>
              <View>
                <Text style={{ fontSize: 10 }}>search</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View>
          <RNPickerSelect
            onValueChange={(priority) => setPriority(priority)}
            items={[
              { label: "low", value: "low" },
              { label: "medium", value: "medium" },
              { label: "high", value: "high" },
            ]}
          />
        </View>

        {/* <FlatList
          data={isFiltered ? filteredArray : taskItems}
          renderItem={({ item: task }) => (
            <Task
              description={task.description}
              onDeletePress={handleDeleteTask(task.id)}
              onTaskSave={handleTaskSave}
              id={task.id}
            />
          )}
        /> */}
        <DraggableFlatList
          data={taskItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data }) => setTaskItems(data)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  input: {
    borderWidth: 1,
    width: 300,
    height: 40,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: 40,
  },
  inputContainer: {
    flexDirection: "row",
  },
  search: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 200,
    height: 220,
  },
});
