import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '@core/supabase/client';
import { Task } from '@features/tasks/models/Task';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1); 
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  const fetchTasks = async () => {
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase.from('tasks').select('*').range(start, end);

    if (filterCompleted !== null) {
      query = query.eq('completed', filterCompleted);
    }

    const { data, error } = await query.order('id', { ascending: false });

    if (!error && data) {
      setTasks(data as Task[]);
    } else {
      console.error('Error al obtener las tareas:', error);
    }
  };

  const toggleTaskCompletion = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error al alternar el estado de la tarea:', error);
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !currentStatus } : task
      )
    );
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al borrar la tarea:', error);
      return;
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const goToNextPage = () => setPage(page + 1);
  const goToPreviousPage = () => page > 1 && setPage(page - 1);

  const toggleFilter = () => {
    setFilterCompleted(filterCompleted === null ? false : filterCompleted ? false : true);
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filterCompleted]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Text style={[styles.status, item.completed ? styles.completed : styles.notCompleted]}>
                {item.completed ? '✔' : '❌'}
              </Text>
              <Text style={styles.taskText}>{item.title}</Text>
            </View>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.completeButton]}
                onPress={() => toggleTaskCompletion(item.id, item.completed)}
              >
                <Text style={styles.buttonText}>
                  {item.completed ? 'Desmarcar' : 'Completar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={goToPreviousPage} disabled={page === 1}>
          <Text style={styles.paginationText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Página {page}</Text>
        <TouchableOpacity onPress={goToNextPage}>
          <Text style={styles.paginationText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleFilter} style={styles.filterButton}>
        <Text style={styles.buttonText}>
          {filterCompleted === null
            ? 'Mostrar todas las tareas'
            : filterCompleted
            ? 'Mostrar tareas no completadas'
            : 'Mostrar tareas completadas'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3b3f51',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    padding: 30,
    maxWidth: 600,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    margin: 'auto',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: '#4a4f63',
    color: '#ffffff',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completed: {
    color: '#4CAF50',
  },
  notCompleted: {
    color: '#E53935',
  },
  taskDescription: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    alignItems: 'center',
  },
  paginationText: {
    color: '#ffffff',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  pageNumber: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default TaskList;