import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@core/supabase/client';
import { Task } from '@features/tasks/models/Task';

interface TaskFormProps {
  onSave: () => void; // Callback para notificar al componente padre cuando se guarde una tarea
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      console.error('Por favor, completa todos los campos');
      return;
    }

    console.log('Datos del formulario:', { title, description });

    const user = await supabase.auth.getUser(); // Obtén el usuario autenticado
    const userId = user?.data.user?.id || process.env.EXPO_PUBLIC_ID_PRUEBAS;

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          user_id: userId,
        },
      ]);

    if (!error) {
      onSave();
      setTitle('');
      setDescription('');
    } else {
      console.error('Error al guardar la tarea:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Descripción"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
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
  title: {
    color: '#f1c40f',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    padding: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#f1c40f',
    borderRadius: 8,
    outline: 'none',
    fontSize: 16,
    backgroundColor: '#2d2f3a',
    color: '#fff',
    marginBottom: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskForm;