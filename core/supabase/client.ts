import { createClient } from '@supabase/supabase-js';

const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5Zmd1cnlkcHR1aWRieXdmamphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MDg2OTAsImV4cCI6MjA0NjI4NDY5MH0.eVo7vdvBTKFonvBJ176kiBS32HaEgmCYkyBMCXx5hAA'
const SUPABASE_URL='https://uyfgurydptuidbywfjja.supabase.co'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Prueba de conexión
export const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').limit(1);
      if (error) {
        console.error('Error al conectar con Supabase:', error);
      } else {
        console.log('Conexión exitosa. Datos:', data);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  };