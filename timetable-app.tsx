import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Book } from 'lucide-react';

const timetableData = {
  Monday: [
    { time: '09:15-10:05', name: 'Intel Unnati', code: 'HED', teacher: 'Dr. Vandana Shrama', classroom: 'Lab A' },
    { time: '10:05-10:55', name: 'Design and Analysis of Algorithm', code: 'BDA302-4N', teacher: 'Dr. Shilpa', classroom: 'B417' },
    { time: '10:55-11:45', name: 'French/German/Hindi/Spanish', code: 'BDA381-4N', teacher: 'Prof. Lawrence', classroom: 'B Block basement room, B405, B308, A503' },
    { time: '01:25-02:15', name: 'Project', classroom: 'B417' }
  ],
  // ... (previous days data remains the same)
};

const formatTime = (timeString) => {
  const [startTime, endTime] = timeString.split('-');
  return { startTime, endTime };
};

const calculateTimeRemaining = (timeString) => {
  const now = new Date();
  const { startTime, endTime } = formatTime(timeString);
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes);
  
  const currentTime = now.getTime();
  const startTime_ms = startDate.getTime();
  const endTime_ms = endDate.getTime();
  
  if (currentTime < startTime_ms) {
    // Class hasn't started yet
    const minutesUntilStart = Math.ceil((startTime_ms - currentTime) / (1000 * 60));
    return `Starts in ${minutesUntilStart} min`;
  } else if (currentTime > endTime_ms) {
    // Class has ended
    return 'Ended';
  } else {
    // Class is in progress
    const minutesRemaining = Math.ceil((endTime_ms - currentTime) / (1000 * 60));
    return `${minutesRemaining} min remaining`;
  }
};

const TimetableApp = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-4 font-system">
      <div className="max-w-2xl mx-auto bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-800 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-3 text-blue-400" />
            <h1 className="text-2xl font-semibold">My Timetable</h1>
          </div>
          <div className="text-neutral-400 text-sm">
            {currentTime.toLocaleString('en-US', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex justify-between p-2 bg-neutral-800/50 overflow-x-auto">
          {Object.keys(timetableData).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                selectedDay === day 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Content */}
        <div className="p-4">
          {timetableData[selectedDay].map((session, index) => {
            const timeRemaining = calculateTimeRemaining(session.time);
            
            return (
              <div 
                key={index} 
                className="bg-neutral-800 rounded-xl p-4 mb-3 flex items-center hover:bg-neutral-700/80 transition-colors"
              >
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-blue-400 w-5 h-5" />
                      <span className="font-medium text-neutral-300">{session.time}</span>
                    </div>
                    <div className={`text-sm font-medium ${
                      timeRemaining.includes('Starts') 
                        ? 'text-yellow-500' 
                        : timeRemaining === 'Ended' 
                          ? 'text-red-500' 
                          : 'text-green-500'
                    }`}>
                      {timeRemaining}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-white">{session.name}</h2>
                  {session.code && (
                    <p className="text-neutral-400 text-sm">
                      <Book className="inline-block mr-1 w-4 h-4" />
                      {session.code}
                    </p>
                  )}
                  {session.teacher && (
                    <p className="text-neutral-400 text-sm mt-1">
                      Instructor: {session.teacher}
                    </p>
                  )}
                  <p className="text-neutral-500 text-sm mt-1">
                    Classroom: {session.classroom}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimetableApp;
