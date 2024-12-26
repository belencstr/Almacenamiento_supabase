import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; 
import { supabase } from '@core/supabase/client';

// import File from '@uploads/models/File';


const FileUploader = () => {
  const [files, setFiles] = useState<string[]>([]);
  const BASE_STORAGE_URL = process.env.EXPO_PUBLIC_BASE_BUCKET_URL || 'https://uyfgurydptuidbywfjja.supabase.co/storage/v1/object/public/uploads';

  // Fetch files from Supabase storage
  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('uploads').list();
    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data.map((file) => {
        // console.log(file); // Para depuración
        return file.name;  // Retorna el nombre del archivo
      }));      
    }
  };

  useEffect(() => {
    fetchFiles();
    console.log(`Archivos actualizadoss. Hay ${files.length} archivos en el bucket.`)
  },[])

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`No se puede abrir la URL: ${url}`);
      }
    } catch (error) {
      console.error('Error al intentar abrir la URL:', error);
    }
  }

  // Handle file upload
  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    // Check if the operation was canceled
    if (!result.canceled) {
      const { name, uri } = result.assets[0]; // `uri` and `name` are available in the success result
      const response = await fetch(uri);
      const fileBlob = await response.blob();

      const { error } = await supabase.storage.from('uploads').upload(name, fileBlob);
      if (error) {
        console.error('Error uploading file:', error);
      } else {
        console.log('File uploaded successfully!');
        fetchFiles(); // Refresh file list
      }
    } else {
      console.log('Document selection canceled');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
        <Text style={styles.buttonText}>Subida de ficheros</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Ficheros subidos:</Text>
      {files.map((file, index) => (
        <Text key={index} style={styles.fileName}>
          {file}
          <TouchableOpacity
            style={styles.button}
            onPress={() => openLink(`${BASE_STORAGE_URL}/${file}`)}
          >
            <Text style={styles.buttonText}>Abrir Imagen</Text>
          </TouchableOpacity>
        </Text>
      ))}
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
  button: {
    backgroundColor: '#123584',
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
  title: {
    color: '#f1c40f',
    marginBottom: 20,
    marginTop: 20,
  },
  fileName: {
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
  fileUrl: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default FileUploader;
