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
    { name: "Oslo", lat: 59.9139, lng: 10.7522 },
    { name: "Warsaw", lat: 52.2297, lng: 21.0122 },
    { name: "Zurich", lat: 47.3769, lng: 8.5417 },
    { name: "Munich", lat: 48.1351, lng: 11.5820 },
    { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
    { name: "Milan", lat: 45.4642, lng: 9.1900 },
    { name: "Venice", lat: 45.4408, lng: 12.3155 },
    { name: "Florence", lat: 43.7699, lng: 11.2556 },
    { name: "Naples", lat: 40.8518, lng: 14.2681 },
    { name: "Seville", lat: 37.3891, lng: -5.9845 },
    { name: "Valencia", lat: 39.4699, lng: -0.3763 },
    { name: "Porto", lat: 41.1579, lng: -8.6291 },
    { name: "Krakow", lat: 50.0647, lng: 19.9450 },
    { name: "Gdansk", lat: 54.3520, lng: 18.6466 },
    { name: "Tallinn", lat: 59.4370, lng: 24.7536 },
    { name: "Riga", lat: 56.9496, lng: 24.1052 },
    { name: "Vilnius", lat: 54.6872, lng: 25.2797 },
    { name: "Ljubljana", lat: 46.0569, lng: 14.5058 },
    { name: "Zagreb", lat: 45.8150, lng: 15.9785 },
    { name: "Sarajevo", lat: 43.8563, lng: 18.4131 },
    { name: "Belgrade", lat: 44.8176, lng: 20.4569 },
    { name: "Sofia", lat: 42.6977, lng: 23.3219 },
    { name: "Bucharest", lat: 44.4268, lng: 26.1025 },
    { name: "Skopje", lat: 41.9981, lng: 21.4254 },
    { name: "Tirana", lat: 41.3275, lng: 19.8189 },
    { name: "Podgorica", lat: 42.4410, lng: 19.2627 },
    { name: "Reykjavik", lat: 64.1355, lng: -21.8954 },
    { name: "Luxembourg City", lat: 49.6117, lng: 6.1319 },
    { name: "Monaco", lat: 43.7384, lng: 7.4246 },
    { name: "San Marino", lat: 43.9336, lng: 12.4508 },
    { name: "Andorra la Vella", lat: 42.5078, lng: 1.5211 },
    { name: "Geneva", lat: 46.2044, lng: 6.1432 },
    { name: "Basel", lat: 47.5596, lng: 7.5886 },
    { name: "Hamburg", lat: 53.5511, lng: 9.9937 },
    { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
    { name: "Cologne", lat: 50.9375, lng: 6.9603 },
    { name: "Dresden", lat: 51.0504, lng: 13.7373 },
    { name: "Leipzig", lat: 51.3397, lng: 12.3731 },
    { name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
    { name: "Nice", lat: 43.7102, lng: 7.2620 },
    { name: "Marseille", lat: 43.2965, lng: 5.3698 },
    { name: "Lyon", lat: 45.7640, lng: 4.8357 },
    { name: "Bordeaux", lat: 44.8378, lng: -0.5792 },
    { name: "Lille", lat: 50.6292, lng: 3.0573 },
    { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
    { name: "Glasgow", lat: 55.8642, lng: -4.2518 },
    { name: "Manchester", lat: 53.4808, lng: -2.2426 },
    { name: "Birmingham", lat: 52.4862, lng: -1.8904 },
    { name: "Liverpool", lat: 53.4084, lng: -2.9916 },
    { name: "Cardiff", lat: 51.4816, lng: -3.1791 },
    { name: "Bristol", lat: 51.4545, lng: -2.5879 },
    { name: "Leeds", lat: 53.8008, lng: -1.5491 }
];

let currentTripId = null;
let currentTrip = null;
let currentDate = new Date(); // State for the currently displayed month
let selectedDate = null; // State for the selected day
let currentView = 'calendar';
let dayCardStartIndex = 0;
let isDayCardListenerAttached = false;
let modalActivities = {
    morning: [],
    afternoon: [],
    evening: []
};

const getTrips = () => {
    const trips = localStorage.getItem('trips');
    return trips ? JSON.parse(trips) : {};
};

const saveTrips = (trips) => {
    localStorage.setItem('trips', JSON.stringify(trips));
};

const deleteTrip = (tripId) => {
    const trips = getTrips();
    delete trips[tripId];
    saveTrips(trips);
};

const renameTrip = (tripId, newName) => {
    const trips = getTrips();
    if (trips[tripId]) {
        trips[tripId].name = newName;
        saveTrips(trips);
    }
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
const calendarWeekdaysEl = document.getElementById('calendarWeekdays');
const calendarNavEl = document.querySelector('.calendar-nav');
const calendarViewBtn = document.getElementById('calendarViewBtn');
const dayByDayViewBtn = document.getElementById('dayByDayViewBtn');
const dayByDayView = document.getElementById('dayByDayView');
const dayCardsContainer = document.getElementById('dayCardsContainer');
const prevDayCardBtn = document.getElementById('prevDayCardBtn');
const nextDayCardBtn = document.getElementById('nextDayCardBtn');

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
            <img src="https://plus.unsplash.com/premium_photo-1690372791935-3efc879e4ca3?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D3D%3D" alt="Trip image">
            <div class="trip-info">
                <span class="trip-name">${trip.name}</span>
            </div>
            <div class="trip-actions">
                <button class="btn btn-sm btn-primary" onclick="openTrip('${id}')">Open</button>
                <button class="btn btn-sm btn-secondary" onclick="handleRenameTrip('${id}', '${trip.name}')">Rename</button>
                <button class="btn btn-sm btn-danger" onclick="handleDeleteTrip('${id}')">Delete</button>
            </div>
        `;
        tripListEl.appendChild(li);
    }
};

const handleDeleteTrip = (tripId) => {
    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
        deleteTrip(tripId);
        renderDashboard();
    }
};

const handleRenameTrip = (tripId, currentName) => {
    const newName = prompt('Enter a new name for your trip:', currentName);
    if (newName && newName.trim() !== '') {
        renameTrip(tripId, newName.trim());
        renderDashboard();
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

    if (!isDayCardListenerAttached) {
        dayCardsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-day-card-btn')) {
                const dateString = e.target.dataset.date;
                if (dateString) {
                    openDayModal(dateString);
                }
            }
        });
        isDayCardListenerAttached = true;
    }

    renderTripView();
    showPage('trip-calendar');
};

const renderTripView = () => {
    if (currentView === 'calendar') {
        calendarGridEl.style.display = 'grid';
        calendarWeekdaysEl.style.display = 'grid';
        calendarNavEl.style.display = 'flex';
        dayByDayView.style.display = 'none';
        renderCalendar();
    } else {
        calendarGridEl.style.display = 'none';
        calendarWeekdaysEl.style.display = 'none';
        calendarNavEl.style.display = 'none';
        dayByDayView.style.display = 'flex';
        renderDayByDayView();
    }
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
        calendarGridEl.appendChild(dayCell);
    }
};

const renderDayByDayView = () => {
    dayCardsContainer.innerHTML = '';
    const tripDays = Object.keys(currentTrip.days).sort();

    if (tripDays.length === 0) {
        dayCardsContainer.innerHTML = '<p>No days planned for this trip yet.</p>';
        prevDayCardBtn.style.display = 'none';
        nextDayCardBtn.style.display = 'none';
        return;
    } else {
        prevDayCardBtn.style.display = 'block';
        nextDayCardBtn.style.display = 'block';
    }

    for (let i = 0; i < 3; i++) {
        const dayIndex = dayCardStartIndex + i;
        const card = document.createElement('div');
        card.className = 'day-card';

        if (dayIndex < tripDays.length) {
            const dateString = tripDays[dayIndex];
            const dayData = currentTrip.days[dateString];
            let content = '';
            if (dayData.type === 'travel') {
                content = `${dayData.travelMode || 'Travel'}: ${dayData.from.name} → ${dayData.to.name}`;
            } else {
                content = dayData.city.name;
            }
            let activitiesHtml = '';
            if (dayData.activities && (dayData.activities.morning.length > 0 || dayData.activities.afternoon.length > 0 || dayData.activities.evening.length > 0)) {
                activitiesHtml += '<div class="day-card-activities">';
                if (dayData.activities.morning.length > 0) {
                    activitiesHtml += '<h6>Morning</h6><ul>';
                    dayData.activities.morning.forEach(act => { activitiesHtml += `<li>${act}</li>`; });
                    activitiesHtml += '</ul>';
                }
                if (dayData.activities.afternoon.length > 0) {
                    activitiesHtml += '<h6>Afternoon</h6><ul>';
                    dayData.activities.afternoon.forEach(act => { activitiesHtml += `<li>${act}</li>`; });
                    activitiesHtml += '</ul>';
                }
                if (dayData.activities.evening.length > 0) {
                    activitiesHtml += '<h6>Evening</h6><ul>';
                    dayData.activities.evening.forEach(act => { activitiesHtml += `<li>${act}</li>`; });
                    activitiesHtml += '</ul>';
                }
                activitiesHtml += '</div>';
            }

            const imageHtml = dayData.imageUrl
                ? `<img src="${dayData.imageUrl}" alt="Trip image" class="day-card-image">`
                : '<div class="day-card-image-placeholder"></div>';

            card.innerHTML = `
                <div class="day-card-image-container">${imageHtml}</div>
                <div class="day-card-body">
                    <div>
                        <div class="day-card-date">${formatDateAsText(dateString)}</div>
                        <div class="day-card-content">${content}</div>
                    </div>
                    ${activitiesHtml}
                    <div class="day-card-actions">
                        <button class="btn btn-sm btn-secondary edit-day-card-btn" data-date="${dateString}">Edit</button>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = ''; // Create an empty card
        }
        dayCardsContainer.appendChild(card);
    }

    // Handle navigation button states
    prevDayCardBtn.disabled = dayCardStartIndex === 0;
    nextDayCardBtn.disabled = dayCardStartIndex >= tripDays.length - 3;
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
    renderTripView();
};

const clearDayData = (dateString) => {
    const trips = getTrips();
    if (trips[currentTripId] && trips[currentTripId].days[dateString]) {
        delete trips[currentTripId].days[dateString];
        saveTrips(trips);
        currentTrip = trips[currentTripId]; // Update the currentTrip state
        renderTripView();
    }
};

// --- MAP GENERATION & MODAL ---
const mapModalEl = document.getElementById('mapModal');
const mapSidebarEl = document.getElementById('mapSidebar');
const mapTripNameEl = document.getElementById('mapTripName');
const mapLocationListEl = document.getElementById('mapLocationList');
const timelineListEl = document.getElementById('timelineList');
const sidebarCollapseBtnEl = document.getElementById('sidebarCollapseBtn');
const closeMapBtnEl = document.querySelector('.close-map-btn');
const closeMapSidebarBtnEl = document.getElementById('closeMapSidebarBtn');
let map;
let markers = [];
let polylines = [];
let animatedPolylines = [];

function getCurvedPoints(latlng1, latlng2) {
    const p1 = { x: latlng1.lat, y: latlng1.lng };
    const p2 = { x: latlng2.lat, y: latlng2.lng };

    const offsetX = p2.x - p1.x;
    const offsetY = p2.y - p1.y;

    const angle = Math.atan2(offsetY, offsetX);
    const distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    const curveAmount = 0.15;

    const mid = { x: p1.x + offsetX / 2, y: p1.y + offsetY / 2 };
    const controlPoint = {
        x: mid.x + (distance * curveAmount) * Math.cos(angle - Math.PI / 2),
        y: mid.y + (distance * curveAmount) * Math.sin(angle - Math.PI / 2)
    };

    const points = [];
    const numPoints = 30; // Number of points to define the curve
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * controlPoint.x + t * t * p2.x;
        const lng = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * controlPoint.y + t * t * p2.y;
        points.push([lat, lng]);
    }
    return points;
}

