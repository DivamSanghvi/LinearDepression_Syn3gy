import React, { useState } from "react";
import { Button } from "./ui/button";
import { Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import Link from "next/link";

export default function QuizModal() {
  const [selectedTopic, setSelectedTopic] = useState("");

  const topics = ["Math", "Science", "History", "Geography"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 gap-1">
          <Award className="h-4 w-4" />
          Take Quiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Select a Topic</DialogTitle>
        <DialogDescription>
          Choose a topic for your quiz from the dropdown below.
        </DialogDescription>
        <Select onValueChange={(value) => setSelectedTopic(value)}>
          <SelectTrigger className="w-full mt-4">
            {selectedTopic ? selectedTopic : "Select a topic"}
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Link href={`/test/quiz/${selectedTopic}`} className="w-full">
          <Button className="bg-[#8200DA] w-full hover:bg-[#8200DA] hover:opacity-80">
            Take Quiz
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
