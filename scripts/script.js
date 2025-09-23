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
            <img src="https://plus.unsplash.com/premium_photo-1690372791935-3efc879e4ca3?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
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

// --- MAP GENERATION & MODAL ---
const mapModalEl = document.getElementById('mapModal');
const mapSidebarEl = document.getElementById('mapSidebar');
const mapTripNameEl = document.getElementById('mapTripName');
const mapLocationListEl = document.getElementById('mapLocationList');
const sidebarCollapseBtnEl = document.getElementById('sidebarCollapseBtn');
const closeMapBtnEl = document.querySelector('.close-map-btn');
const closeMapSidebarBtnEl = document.getElementById('closeMapSidebarBtn');
let map;
let markers = [];
let polylines = [];
let animatedPolylines = [];

const generateMap = () => {
    mapTripNameEl.textContent = currentTrip.name;

    const dates = Object.keys(currentTrip.days).sort();
    if (dates.length === 0) {
        alert("No itinerary data to generate a map.");
        return;
    }

    const itinerary = dates.map(date => currentTrip.days[date]);
    const locations = [];
    itinerary.forEach(day => {
        if (day.type === 'travel') {
            if (locations.length === 0 || locations[locations.length - 1].name !== day.from.name) {
                locations.push(day.from);
            }
            locations.push(day.to);
        } else {
            if (locations.length === 0 || locations[locations.length - 1].name !== day.city.name) {
                locations.push(day.city);
            }
        }
    });

    // Populate sidebar
    mapLocationListEl.innerHTML = locations.map(loc => `<li>${loc.name}</li>`).join('');
    
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="42" height="54">
                <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" fill="var(--primary-color)"/>
                <text x="14" y="15" font-size="12" font-weight="bold" text-anchor="middle" fill="white">${index + 1}</text>
            </svg>`;

        const customIcon = L.divIcon({
            className: 'day-marker',
            html: iconHtml,
            iconSize: [42, 54],
            iconAnchor: [21, 54]
        });
        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${index + 1}. ${loc.name}</b>`);

        marker.on('mouseover', () => {
            const markerIndex = markers.indexOf(marker);

            // Clear any existing animated polylines
            animatedPolylines.forEach(p => p.remove());
            animatedPolylines = [];

            // Incoming line
            if (markerIndex > 0) {
                const incomingLine = polylines[markerIndex - 1];
                const antPath = L.polyline.antPath(incomingLine.getLatLngs(), {
                    color: 'red',
                    pulseColor: 'white',
                    weight: 5,
                    dashArray: [10, 20],
                    reversed: true, // Arrows move towards the marker
                }).addTo(map);
                animatedPolylines.push(antPath);
            }

            // Outgoing line
            if (markerIndex < polylines.length) {
                const outgoingLine = polylines[markerIndex];
                const antPath = L.polyline.antPath(outgoingLine.getLatLngs(), {
                    color: 'green',
                    pulseColor: 'white',
                    weight: 5,
                    dashArray: [10, 20],
                    reversed: false, // Arrows move away from the marker
                }).addTo(map);
                animatedPolylines.push(antPath);
            }
        });

        marker.on('mouseout', () => {
            animatedPolylines.forEach(p => p.remove());
            animatedPolylines = [];
        });

        markers.push(marker);

        if (index > 0) {
            const prevLoc = locations[index - 1];
            const polyline = L.polyline([[prevLoc.lat, prevLoc.lng], [loc.lat, loc.lng]], { color: 'blue', weight: 3 }).addTo(map);
            polylines.push(polyline);
        }
    });

    if (polylines.length > 0) {
        const bounds = L.featureGroup(markers).getBounds();
        map.fitBounds(bounds);
    }

    // Invalidate map size after a short delay
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
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
const dayTypeToggle = document.getElementById('dayTypeToggle');
const cityInputsGroup = document.getElementById('cityInputs');
const travelInputsGroup = document.getElementById('travelInputs');
const cancelDayBtn = document.getElementById('cancelDayBtn');
const clearDayBtn = document.getElementById('clearDayBtn');

const openDayModal = (dateString) => {
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