const generateMap = () => {
    mapTripNameEl.textContent = currentTrip.name;

    const dates = Object.keys(currentTrip.days).sort();
    if (dates.length === 0) {
        alert("No itinerary data to generate a map.");
        return;
    }

    const itinerary = dates.map(date => ({ date, ...currentTrip.days[date] }));
    const locations = [];
    const locationSet = new Set();

    itinerary.forEach(day => {
        if (day.type === 'travel') {
            if (!locationSet.has(day.from.name)) {
                locations.push(day.from);
                locationSet.add(day.from.name);
            }
            if (!locationSet.has(day.to.name)) {
                locations.push(day.to);
                locationSet.add(day.to.name);
            }
        } else {
            if (!locationSet.has(day.city.name)) {
                locations.push(day.city);
                locationSet.add(day.city.name);
            }
        }
    });

    // Populate sidebar
    mapLocationListEl.innerHTML = locations.map(loc => `<li>${loc.name}</li>`).join('');
    
    timelineListEl.innerHTML = itinerary.map(day => {
        const date = new Date(day.date);
        const dateText = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
        let locationText = '';
        let markerIndex = -1;

        if (day.type === 'travel') {
            locationText = `${day.from.name} → ${day.to.name}`;
            markerIndex = locations.findIndex(l => l.name === day.to.name);
        } else {
            locationText = day.city.name;
            markerIndex = locations.findIndex(l => l.name === day.city.name);
        }

        return `<li data-marker-index="${markerIndex}">
                    <div class="timeline-date">${dateText}</div>
                    <div class="timeline-location">${locationText}</div>
                </li>`;
    }).join('');

    // Show modal
    mapModalEl.style.display = 'flex';

    if (map) {
        map.remove();
    }
    map = L.map('fullScreenMap').setView([50, 10], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Clear previous markers and polylines
    markers.forEach(marker => marker.remove());
    polylines.forEach(polyline => polyline.remove());
    markers = [];
    polylines = [];

    locations.forEach((loc, index) => {
        const iconHtml = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="36" height="46">
                <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" fill="var(--primary-color)"/>
                <text x="14" y="14" dominant-baseline="middle" font-size="11" font-weight="bold" text-anchor="middle" fill="white">${index + 1}</text>
            </svg>`;

        const customIcon = L.divIcon({
            className: 'day-marker',
            html: iconHtml,
            iconSize: [36, 46],
            iconAnchor: [18, 46]
        });
        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${index + 1}. ${loc.name}</b>`);

        marker.on('mouseover', () => {
            if (marker._icon) marker._icon.classList.add('marker-hover');
            const markerIndex = markers.indexOf(marker);

            animatedPolylines.forEach(p => p.remove());
            animatedPolylines = [];

            if (markerIndex > 0) {
                const incomingLine = polylines[markerIndex - 1];
                const antPath = L.polyline.antPath(incomingLine.getLatLngs(), {
                    color: 'red',
                    pulseColor: 'white',
                    weight: 5,
                    dashArray: [10, 20],
                    reversed: true,
                }).addTo(map);
                animatedPolylines.push(antPath);
            }

            if (markerIndex < polylines.length) {
                const outgoingLine = polylines[markerIndex];
                const antPath = L.polyline.antPath(outgoingLine.getLatLngs(), {
                    color: 'green',
                    pulseColor: 'white',
                    weight: 5,
                    dashArray: [10, 20],
                    reversed: false,
                }).addTo(map);
                animatedPolylines.push(antPath);
            }
        });

        marker.on('mouseout', () => {
            if (marker._icon) marker._icon.classList.remove('marker-hover');
            animatedPolylines.forEach(p => p.remove());
            animatedPolylines = [];
        });

        markers.push(marker);

        if (index > 0) {
            const prevLoc = locations[index - 1];

            const curvedPoints = getCurvedPoints(
                { lat: prevLoc.lat, lng: prevLoc.lng },
                { lat: loc.lat, lng: loc.lng }
            );

            const polyline = L.polyline(curvedPoints, { color: '#fe7700', weight: 3 }).addTo(map);
            polylines.push(polyline);
        }
    });

    if (polylines.length > 0) {
        const bounds = L.featureGroup(markers).getBounds();
        map.fitBounds(bounds);
    }

    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Add event listeners for timeline hover
    document.querySelectorAll('#timelineList li').forEach(item => {
        item.addEventListener('mouseover', () => {
            const markerIndex = parseInt(item.dataset.markerIndex, 10);
            if (markerIndex >= 0 && markers[markerIndex]) {
                markers[markerIndex].fire('mouseover');
            }
        });
        item.addEventListener('mouseout', () => {
            const markerIndex = parseInt(item.dataset.markerIndex, 10);
            if (markerIndex >= 0 && markers[markerIndex]) {
                markers[markerIndex].fire('mouseout');
            }
        });
    });
};

