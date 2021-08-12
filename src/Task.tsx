import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ITask } from "../App";
import Checkbox from "react-native-checkbox-animated";

const windowWidth = Dimensions.get("window").width;

interface Props {
  id: ITask["id"];
  description: string;
  priority: "low" | "medium" | "high";
  onDeletePress: () => void;
  onTaskSave: (id: ITask["id"], newDescription: string) => void;
  isActive: boolean;
  onDrag: () => void;
}

export const Task = ({
  description,
  onDeletePress,
  onTaskSave,
  id,
  isActive,
  onDrag,
}: Props) => {
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [checked, setChecked] = useState(false);

  return (
    <TouchableOpacity
      onLongPress={onDrag}
      style={{
        ...styles.container,
        backgroundColor: isActive ? "red" : "#11F323",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Checkbox
          label=""
          onValueChange={() => setChecked(!checked)}
          checked={checked}
        />
        {isEdited ? (
          <TextInput
            value={newDescription}
            onChangeText={setNewDescription}
            style={{ backgroundColor: "white" }}
          />
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}

        {/* <Text style={styles.description}>{`isEdited: ${isEdited}`}</Text> */}
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.deleteContainer}
          onPress={onDeletePress}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteContainer}
          onPress={() => {
            if (isEdited) {
              onTaskSave(id, newDescription);
            }
            setIsEdited((prevValue) => !prevValue);
          }}
        >
          <Text>{isEdited ? "SAVE" : "EDIT"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth / 1.2,
    marginVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#11F323",
    padding: 4,
  },
  deleteContainer: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    width: 40,
    margin: 12,
    height: 40,
    backgroundColor: "#DDDDDD",
  },
  description: {
    // flexGrow: 1,
    // padding: 8,
  },
  // checkbox: {
  //   paddingVertical: 50,
  // }
});
