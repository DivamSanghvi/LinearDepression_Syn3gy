"use client"
import React from 'react'
import { Bookmark } from 'lucide-react'
import { X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'


function StickyNotes() {

      const [notes, setNotes] = useState(["Take notes on key concepts", "Remember to review the transcript"]);
      const [newNote, setNewNote] = useState("");
      

      const addNote = () => {
        if (newNote.trim() !== '') {
          setNotes([...notes, newNote]);
          setNewNote('');
        }
      };
    
      const deleteNote = (index) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
      };
  return (
    <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-md p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-amber-500" />
        Quick Notes
      </h3>
    </div>
    <div className="space-y-2 mb-4">
      {notes.map((note, index) => (
        <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md relative group">
          <p className="text-sm">{note}</p>
          <button 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => deleteNote(index)}
          >
            <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      <Input 
        placeholder="Add a note..." 
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addNote()
          }
        }}
      />
      <Button onClick={addNote} size="sm">Add</Button>
    </div>
  </div>
  )
}

export {StickyNotes}