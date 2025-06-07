import React, { useState, useCallback, useMemo, useRef } from 'react';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import type { CalendarProps, DateLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  MapPin, 
  Clock, 
  Users, 
  Tag,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Types
type EventType = 'academic' | 'social' | 'sports' | 'workshop' | 'other' | 'event';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: EventType;
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
  maxAttendees?: number;
  color?: string;
}

// Setup the localizer with date-fns
import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};

const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {},
});

// Event type configuration
const eventTypeConfig = {
  academic: { label: 'Academic', color: '#3b82f6' }, // blue
  social: { label: 'Social', color: '#8b5cf6' }, // purple
  sports: { label: 'Sports', color: '#10b981' }, // emerald
  workshop: { label: 'Workshop', color: '#f59e0b' }, // amber
  other: { label: 'Other', color: '#6b7280' }, // gray
  event:{label: 'Event', color: '#FF0000'},
};

// Sample data
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Technomax',
    start: new Date('2025-06-03,16:00 PM'), // June 1, 2025, 9:00 AM
    end: new Date('2025-06-03'),  // June 1, 2025, 4:00 PM
    allDay: false,
    type: 'other',
    location: 'Main Auditorium',
    description: 'Technomax is a high-energy tech event that brings together innovators and enthusiasts for hackathons, workshops, and AI, robotics, and more.',
    organizer: 'Student Affairs',
    attendees: ['students@example.com', 'faculty@example.com'],
    maxAttendees: 100
  },
  {
    id: '2',
    title: 'External Examinations',
    start: new Date('2025-06-09'), 
    end: new Date('2025-06-20'),  
    allDay: false,
    type: 'academic',
    location: 'Main Campus',
    description: 'Annual External Examinations',
    organizer: 'Utttrakhand Technical University ',
    attendees: ['students@example.com', 'faculty@example.com'],
    maxAttendees: 250
  },
  {
    id: '3',
    title: 'End Exams',
    start: new Date(2025, 5, 10, 10, 0), // June 10, 2025, 10:00 AM
    end: new Date(2025, 5, 10, 13, 0),  // June 10, 2025, 1:00 PM
    allDay: false,
    type: 'academic',
    location: 'Main Campus',
    description: 'End of the Exams for all the deparments',
    organizer: 'Uttrakhand Technical University',
    attendees: ['students@example.com'],
    maxAttendees: 130
  },
];

// Event Component
const EventComponent = React.memo(({ event, getEventTypeColor }: { 
  event: CalendarEvent; 
  getEventTypeColor: (type: EventType) => string 
}) => (
  <div className={`p-1 text-xs ${getEventTypeColor(event.type)} rounded`}>
    <strong>{event.title}</strong>
    {event.start && (
      <div className="text-xs">
        {format(event.start, 'h:mm a')}
      </div>
    )}
  </div>
));

const EventCalendar: React.FC = () => {
  // Get color based on event type
  const getEventTypeColor = useCallback((type: EventType): string => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      social: 'bg-green-100 text-green-800',
      sports: 'bg-purple-100 text-purple-800',
      workshop: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
      event:'bg-red-100 text-white-800',
    };
    return colors[type] || colors.other;
  }, []);
  
  // Memoize the component with the color function
  const MemoizedEventComponent = useCallback(({ event }: { event: CalendarEvent }) => (
    <EventComponent event={event} getEventTypeColor={getEventTypeColor} />
  ), [getEventTypeColor]);
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Close modal and reset selected event
  const closeModal = useCallback(() => {
    setShowEventModal(false);
    setSelectedEvent(null);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  
  // Initialize attendees as empty array if undefined
  const safeSelectedEvent = useMemo(() => ({
    ...selectedEvent,
    attendees: selectedEvent?.attendees || []
  }), [selectedEvent]);

  // Format event time
  const formatEventTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Format event date with relative day
  const formatEventDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    }
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Filter events based on search and selected types
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type);
      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, selectedTypes]);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  // Handle new event creation (commented out for future implementation)
  // const handleCreateEvent = useCallback((event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (!selectedEvent) return;
    
  //   const newEvent: CalendarEvent = {
  //     ...selectedEvent,
  //     id: Date.now().toString(),
  //   };
    
  //   setEvents(prev => [...prev, newEvent]);
  //   setShowEventModal(false);
  //   setSelectedEvent(null);
  // }, [selectedEvent]);

  // Handle slot selection for new events
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    const newEvent: CalendarEvent = {
      id: `new-${Date.now()}`,
      title: 'New Event',
      start,
      end,
      type: 'other',
      allDay: false,
      description: '',
      organizer: user?.email || '',
      attendees: []
    };
    setSelectedEvent(newEvent);
    setShowEventModal(true);
  }, [user?.email]);

  // Calendar props
  const calendarProps: CalendarProps<CalendarEvent, object> = {
    localizer,
    events: filteredEvents,
    startAccessor: 'start',
    endAccessor: 'end',
    style: { height: '100%' },
    defaultDate: new Date(),
    scrollToTime: new Date(),
    defaultView: 'month',
    views: ['month', 'week', 'day', 'agenda'],
    components: {
      event: MemoizedEventComponent,
    },
    onSelectEvent: handleSelectEvent,
    onSelectSlot: handleSelectSlot,
    selectable: true,
    date,
    onNavigate: setDate,
    onView: (newView: View) => setView(newView),
  };

  // Toggle event type filter
  const toggleEventType = (type: EventType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Event Calendar</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <span className="ml-2">▼</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
              <div className="py-1" role="menu">
                {Object.entries(eventTypeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      selectedTypes.includes(type as EventType) ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => toggleEventType(type as EventType)}
                  >
                    <span 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowEventModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-[800px] w-full">
          <BigCalendar
            {...calendarProps}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
          />
        </div>
      </div>

      {/* Combined Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowEventModal(false)} />
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button 
                  type="button" 
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500" 
                  onClick={() => setShowEventModal(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {selectedEvent.id.startsWith('new-') ? (
                // New Event Form
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    New Event
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      New event creation form will be implemented here.
                    </p>
                  </div>
                </div>
              ) : (
                // Existing Event Details
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedEvent.title}
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {formatEventDate(selectedEvent.start)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatEventTime(selectedEvent.start)} - {formatEventTime(selectedEvent.end)}
                          </p>
                        </div>
                      </div>
                      
                      {selectedEvent.location && (
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Location</p>
                            <p className="text-sm text-gray-500">{selectedEvent.location}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Event Type</p>
                          <div className="flex items-center mt-1">
                            <span 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ 
                                backgroundColor: eventTypeConfig[selectedEvent.type]?.color || '#6b7280' 
                              }}
                            />
                            <span className="text-sm text-gray-500">
                              {eventTypeConfig[selectedEvent.type]?.label || 'Other'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {safeSelectedEvent.attendees.length} attendee{safeSelectedEvent.attendees.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {safeSelectedEvent.attendees.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Attendees:</h4>
                              <div className="space-y-1">
                                {safeSelectedEvent.attendees.map((attendee, index) => (
                                  <div key={index} className="text-sm text-gray-600">• {attendee}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedEvent.description && (
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-700">
                            {selectedEvent.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={() => setShowEventModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;