const closeMapModal = () => {
    mapModalEl.style.display = 'none';
    if (map) {
        map.remove();
        map = null;
    }
};

sidebarCollapseBtnEl.addEventListener('click', () => {
    mapSidebarEl.classList.toggle('collapsed');
});

closeMapBtnEl.addEventListener('click', closeMapModal);
closeMapSidebarBtnEl.addEventListener('click', closeMapModal);


// --- DAY MODAL & AUTOCOMPLETE ---
const dayModal = document.getElementById('dayModal');
const modalContent = dayModal.querySelector('.modal-content');
const modalDayTitle = document.getElementById('modalDayTitle');
const cityInput = document.getElementById('cityInput');
const fromCityInput = document.getElementById('fromCityInput');
const toCityInput = document.getElementById('toCityInput');
const cityAutocompleteList = document.getElementById('cityAutocompleteList');
const fromCityAutocompleteList = document.getElementById('fromCityAutocompleteList');
const toCityAutocompleteList = document.getElementById('toCityAutocompleteList');
const stayBtn = document.getElementById('stayBtn');
const travelBtn = document.getElementById('travelBtn');
const cityInputsGroup = document.getElementById('cityInputs');
const travelInputsGroup = document.getElementById('travelInputs');
const travelModeInput = document.getElementById('travelModeInput');
const cancelDayBtn = document.getElementById('cancelDayBtn');
const clearDayBtn = document.getElementById('clearDayBtn');
const imageUrlInput = document.getElementById('imageUrlInput');

