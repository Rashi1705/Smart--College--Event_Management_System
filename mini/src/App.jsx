import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, Bell, Plus, Search, Filter, QrCode, Edit, Trash2, CheckCircle, XCircle, Clock, MapPin, UserCheck } from 'lucide-react';

const SmartEventManagement = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState('student'); // student, organizer, admin
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'AI Workshop 2025',
      description: 'Learn about the latest AI technologies and hands-on machine learning.',
      date: '2025-09-15T14:00',
      venue: 'Tech Lab A',
      capacity: 100,
      registered: 85,
      category: 'technical',
      status: 'approved',
      organizer: 'Tech Club',
      registrationDeadline: '2025-09-14T23:59',
      attendees: []
    },
    {
      id: 2,
      title: 'Annual Cultural Fest',
      description: 'Three days of music, dance, drama, and cultural celebrations.',
      date: '2025-09-20T10:00',
      venue: 'Main Auditorium',
      capacity: 500,
      registered: 245,
      category: 'cultural',
      status: 'approved',
      organizer: 'Cultural Society',
      registrationDeadline: '2025-09-19T23:59',
      attendees: []
    },
    {
      id: 3,
      title: 'Basketball Tournament',
      description: 'Inter-college basketball championship with exciting prizes.',
      date: '2025-09-18T09:00',
      venue: 'Sports Complex',
      capacity: 64,
      registered: 32,
      category: 'sports',
      status: 'approved',
      organizer: 'Sports Club',
      registrationDeadline: '2025-09-17T23:59',
      attendees: []
    }
  ]);

  const [registeredEvents, setRegisteredEvents] = useState([1]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Event Reminder', message: 'AI Workshop 2025 starts in 2 hours. Don\'t forget to bring your laptop!', time: '2 hours ago', type: 'reminder' },
    { id: 2, title: 'Registration Confirmed', message: 'Your registration for Basketball Tournament has been confirmed.', time: '1 day ago', type: 'success' },
    { id: 3, title: 'Badge Earned', message: 'Congratulations! You\'ve earned the "Event Enthusiast" badge.', time: '3 days ago', type: 'achievement' }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: 'Priya Sharma', events: 42, points: 420, badges: ['🏆', '🎯', '⭐'] },
    { id: 2, name: 'Arjun Patel', events: 38, points: 380, badges: ['🏆', '🎯'] },
    { id: 3, name: 'Sneha Kumar', events: 35, points: 350, badges: ['🏆', '⭐'] },
    { id: 4, name: 'Rahul Singh', events: 32, points: 320, badges: ['🎯'] },
    { id: 5, name: 'Ananya Das', events: 29, points: 290, badges: ['⭐'] }
  ]);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    category: '',
    registrationDeadline: ''
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      ...eventForm,
      registered: 0,
      status: userRole === 'admin' ? 'approved' : 'pending',
      organizer: userRole === 'organizer' ? 'Your Club' : 'Unknown',
      attendees: []
    };
    setEvents([...events, newEvent]);
    setEventForm({
      title: '',
      description: '',
      date: '',
      venue: '',
      capacity: '',
      category: '',
      registrationDeadline: ''
    });
    setNotifications([{
      id: notifications.length + 1,
      title: 'Event Created',
      message: `"${newEvent.title}" has been created and is ${newEvent.status === 'approved' ? 'live' : 'pending approval'}.`,
      time: 'Just now',
      type: 'success'
    }, ...notifications]);
    setCurrentView('my-events');
  };

  const handleRegisterEvent = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, registered: event.registered + 1 } : event
      ));
      const event = events.find(e => e.id === eventId);
      setNotifications([{
        id: notifications.length + 1,
        title: 'Registration Confirmed',
        message: `You've successfully registered for "${event.title}".`,
        time: 'Just now',
        type: 'success'
      }, ...notifications]);
    }
  };

  const handleUnregisterEvent = (eventId) => {
    setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, registered: Math.max(0, event.registered - 1) } : event
    ));
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setNotifications([{
      id: notifications.length + 1,
      title: 'Event Deleted',
      message: 'Event has been successfully deleted.',
      time: 'Just now',
      type: 'info'
    }, ...notifications]);
  };

  const handleApproveEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'approved' } : event
    ));
  };

  const handleRejectEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'rejected' } : event
    ));
  };

  const markAttendance = (eventId, studentId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const attendees = event.attendees || [];
        if (!attendees.includes(studentId)) {
          return { ...event, attendees: [...attendees, studentId] };
        }
      }
      return event;
    }));
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = !filterCategory || event.category === filterCategory;
    const matchesSearch = !searchQuery || event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = event.status === 'approved';
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const myEvents = userRole === 'organizer' ? events.filter(e => e.organizer === 'Your Club') : [];
  const pendingEvents = userRole === 'admin' ? events.filter(e => e.status === 'pending') : [];

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      cultural: 'bg-yellow-100 text-yellow-800',
      sports: 'bg-green-100 text-green-800',
      academic: 'bg-purple-100 text-purple-800',
      social: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Navigation
  const Navigation = () => (
    <div className="bg-white shadow-md rounded-xl p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        <NavButton icon={<Users />} label="Dashboard" view="dashboard" />
        <NavButton icon={<Calendar />} label="Browse Events" view="browse" />
        {(userRole === 'organizer' || userRole === 'admin') && (
          <>
            <NavButton icon={<Plus />} label="Create Event" view="create" />
            <NavButton icon={<Edit />} label="My Events" view="my-events" />
          </>
        )}
        {userRole === 'student' && (
          <NavButton icon={<CheckCircle />} label="My Registrations" view="registrations" />
        )}
        {(userRole === 'organizer' || userRole === 'admin') && (
          <NavButton icon={<UserCheck />} label="Attendance" view="attendance" />
        )}
        <NavButton icon={<Trophy />} label="Leaderboard" view="leaderboard" />
        <NavButton icon={<Bell />} label="Notifications" view="notifications" />
        {userRole === 'admin' && (
          <NavButton icon={<XCircle />} label="Approvals" view="approvals" />
        )}
      </div>
    </div>
  );

  const NavButton = ({ icon, label, view }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        currentView === view
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Event Management System</h2>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUserRole('student')}
            className={`px-4 py-2 rounded-lg ${userRole === 'student' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Student View
          </button>
          <button
            onClick={() => setUserRole('organizer')}
            className={`px-4 py-2 rounded-lg ${userRole === 'organizer' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Organizer View
          </button>
          <button
            onClick={() => setUserRole('admin')}
            className={`px-4 py-2 rounded-lg ${userRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Admin View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={events.filter(e => e.status === 'approved').length} color="from-blue-500 to-blue-600" />
        <StatCard label="Active Students" value="1,834" color="from-green-500 to-green-600" />
        <StatCard label="Active Clubs" value="42" color="from-purple-500 to-purple-600" />
        <StatCard label="Attendance Rate" value="87%" color="from-pink-500 to-pink-600" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
            <div className="text-sm text-gray-600">Your Registrations</div>
            <div className="text-2xl font-bold text-purple-600">{registeredEvents.length}</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg">
            <div className="text-sm text-gray-600">Events This Month</div>
            <div className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'approved').length}</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
            <div className="text-sm text-gray-600">Your Points</div>
            <div className="text-2xl font-bold text-yellow-600">{registeredEvents.length * 10}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ label, value, color }) => (
    <div className={`bg-gradient-to-r ${color} text-white rounded-xl shadow-lg p-6`}>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );

  // Browse Events View
  const BrowseEventsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Events</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            <option value="technical">Technical</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onRegister={handleRegisterEvent} />
          ))}
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event, onRegister }) => {
    const isRegistered = registeredEvents.includes(event.id);
    const isFull = event.registered >= event.capacity;

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">{event.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {event.venue}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {event.registered}/{event.capacity} Registered
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
              style={{ width: `${(event.registered / event.capacity) * 100}%` }}
            />
          </div>

          {userRole === 'student' && (
            <button
              onClick={() => onRegister(event.id)}
              disabled={isRegistered || isFull}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                isRegistered
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : isFull
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              {isRegistered ? '✓ Registered' : isFull ? 'Event Full' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Create Event View
  const CreateEventView = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
          <input
            type="text"
            required
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            required
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
            placeholder="Describe your event..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
            <input
              type="text"
              required
              value={eventForm.venue}
              onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
            <input
              type="number"
              required
              min="1"
              value={eventForm.capacity}
              onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Maximum attendees"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              required
              value={eventForm.category}
              onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select category</option>
              <option value="academic">Academic</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="technical">Technical</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Deadline</label>
            <input
              type="datetime-local"
              required
              value={eventForm.registrationDeadline}
              onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Create Event
        </button>
      </form>
    </div>
  );

  // My Events View (for organizers)
  const MyEventsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Events</h2>
        {myEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
            <button
              onClick={() => setCurrentView('create')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myEvents.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                      event.status === 'approved' ? 'bg-green-100 text-green-800' :
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>📍 {event.venue}</span>
                  <span>👥 {event.registered}/{event.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // My Registrations View (for students)
  const RegistrationsView = () => {
    const myRegisteredEvents = events.filter(e => registeredEvents.includes(e.id));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Registrations</h2>
          {myRegisteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
              <button
                onClick={() => setCurrentView('browse')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRegisteredEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnregisterEvent(event.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Unregister
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Attendance View
  const AttendanceView = () => {
    const [studentId, setStudentId] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');

    const handleMarkAttendance = () => {
      if (studentId && selectedEventId) {
        markAttendance(parseInt(selectedEventId), studentId);
        alert(`Attendance marked for Student ID: ${studentId}`);
        setStudentId('');
        setSelectedEventId('');
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h2>
          
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-8 mb-6 text-center">
            <QrCode className="w-24 h-24 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">QR Code Scanner</h3>
            <p className="text-gray-600 mb-4">Scan student QR codes to mark attendance</p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
              Start Scanner
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Manual Attendance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter student ID"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose event</option>
                  {events.filter(e => e.status === 'approved').map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleMarkAttendance}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Mark Attendance
              </button>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance Records</h3>
            <div className="space-y-3">
              {events.filter(e => e.attendees && e.attendees.length > 0).map(event => (
                <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{event.attendees.length}</div>
                      <div className="text-sm text-gray-600">Attended</div>
                    </div>
                  </div>
                </div>
              ))}
              {events.filter(e => e.attendees && e.attendees.length > 0).length === 0 && (
                <p className="text-gray-500 text-center py-8">No attendance records yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Leaderboard View
  const LeaderboardView = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Leaderboard</h2>
      <p className="text-gray-600 mb-6">Top students based on event participation and engagement</p>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <th className="px-6 py-4 text-left rounded-tl-lg">Rank</th>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Events Attended</th>
              <th className="px-6 py-4 text-left">Points</th>
              <th className="px-6 py-4 text-left rounded-tr-lg">Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((student, index) => (
              <tr key={student.id} className={`border-b hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">{student.name}</td>
                <td className="px-6 py-4 text-gray-600">{student.events}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-purple-600">{student.points}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {student.badges.map((badge, i) => (
                      <span key={i} className="text-2xl">{badge}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Notifications View
  const NotificationsView = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications & Reminders</h2>
      
      <div className="space-y-4">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`rounded-lg p-4 border-l-4 ${
              notification.type === 'reminder' ? 'bg-blue-50 border-blue-500' :
              notification.type === 'success' ? 'bg-green-50 border-green-500' :
              notification.type === 'achievement' ? 'bg-yellow-50 border-yellow-500' :
              'bg-gray-50 border-gray-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                notification.type === 'reminder' ? 'bg-blue-200' :
                notification.type === 'success' ? 'bg-green-200' :
                notification.type === 'achievement' ? 'bg-yellow-200' :
                'bg-gray-200'
              }`}>
                {notification.type === 'reminder' && <Bell className="w-5 h-5 text-blue-700" />}
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-700" />}
                {notification.type === 'achievement' && <Trophy className="w-5 h-5 text-yellow-700" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{notification.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Approvals View (Admin only)
  const ApprovalsView = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h2>
      
      {pendingEvents.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <p className="text-gray-500">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingEvents.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-600">Organized by: {event.organizer}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  PENDING
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{event.description}</p>
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>📍 {event.venue}</span>
                <span>👥 Capacity: {event.capacity}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApproveEvent(event.id)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleRejectEvent(event.id)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Smart College Event Management
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            Streamline your campus events with intelligent management
          </p>
        </div>

        <Navigation />

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'browse' && <BrowseEventsView />}
        {currentView === 'create' && <CreateEventView />}
        {currentView === 'my-events' && <MyEventsView />}
        {currentView === 'registrations' && <RegistrationsView />}
        {currentView === 'attendance' && <AttendanceView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'notifications' && <NotificationsView />}
        {currentView === 'approvals' && <ApprovalsView />}
      </div>
    </div>
  );
};

export default SmartEventManagement;