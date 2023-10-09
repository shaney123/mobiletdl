import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#0A4B18',
  white: '#D3EDD0',
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editedTask, setEditedTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getTasksFromUserDevice();
  }, []);

  useEffect(() => {
    saveTasksToUserDevice(tasks);
  }, [tasks]);
  
const addTask = () => {
  if (taskText.trim() === '') {
    Alert.alert(
      'Error',
      'Please input text!!!',
      [{ text: 'OK', style: 'destructive' }]
    );
  } else {
    const newTask = {
      id: Math.random().toString(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
  }
};

  const saveTasksToUserDevice = async (tasks) => {
    try {
      const stringifyTasks = JSON.stringify(tasks);
      await AsyncStorage.setItem('tasks', stringifyTasks);
    } catch (error) {
      console.log(error);
    }
  };

  const getTasksFromUserDevice = async () => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      if (tasks != null) {
        setTasks(JSON.parse(tasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId ? { ...task, text: editedTask } : task
    );
    setTasks(updatedTasks);
    setEditingTaskId(null);
    setIsEditing(false); // Exit editing mode
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    Alert.alert('Clear All Tasks', 'Are you sure you want to clear all tasks?', [
      {
        text: 'Yes',
        onPress: () => setTasks([]),
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  const renderTask = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        onPress={() => toggleTaskCompletion(item.id)}
        style={[
          styles.checkbox,
          { borderColor: item.completed ? COLORS.primary : 'gray' },
        ]}
      >
        {item.completed && (
          <Icon name="check" size={24} color={COLORS.primary} />
        )}
      </TouchableOpacity>
      {editingTaskId === item.id ? (
        <TextInput
          style={styles.inputText}
          value={editedTask}
          onChangeText={(text) => setEditedTask(text)}
          onBlur={updateTask}
        />
      ) : (
        <Text
          style={[
            styles.taskText,
            { textDecorationLine: item.completed ? 'line-through' : 'none' },
          ]}
        >
          {item.text}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => {
          setEditingTaskId(item.id);
          setIsEditing(true); // Enter editing mode
        }}
        style={styles.editButton}
      >
        <Icon name="edit" size={20} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Icon name="delete" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>To-Do List</Text>
        <TouchableOpacity onPress={clearAllTasks} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
      />
      {!isEditing && (
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Add a new task"
              value={taskText}
              onChangeText={(text) => setTaskText(text)}
            />
          </View>
          <TouchableOpacity onPress={addTask} style={styles.iconContainer}>
            <Icon name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  clearButton: {
    padding: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'green',
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 5,
    elevation: 10,
    backgroundColor: 'white',
    flex: 1,
    marginVertical: 35,
    marginRight: 18,
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    height: 50,
    width: 100,
    backgroundColor: COLORS.primary,
    elevation: 48,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 25,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 15,
    borderRadius: 15,
    marginVertical: 12,
    alignItems: 'center',
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  taskText: {
    flex: 1,
    fontWeight: 'thin',
    fontSize: 15,
    color: COLORS.primary,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    fontSize: 15,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