function openDayModal(dateString) {
    selectedDate = dateString;
    let formattedDateString = formatDateAsText(dateString);
    modalDayTitle.innerHTML = `Planning for<br/><span class="date">${formattedDateString}</span>`;
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

    if (dayData && dayData.activities) {
        modalActivities = {
            morning: [...dayData.activities.morning],
            afternoon: [...dayData.activities.afternoon],
            evening: [...dayData.activities.evening]
        };
    } else {
        modalActivities = { morning: [], afternoon: [], evening: [] };
    }
    renderActivityLists();
    ['morning', 'afternoon', 'evening'].forEach(hideActivityForm);

    imageUrlInput.value = (dayData && dayData.imageUrl) ? dayData.imageUrl : '';

    // Close expandable sections by default
    dayModal.querySelectorAll('.modal-expandable .expandable-content').forEach(content => content.style.display = 'none');
    dayModal.querySelectorAll('.modal-expandable .arrow').forEach(arrow => arrow.classList.remove('expanded'));

    if (dayData && dayData.type === 'travel') {
        travelBtn.click(); // Use the button's click handler to set the correct state
        fromCityInput.value = dayData.from.name;
        toCityInput.value = dayData.to.name;
        travelModeInput.value = dayData.travelMode || 'Car';
        setTimeout(() => fromCityInput.focus(), 100);
    } else {
        stayBtn.click(); // Use the button's click handler to set the correct state
        if (dayData) {
            cityInput.value = dayData.city.name;
        }
        setTimeout(() => cityInput.focus(), 100);
    }
};

