import { StyleSheet, View, Text } from 'react-native';
import FileUploader from '@features/uploads/components/FileUploader'; // Adjust the import path as necessary

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Subida de ficheros</Text>
      <View style={{ flex: 1 }}>
        <FileUploader />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232489',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    height: 100
  },
  h2: {
    color: '#f0f0f0',
    marginTop: 32,
    fontSize: 32,
    fontWeight: 'bold'
  }
});