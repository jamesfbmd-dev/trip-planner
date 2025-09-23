// --- DATA & STATE MANAGEMENT ---
const EUROPEAN_CITIES = [
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Rome", lat: 41.9028, lng: 12.4964 },
    { name: "Madrid", lat: 40.4168, lng: -3.7038 },
    { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
    { name: "Prague", lat: 50.0755, lng: 14.4378 },
    { name: "Lisbon", lat: 38.7223, lng: -9.1393 },
    { name: "Vienna", lat: 48.2082, lng: 16.3738 },
    { name: "Brussels", lat: 50.8503, lng: 4.3517 },
    { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
    { name: "Athens", lat: 37.9838, lng: 23.7275 },
    { name: "Budapest", lat: 47.4979, lng: 19.0402 },
    { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
    { name: "Dublin", lat: 53.3498, lng: -6.2603 },
    { name: "Helsinki", lat: 60.1695, lng: 24.9354 },
    { name: "Oslo", lat: 59.9139, lng: 10.7522 }
];

let currentTripId = null;
let currentTrip = null;
let currentDate = new Date(); // State for the currently displayed month
let selectedDate = null; // State for the selected day

const getTrips = () => {
    const trips = localStorage.getItem('trips');
    return trips ? JSON.parse(trips) : {};
};

const saveTrips = (trips) => {
    localStorage.setItem('trips', JSON.stringify(trips));
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateAsText = (dateString) => {
    const date = new Date(dateString);

    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);
    const month = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(date);
    const day = date.getDate();
    const year = date.getFullYear();

    const suffix = (d => {
        if (d > 3 && d < 21) return "th";
        return ["th","st","nd","rd"][Math.min(d % 10, 4)];
    })(day);

    return `${weekday} ${day}${suffix} ${month} ${year}`;
};

// --- UI & PAGE NAVIGATION ---
const dashboardEl = document.getElementById('dashboard');
const tripCalendarEl = document.getElementById('trip-calendar');
const tripListEl = document.getElementById('tripList');
const newTripNameInput = document.getElementById('newTripName');
const tripTitleEl = document.getElementById('tripTitle');
const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarGridEl = document.getElementById('calendarGrid');
const mapSectionEl = document.getElementById('mapSection');

const showPage = (pageId) => {
    dashboardEl.classList.remove('active');
    tripCalendarEl.classList.remove('active');
    document.getElementById(pageId).classList.add('active');
};

// --- DASHBOARD FUNCTIONS ---
const renderDashboard = () => {
    showPage('dashboard');
    const trips = getTrips();
    tripListEl.innerHTML = '';
    for (const id in trips) {
        const trip = trips[id];
        const li = document.createElement('li');
        li.className = 'trip-item';
        li.innerHTML = `
            <span>${trip.name}</span>
            <button class="btn btn-secondary" onclick="openTrip('${id}')">Open</button>
        `;
        tripListEl.appendChild(li);
    }
};

const createNewTrip = () => {
    const tripName = newTripNameInput.value.trim();
    if (!tripName) {
        alert('Please enter a trip name.');
        return;
    }
    const trips = getTrips();
    const id = `trip-${Date.now()}`;
    trips[id] = { name: tripName, days: {} }; // `days` is now an object
    saveTrips(trips);
    newTripNameInput.value = '';
    renderDashboard();
};

// --- TRIP CALENDAR FUNCTIONS ---
const openTrip = (id) => {
    currentTripId = id;
    currentTrip = getTrips()[id];
    tripTitleEl.textContent = currentTrip.name;
    currentDate = new Date(); // Reset to current month on open
    renderCalendar();
    showPage('trip-calendar');
    mapSectionEl.style.display = 'none'; // Hide map initially
};

const renderCalendar = () => {
    calendarGridEl.innerHTML = '';
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Set display for month and year
    monthYearDisplay.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Add blank cells for days from previous month
    for(let i = 0; i < startDayOfWeek; i++) {
        const blankCell = document.createElement('div');
        blankCell.classList.add('day-cell', 'inactive');
        calendarGridEl.appendChild(blankCell);
    }

    // Add cells for each day of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dateString = formatDate(dayDate);
        const dayData = currentTrip.days[dateString];
        
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.dataset.date = dateString;
        dayCell.innerHTML = `
            <div class="day-number">${i}</div>
            <div class="day-content-wrapper">
                ${dayData ? getDayContent(dayData) : ''}
            </div>
        `;
        dayCell.addEventListener('click', () => openDayModal(dateString));
        calendarGridEl.appendChild(dayCell);
    }
};

const getDayContent = (dayData) => {
    if (dayData.type === 'travel') {
        return `
            <div class="day-content faded-blue">${dayData.from.name} →</div>
            <div class="day-content">→ ${dayData.to.name}</div>
        `;
    } else {
        return `
            <div class="day-content">${dayData.city.name}</div>
        `;
    }
};

const saveDayData = (dateString, data) => {
    const trips = getTrips();
    trips[currentTripId].days[dateString] = data;
    saveTrips(trips);
    currentTrip = trips[currentTripId]; // Update the currentTrip state
    renderCalendar();
};

const clearDayData = (dateString) => {
    const trips = getTrips();
    if (trips[currentTripId] && trips[currentTripId].days[dateString]) {
        delete trips[currentTripId].days[dateString];
        saveTrips(trips);
        currentTrip = trips[currentTripId]; // Update the currentTrip state
        renderCalendar();
    }
};

// --- MAP GENERATION ---
let map;
const generateMap = () => {
    mapSectionEl.style.display = 'flex';
    
    if (map) {
        map.remove(); // Remove existing map instance
    }
    map = L.map('map').setView([50, 10], 4); // Center on Europe

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const dates = Object.keys(currentTrip.days).sort(); // Get dates in chronological order
    const itinerary = dates.map(date => currentTrip.days[date]);
    const cities = [];

    itinerary.forEach((day, index) => {
        if (day.type === 'travel') {
            cities.push(day.from);
            cities.push(day.to);
        } else {
            cities.push(day.city);
        }
    });
    
    // Remove consecutive duplicates and keep the final city
    const uniqueCities = cities.reduce((acc, current, idx, arr) => {
        if (idx > 0 && current.name === acc[acc.length - 1].name) {
            return acc;
        }
        if (idx < arr.length - 1 && current.name === arr[idx+1].name && idx !== 0) {
             return acc;
        }
        acc.push(current);
        return acc;
    }, []);

    const routePoints = uniqueCities.map(city => [city.lat, city.lng]);

    if (routePoints.length > 0) {
        // Add markers
        uniqueCities.forEach((city, index) => {
            const customIcon = L.divIcon({
                className: 'day-marker',
                html: `<div>${index + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
            
            const marker = L.marker([city.lat, city.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>${index + 1}. ${city.name}</b>`);
        });

        // Add polyline
        const polyline = L.polyline(routePoints, { color: 'blue', weight: 3 }).addTo(map);

        // Fit map to route
        map.fitBounds(polyline.getBounds());
    } else {
        alert("No itinerary data to generate a map.");
    }
};


// --- MODAL & AUTOCOMPLETE ---
const dayModal = document.getElementById('dayModal');
const modalContent = dayModal.querySelector('.modal-content');
const modalDayTitle = document.getElementById('modalDayTitle');
const cityInput = document.getElementById('cityInput');
const fromCityInput = document.getElementById('fromCityInput');
const toCityInput = document.getElementById('toCityInput');
const cityAutocompleteList = document.getElementById('cityAutocompleteList');
const fromCityAutocompleteList = document.getElementById('fromCityAutocompleteList');
const toCityAutocompleteList = document.getElementById('toCityAutocompleteList');
const dayTypeToggle = document.getElementById('dayTypeToggle');
const cityInputsGroup = document.getElementById('cityInputs');
const travelInputsGroup = document.getElementById('travelInputs');
const cancelDayBtn = document.getElementById('cancelDayBtn');
const clearDayBtn = document.getElementById('clearDayBtn');

const openDayModal = (dateString) => {
    selectedDate = dateString;
    let formattedDateString = formatDateAsText(dateString);
    modalDayTitle.innerHTML = `Planning for<br/><span style="color:blue;">${formattedDateString}</span>`;
    dayModal.style.display = 'flex';
    
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayString = formatDate(prevDay);
    const prevDayData = currentTrip.days[prevDayString];

    let lastCity = '';
    if (prevDayData) {
        lastCity = prevDayData.type === 'travel' ? prevDayData.to.name : prevDayData.city.name;
    }
    
    cityInput.value = lastCity;
    fromCityInput.value = lastCity;
    toCityInput.value = '';

    const dayData = currentTrip.days[dateString];
    if (dayData && dayData.type === 'travel') {
        dayTypeToggle.checked = true;
        modalContent.classList.add('travel-mode');
        fromCityInput.value = dayData.from.name;
        toCityInput.value = dayData.to.name;
        setTimeout(() => fromCityInput.focus(), 100);
    } else {
        dayTypeToggle.checked = false;
        modalContent.classList.remove('travel-mode');
        if (dayData) {
            cityInput.value = dayData.city.name;
        }
        setTimeout(() => cityInput.focus(), 100);
    }
};

const closeDayModal = () => {
    dayModal.style.display = 'none';
};

const handleAutocomplete = (inputEl, listEl) => {
    const query = inputEl.value.toLowerCase();
    listEl.innerHTML = '';
    if (query.length < 2) return;

    const filteredCities = EUROPEAN_CITIES.filter(city => 
        city.name.toLowerCase().includes(query)
    );

    filteredCities.forEach((city, index) => {
        const li = document.createElement('li');
        li.textContent = city.name;
        if (index === 0) li.classList.add('active-item');
        li.addEventListener('click', () => {
            inputEl.value = city.name;
            inputEl.dataset.lat = city.lat;
            inputEl.dataset.lng = city.lng;
            listEl.innerHTML = '';
        });
        listEl.appendChild(li);
    });
};

const setupAutocompleteNavigation = (inputEl, listEl) => {
    inputEl.addEventListener('keydown', (e) => {
        const items = listEl.querySelectorAll('li');
        if (items.length === 0) return;

        const activeItem = listEl.querySelector('.active-item');
        let newActiveItem = null;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeItem && activeItem.nextElementSibling) {
                newActiveItem = activeItem.nextElementSibling;
            } else {
                newActiveItem = items[0];
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeItem && activeItem.previousElementSibling) {
                newActiveItem = activeItem.previousElementSibling;
            } else {
                newActiveItem = items[items.length - 1];
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeItem) {
                activeItem.click();
            }
        }

        if (newActiveItem) {
            if (activeItem) activeItem.classList.remove('active-item');
            newActiveItem.classList.add('active-item');
        }
    });
};

// --- EVENT LISTENERS ---
document.getElementById('createTripBtn').addEventListener('click', createNewTrip);
document.getElementById('backToDashboardBtn').addEventListener('click', renderDashboard);
document.getElementById('generateMapBtn').addEventListener('click', generateMap);

document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('saveDayBtn').addEventListener('click', () => {
    const isTravelDay = dayTypeToggle.checked;
    let data = {};

    if (isTravelDay) {
        const fromCity = EUROPEAN_CITIES.find(c => c.name === fromCityInput.value);
        const toCity = EUROPEAN_CITIES.find(c => c.name === toCityInput.value);
        if (!fromCity || !toCity) {
            alert('Please select valid From and To cities.');
            return;
        }
        data = {
            type: 'travel',
            from: { name: fromCity.name, lat: fromCity.lat, lng: fromCity.lng },
            to: { name: toCity.name, lat: toCity.lat, lng: toCity.lng }
        };
    } else {
        const city = EUROPEAN_CITIES.find(c => c.name === cityInput.value);
        if (!city) {
            alert('Please select a valid city.');
            return;
        }
        data = {
            type: 'stay',
            city: { name: city.name, lat: city.lat, lng: city.lng }
        };
    }
    saveDayData(selectedDate, data);
    closeDayModal();
});

dayTypeToggle.addEventListener('change', () => {
    modalContent.classList.toggle('travel-mode');
});

document.querySelector('.close-btn').addEventListener('click', closeDayModal);

cancelDayBtn.addEventListener('click', closeDayModal);

clearDayBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data for this day?')) {
        clearDayData(selectedDate);
        closeDayModal();
    }
});

window.addEventListener('click', (event) => {
    if (event.target === dayModal) {
        closeDayModal();
    }
});

cityInput.addEventListener('input', () => handleAutocomplete(cityInput, cityAutocompleteList));
fromCityInput.addEventListener('input', () => handleAutocomplete(fromCityInput, fromCityAutocompleteList));
toCityInput.addEventListener('input', () => handleAutocomplete(toCityInput, toCityAutocompleteList));

setupAutocompleteNavigation(cityInput, cityAutocompleteList);
setupAutocompleteNavigation(fromCityInput, fromCityAutocompleteList);
setupAutocompleteNavigation(toCityInput, toCityAutocompleteList);

// Initial render
renderDashboard();