function closeDayModal() {
    dayModal.style.display = 'none';
}

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
tripCalendarEl.addEventListener('click', (e) => {
    const dayCell = e.target.closest('.day-cell:not(.inactive)');
    if (dayCell) {
        openDayModal(dayCell.dataset.date);
        return;
    }

    const editBtn = e.target.closest('.edit-day-card-btn');
    if (editBtn) {
        openDayModal(editBtn.dataset.date);
        return;
    }
});

document.getElementById('createTripBtn').addEventListener('click', createNewTrip);
document.getElementById('backToDashboardBtn').addEventListener('click', renderDashboard);
document.getElementById('generateMapBtn').addEventListener('click', generateMap);

document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderTripView();
});

document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderTripView();
});

document.getElementById('saveDayBtn').addEventListener('click', () => {
    const isTravelDay = travelBtn.classList.contains('active');
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
            to: { name: toCity.name, lat: toCity.lat, lng: toCity.lng },
            travelMode: travelModeInput.value
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

    data.activities = {
        morning: [...modalActivities.morning],
        afternoon: [...modalActivities.afternoon],
        evening: [...modalActivities.evening]
    };
    data.imageUrl = imageUrlInput.value.trim();

    saveDayData(selectedDate, data);
    closeDayModal();
});

stayBtn.addEventListener('click', () => {
    stayBtn.classList.add('active');
    travelBtn.classList.remove('active');
    cityInputsGroup.style.display = 'block';
    travelInputsGroup.style.display = 'none';
});

