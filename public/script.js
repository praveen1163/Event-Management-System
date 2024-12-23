// DOM Elements
const addEventBtn = document.getElementById('add-event-btn');
const addEventModal = document.getElementById('addEventModal');
const closeBtn = document.querySelector('.close-btn');
const addEventForm = document.getElementById('addEventForm');
const eventGrid = document.querySelector('.event-grid');

// Open the add event modal
addEventBtn.addEventListener('click', () => {
  addEventModal.style.display = 'block';
});

// Close the add event modal
closeBtn.addEventListener('click', () => {
  addEventModal.style.display = 'none';
});

// Add event form submit
addEventForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value;

  // POST request to add new event
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, date, location }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Event added:', data);
      getEvents(); // Refresh events list
      addEventModal.style.display = 'none'; // Close modal
    })
    .catch(error => {
      console.error('Error adding event:', error);
    });
});

// Function to fetch and display events
function getEvents() {
  fetch('/api/events')
    .then(response => response.json())
    .then(events => {
      // Clear the current events in the grid
      eventGrid.innerHTML = '';
      
      events.forEach(event => {
        // Create a new event card for each event
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
          <h3>${event.name}</h3>
          <p>Date: ${event.date}</p>
          <p>Location: ${event.location}</p>
          <button class="btn-secondary" onclick="editEvent(${event.id})">Edit</button>
          <button class="btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
        `;
        eventGrid.appendChild(eventCard);
      });
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
}

// Function to delete an event
function deleteEvent(eventId) {
  fetch(`/api/events/${eventId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      console.log('Event deleted:', data);
      getEvents(); // Refresh events list
    })
    .catch(error => {
      console.error('Error deleting event:', error);
    });
}

// Function to edit an event
function editEvent(eventId) {
  const eventName = prompt('Enter new event name:');
  const eventDate = prompt('Enter new event date (YYYY-MM-DD):');
  const eventLocation = prompt('Enter new event location:');
  
  if (eventName && eventDate && eventLocation) {
    fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: eventName, date: eventDate, location: eventLocation })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Event updated:', data);
        getEvents(); // Refresh events list
      })
      .catch(error => {
        console.error('Error updating event:', error);
      });
  }
}

// Call getEvents() initially to load events on page load
getEvents();
