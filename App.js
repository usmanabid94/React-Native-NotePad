/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await getNotes();
      setNotes(savedNotes);
      if (savedNotes.length > 0) {
        setCurrentNote(savedNotes[0].text);
      }
    };
    fetchNotes();
    console.log('Current note set to:', currentNote);
  }, []);
  const getNotes = async () => {
    try {
      const notesString = await AsyncStorage.getItem('notes');
      if (notesString !== null) {
        const notes = JSON.parse(notesString);
        return notes;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  };
  const handleAddNote = async () => {
    const newNote = { id: Date.now().toString(), text: currentNote };
    try {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setCurrentNote('');
    } catch (e) {
      console.error('Failed to add note', e);
    }
  };

  const handleNotePress = (id) => {
    const note = notes.find((n) => n.id === id);
    setSelectedNote(note);
    setCurrentNote(note.text);
  };

  const handleNoteEdit = async (text) => {
    if (!text.trim()) {
      return; // Don't save the note if the text is empty
    }
   const updatedNotes = notes.map((note) => {
      if (note.id === selectedNote.id) {
        return {
          ...note,
          text,
        };
      } else {
        return note;
      }
    });
    await saveNotes(updatedNotes);
    setNotes(updatedNotes);
    setCurrentNote(text); // Update currentNote state with edited text
    console.log('Current note updated:', text);

  };
  const saveNotes = async (notes) => {
    try {
      const jsonNotes = JSON.stringify(notes);
      console.log('Saving notes:', jsonNotes);
      await AsyncStorage.setItem('notes', jsonNotes);
      console.log('Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes', error);
    }
  };

  const handleBackButtonPress = async () => {
    if (selectedNote.text !== currentNote) {
      await handleNoteEdit(currentNote);
    }
    setSelectedNote(null);
    setCurrentNote(''); // Reset currentNote state
  };

  const renderNote = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleNotePress(item.id)} style={styles.note}>
        <Text style={styles.noteText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  const renderSelectedNote = () => {
    return (
      <View style={styles.selectedNoteContainer}>
        <TextInput
          style={styles.selectedNoteInput}
          value={selectedNote.text}
          onChangeText={handleNoteEdit}
          autoFocus={true}
          multiline={true}
        />
        <TouchableOpacity onPress={handleBackButtonPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new note"
          value={currentNote}
          onChangeText={setCurrentNote}
        />
        <TouchableOpacity onPress={handleAddNote} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {selectedNote ? (
        renderSelectedNote()
      ) : (
        <FlatList
          style={styles.notesList}
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
     );
    };

  const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#fff',
  padding: 20,
  marginTop:'10%',
  },
  inputContainer: {
  flexDirection: 'row',
  marginBottom: 20,
  },
  input: {
  flex: 1,
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  paddingHorizontal: 10,
  },
  addButton: {
  marginLeft: 10,
  backgroundColor: 'blue',
  paddingHorizontal: 15,
  justifyContent: 'center',
  alignItems: 'center',
  },
  addButtonText: {
  color: '#fff',
  fontSize: 16,
  },
  notesList: {
  flex: 1,
  },
  note: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
  },
  noteText: {
  fontSize: 16,
  },
  selectedNoteContainer: {
  flex: 1,
  backgroundColor:'#cecece'
  },
  selectedNoteInput: {
  flex: 1,
  textAlignVertical: 'top',
  fontSize: 16,
  paddingHorizontal: 10,
  paddingVertical: 10,
  },
  backButton: {
  backgroundColor: 'blue',
  padding: 10,
  alignItems: 'center',
  marginTop: 10,
  },
  backButtonText: {
  color: '#fff',
  fontSize: 16,
  },
  });
  export default App;

// Here's a brief explanation of all features:

// 1. `handleNotePress`: This function is called when a user clicks on a note. It finds the selected note by its ID and sets the `selectedNote` state to it.

// 2. `handleNoteEdit`: This function is called when a user edits the text of a note. It creates a new array of notes with the edited note and saves it to the storage.

// 3. `handleBackButtonPress`: This function is called when a user clicks the back button after editing a note. It checks if the text of the selected note has changed and saves the changes if necessary. Then it sets the `selectedNote` state to `null`.

// 4. `renderSelectedNote`: This function renders the selected note with an editable text input and a back button.

// 5. `selectedNote` state: This state holds the currently selected note. If it is `null`, the list of notes is displayed. If it is not `null`, the selected note is displayed with an editable text input.

// I hope this helps! Let me know if you have any questions.