travelBtn.addEventListener('click', () => {
    travelBtn.classList.add('active');
    stayBtn.classList.remove('active');
    cityInputsGroup.style.display = 'none';
    travelInputsGroup.style.display = 'block';
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

// --- Sidebar Expand/Collapse ---
document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        if (content) {
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';

            const arrow = header.querySelector('.arrow');
            if (arrow) {
                arrow.classList.toggle('expanded', !isVisible);
            }
        }
    });
});

// --- View Toggles & Day Card Navigation ---
calendarViewBtn.addEventListener('click', () => {
    if (currentView === 'calendar') return;
    currentView = 'calendar';
    calendarViewBtn.classList.add('active');
    dayByDayViewBtn.classList.remove('active');
    renderTripView();
});

dayByDayViewBtn.addEventListener('click', () => {
    if (currentView === 'day-by-day') return;
    currentView = 'day-by-day';
    dayCardStartIndex = 0; // Reset to the start
    dayByDayViewBtn.classList.add('active');
    calendarViewBtn.classList.remove('active');
    renderTripView();
});

prevDayCardBtn.addEventListener('click', () => {
    if (dayCardStartIndex > 0) {
        dayCardStartIndex--;
        renderDayByDayView();
    }
});

nextDayCardBtn.addEventListener('click', () => {
    const tripDays = Object.keys(currentTrip.days);
    if (dayCardStartIndex < tripDays.length - 3) {
        dayCardStartIndex++;
        renderDayByDayView();
    }
});


// --- ACTIVITY MODAL LOGIC ---
const activitiesContainer = document.querySelector('.activities-container');

const renderActivityLists = () => {
    ['morning', 'afternoon', 'evening'].forEach(period => {
        const listEl = document.getElementById(`${period}-activity-list`);
        listEl.innerHTML = '';
        modalActivities[period].forEach((activity, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${activity}</span>
                <button class="btn btn-sm btn-icon delete-activity-btn" data-period="${period}" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            listEl.appendChild(li);
        });
    });
};

const showActivityForm = (period) => {
    document.getElementById(`add-${period}-form`).style.display = 'flex';
    document.querySelector(`.add-activity-btn[data-period=${period}]`).style.display = 'none';
};

const hideActivityForm = (period) => {
    document.getElementById(`add-${period}-form`).style.display = 'none';
    document.getElementById(`${period}-activity-input`).value = '';
    document.querySelector(`.add-activity-btn[data-period=${period}]`).style.display = 'inline-block';
};

activitiesContainer.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-activity-btn');
    const confirmBtn = e.target.closest('.confirm-add-btn');
    const cancelBtn = e.target.closest('.cancel-add-btn');
    const deleteBtn = e.target.closest('.delete-activity-btn');

    if (addBtn) {
        showActivityForm(addBtn.dataset.period);
        return;
    }

    if (confirmBtn) {
        const period = confirmBtn.dataset.period;
        const inputEl = document.getElementById(`${period}-activity-input`);
        const activityText = inputEl.value.trim();
        if (activityText) {
            modalActivities[period].push(activityText);
            renderActivityLists();
        }
        hideActivityForm(period);
        return;
    }

    if (cancelBtn) {
        hideActivityForm(cancelBtn.dataset.period);
        return;
    }

    if (deleteBtn) {
        const { period, index } = deleteBtn.dataset;
        modalActivities[period].splice(index, 1);
        renderActivityLists();
        return;
    }
});

// Initial render
renderDashboard();
