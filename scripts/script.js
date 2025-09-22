// Import Firebase modules. These are globally available in the canvas environment.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

// Global variables for Firebase and app state
let app;
let db;
let auth;
let userId = null;
let currentDate = new Date();
let selectedDate = null;
let modalMode = 'single';
let mapInstance = null; // To hold the Leaflet map instance

// Hardcoded city coordinates for demonstration. In a real app, this would come from a geocoding API.
const cityCoordinates = {
    "London": { lat: 51.5072, lng: -0.1276 },
    "Paris": { lat: 48.8566, lng: 2.3522 },
    "Berlin": { lat: 52.5200, lng: 13.4050 },
    "Rome": { lat: 41.9028, lng: 12.4964 },
    "Madrid": { lat: 40.4168, lng: -3.7038 },
    "Vienna": { lat: 48.2082, lng: 16.3738 },
    "Prague": { lat: 50.0755, lng: 14.4378 },
    "Amsterdam": { lat: 52.3676, lng: 4.9041 },
    "Lisbon": { lat: 38.7223, lng: -9.1393 },
    "Athens": { lat: 37.9838, lng: 23.7275 },
    "Dublin": { lat: 53.3498, lng: -6.2603 },
    "Brussels": { lat: 50.8503, lng: 4.3517 },
    "Copenhagen": { lat: 55.6761, lng: 12.5683 },
    "Helsinki": { lat: 60.1695, lng: 24.9354 },
    "Budapest": { lat: 47.4979, lng: 19.0402 },
    "Warsaw": { lat: 52.2297, lng: 21.0122 },
    "Oslo": { lat: 59.9139, lng: 10.7522 },
    "Stockholm": { lat: 59.3293, lng: 18.0686 },
    "Zurich": { lat: 47.3769, lng: 8.5417 },
    "Reykjavik": { lat: 64.1265, lng: -21.8174 },
    "Moscow": { lat: 55.7558, lng: 37.6173 },
    "Kyiv": { lat: 50.4501, lng: 30.5234 },
    "Istanbul": { lat: 41.0082, lng: 28.9784 },
    "Geneva": { lat: 46.2044, lng: 6.1432 },
    "Edinburgh": { lat: 55.9533, lng: -3.1883 }
};

// Get DOM elements
const initialLoader = document.getElementById('initialLoader');
const monthYearEl = document.getElementById('monthYear');
const calendarDaysEl = document.getElementById('calendar-days');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cityModal = document.getElementById('cityModal');
const cityModalContent = document.getElementById('city-modal-content');
const modalDateEl = document.getElementById('modalDate');
const singleModeBtn = document.getElementById('singleModeBtn');
const travelModeBtn = document.getElementById('travelModeBtn');
const singleModeContent = document.getElementById('singleModeContent');
const travelModeContent = document.getElementById('travelModeContent');
const cityInput = document.getElementById('cityInput');
const fromCityInput = document.getElementById('fromCityInput');
const toCityInput = document.getElementById('toCityInput');
const saveCityBtn = document.getElementById('saveCityBtn');
const saveText = document.getElementById('saveText');
const saveSpinner = document.getElementById('saveSpinner');
const closeCityModalBtn = document.getElementById('closeCityModalBtn');
const clearBtn = document.getElementById('clearBtn');
const generateMapBtn = document.getElementById('generateMapBtn');
const mapModal = document.getElementById('mapModal');
const mapModalContent = document.getElementById('map-modal-content');
const mapModalLoader = document.getElementById('mapModalLoader');
const closeMapModalBtn = document.getElementById('closeMapModalBtn');
const mapEl = document.getElementById('map');


// Function to initialize Firebase and authenticate the user
async function initializeAppAndListeners() {
    try {
        // Show initial loading spinner
        initialLoader.classList.remove('hidden');

        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Sign in with the provided custom token or anonymously if no token exists
        onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    userId = user.uid;
                    console.log("Authenticated user:", userId);
                    setupFirestoreListener();
                } else {
                    // Sign in anonymously if no user is found
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase authentication state change failed:", error);
            } finally {
                // Hide the initial loader once authenticated
                initialLoader.classList.add('hidden');
            }
        });
    } catch (error) {
        console.error("Firebase initialization or authentication failed:", error);
        initialLoader.classList.add('hidden');
    }

    // Event Listeners (moved inside this function to ensure they are set up after the DOM is ready)
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    singleModeBtn.addEventListener('click', () => setModalMode('single'));
    travelModeBtn.addEventListener('click', () => setModalMode('travel'));
    saveCityBtn.addEventListener('click', saveCity);
    clearBtn.addEventListener('click', clearCity);
    closeCityModalBtn.addEventListener('click', closeCityModal);
    cityModal.addEventListener('click', (e) => {
        if (e.target === cityModal) {
            closeCityModal();
        }
    });

    generateMapBtn.addEventListener('click', openMapModal);
    closeMapModalBtn.addEventListener('click', closeMapModal);

    // Initial render of the calendar grid (without data)
    renderCalendar();

    // Add a global event listener for the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !cityModal.classList.contains('hidden')) {
            closeCityModal();
        }
    });
}

// Function to set up the real-time listener for Firestore data
function setupFirestoreListener() {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const collectionPath = `/artifacts/${appId}/users/${userId}/calendar_data`;
    const dataCollection = collection(db, collectionPath);
    
    onSnapshot(dataCollection, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            const docData = change.doc.data();
            const date = change.doc.id;
            if (change.type === "added" || change.type === "modified") {
                updateCalendarDay(date, docData);
            } else if (change.type === "removed") {
                updateCalendarDay(date, null);
            }
        });
    });
}

// Helper function to unselect all days
function unselectAllDays() {
    document.querySelectorAll('.day-box').forEach(dayBox => {
        dayBox.classList.remove('selected-day-box');
        dayBox.removeAttribute('data-selected');
        dayBox.setAttribute('tabindex', '-1');
    });
}

// Function to render the calendar grid for a given month and year
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    calendarDaysEl.innerHTML = ''; // Clear previous days

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    // Add leading empty day boxes for the previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day-box', 'other-month', 'empty');
        calendarDaysEl.prepend(dayBox); // Prepend to add from right to left
    }

    // Add day boxes for the current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day-box');
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dayBox.dataset.date = date;
        dayBox.setAttribute('tabindex', '-1'); // Days are not tabbable by default
        
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('text-xl', 'font-semibold', 'text-gray-800');
        dayNumber.textContent = i;
        dayBox.appendChild(dayNumber);

        dayBox.addEventListener('click', () => openCityModal(date));
        calendarDaysEl.appendChild(dayBox);
    }

    // Add trailing empty day boxes for the next month
    const totalCells = firstDayOfMonth + daysInMonth;
    const trailingCells = 7 - (totalCells % 7);
    if (trailingCells < 7) {
        for (let i = 1; i <= trailingCells; i++) {
            const dayBox = document.createElement('div');
            dayBox.classList.add('day-box', 'other-month', 'empty');
            calendarDaysEl.appendChild(dayBox);
        }
    }
    
    // Initially select the first day of the current month
    const firstDayBox = calendarDaysEl.querySelector('.day-box:not(.empty)');
    if(firstDayBox) {
        unselectAllDays(); // Ensure no other days are selected
        firstDayBox.classList.add('selected-day-box');
        firstDayBox.dataset.selected = 'true';
        firstDayBox.setAttribute('tabindex', '0'); // Make the selected day tabbable
        firstDayBox.focus(); // Set initial focus
    }
    
    setupKeyboardNavigation();
}

// Function to update a single calendar day with data
function updateCalendarDay(date, cityData) {
    const dayBox = document.querySelector(`.day-box[data-date='${date}']`);
    if (!dayBox) return;

    // Clear any existing content except for the day number
    const existingContent = dayBox.querySelector('.travel-label') || dayBox.querySelector('.text-xs');
    if (existingContent) {
        existingContent.remove();
    }

    if (!cityData) {
        return; // No data to add, just clear the cell
    }
    
    if (cityData.city && cityData.city.name) {
        // Single city with blue background
        const cityText = document.createElement('div');
        cityText.classList.add('text-xs', 'bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded-full', 'mt-2', 'font-medium', 'break-words', 'inline-block');
        cityText.textContent = cityData.city.name;
        dayBox.appendChild(cityText);
    } else if (cityData.from && cityData.to && cityData.from.name && cityData.to.name) {
        // Travel from/to with arrow icons
        const travelContainer = document.createElement('div');
        travelContainer.classList.add('flex', 'flex-col', 'items-start', 'mt-2', 'font-medium', 'w-full');

        // From City with right arrow
        const fromDiv = document.createElement('div');
        fromDiv.classList.add('travel-label', 'bg-blue-300');
        fromDiv.innerHTML = `<span>${cityData.from.name}</span><svg xmlns="http://www.w3.org/2000/svg" class="travel-icon ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>`;
        travelContainer.appendChild(fromDiv);

        // To City with right arrow
        const toDiv = document.createElement('div');
        toDiv.classList.add('travel-label', 'bg-blue-500', 'mt-1');
        toDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="travel-icon mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg><span>${cityData.to.name}</span>`;
        travelContainer.appendChild(toDiv);

        dayBox.appendChild(travelContainer);
    }
}


// Function to show the city modal and set the selected date
function openCityModal(date) {
    unselectAllDays();
    
    const dayBox = document.querySelector(`.day-box[data-date='${date}']`);
    if (dayBox) {
        dayBox.classList.add('selected-day-box');
        dayBox.dataset.selected = 'true';
        dayBox.setAttribute('tabindex', '0');
        dayBox.focus();
    }

    selectedDate = date;
    modalDateEl.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const hasData = dayBox && (dayBox.querySelector('.travel-label') || dayBox.querySelector('.text-xs'));

    // Clear input fields initially
    cityInput.value = '';
    fromCityInput.value = '';
    toCityInput.value = '';

    if (hasData) {
        // Pre-populate with existing data
        const isTravel = dayBox.querySelector('.travel-label') !== null;
        if (isTravel) {
            setModalMode('travel');
            fromCityInput.value = dayBox.querySelectorAll('.travel-label')[0]?.textContent.trim();
            toCityInput.value = dayBox.querySelectorAll('.travel-label')[1]?.textContent.trim();
        } else {
            setModalMode('single');
            cityInput.value = dayBox.querySelector('.text-xs')?.textContent.trim();
        }
    } else {
        // Pre-populate 'from' for new travel plans
        const selectedDay = new Date(date);
        const previousDay = new Date(selectedDay);
        previousDay.setDate(selectedDay.getDate() - 1);
        const prevDateKey = previousDay.toISOString().slice(0, 10);
        
        const prevDayBox = document.querySelector(`.day-box[data-date='${prevDateKey}']`);
        let prepopulatedFrom = '';
        if (prevDayBox) {
            const prevCityText = prevDayBox.querySelector('.text-xs');
            const prevTravelTo = prevDayBox.querySelectorAll('.travel-label')[1];
            if (prevCityText) {
                prepopulatedFrom = prevCityText.textContent.trim();
            } else if (prevTravelTo) {
                prepopulatedFrom = prevTravelTo.textContent.trim();
            }
        }
        
        // Set the default mode and pre-populate
        setModalMode('single'); // Set to single mode by default
        cityInput.value = prepopulatedFrom;
        fromCityInput.value = prepopulatedFrom; // This will show in the travel tab
    }

    cityModal.classList.remove('hidden');
    setTimeout(() => {
        cityModalContent.classList.remove('scale-95', 'opacity-0');
        cityModalContent.classList.add('scale-100', 'opacity-100');
        cityInput.focus();
    }, 10);
}

// Function to hide the city modal
function closeCityModal() {
    cityModalContent.classList.remove('scale-100', 'opacity-100');
    cityModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        cityModal.classList.add('hidden');
        // Re-focus the currently selected day after the modal closes
        const selectedDay = document.querySelector('[data-selected="true"]');
        if (selectedDay) {
            selectedDay.focus();
        }
    }, 300);
}

// Function to switch modal views
function setModalMode(mode) {
    modalMode = mode;
    if (mode === 'single') {
        singleModeBtn.classList.add('bg-white', 'shadow-md');
        travelModeBtn.classList.remove('bg-white', 'shadow-md');
        singleModeContent.classList.remove('hidden');
        travelModeContent.classList.add('hidden');
        cityInput.focus();
    } else {
        travelModeBtn.classList.add('bg-white', 'shadow-md');
        singleModeBtn.classList.remove('bg-white', 'shadow-md');
        travelModeContent.classList.remove('hidden');
        singleModeContent.classList.add('hidden');
        fromCityInput.focus();
    }
}

// Function to save the city to Firestore
async function saveCity() {
    if (!userId) {
        console.error("User not authenticated.");
        return;
    }
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const dateDocRef = doc(db, `/artifacts/${appId}/users/${userId}/calendar_data/${selectedDate}`);

    // Show spinner and change button text
    saveText.textContent = "";
    saveSpinner.classList.remove('hidden');

    let dataToSave = {};
    if (modalMode === 'single') {
        const cityName = cityInput.value.trim();
        const coords = cityCoordinates[cityName] || { lat: null, lng: null };
        dataToSave = { city: { name: cityName, lat: coords.lat, lng: coords.lng } };
    } else {
        const fromCityName = fromCityInput.value.trim();
        const toCityName = toCityInput.value.trim();
        const fromCoords = cityCoordinates[fromCityName] || { lat: null, lng: null };
        const toCoords = cityCoordinates[toCityName] || { lat: null, lng: null };
        dataToSave = { 
            from: { name: fromCityName, lat: fromCoords.lat, lng: fromCoords.lng },
            to: { name: toCityName, lat: toCoords.lat, lng: toCoords.lng }
        };
    }

    // Don't save empty data
    if ((modalMode === 'single' && dataToSave.city.name === '') || (modalMode === 'travel' && (dataToSave.from.name === '' || dataToSave.to.name === ''))) {
        closeCityModal();
        // Reset button state
        saveText.textContent = "Save";
        saveSpinner.classList.add('hidden');
        return;
    }

    await setDoc(dateDocRef, dataToSave);
    
    // Reset button state and close modal
    saveText.textContent = "Save";
    saveSpinner.classList.add('hidden');
    closeCityModal();
    // onSnapshot will handle the re-rendering
}

async function clearCity() {
    if (!userId) {
        console.error("User not authenticated.");
        return;
    }
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const dateDocRef = doc(db, `/artifacts/${appId}/users/${userId}/calendar_data/${selectedDate}`);
    await deleteDoc(dateDocRef);
    closeCityModal();
}

// Function to open the map modal and populate it with pins
function openMapModal() {
    mapModal.classList.remove('hidden');
    
    // Start the modal transition
    setTimeout(() => {
        mapModalContent.classList.remove('scale-95', 'opacity-0');
        mapModalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Show loader and hide map container initially
    mapModalLoader.classList.remove('hidden');
    mapEl.classList.add('hidden');

    const allDayBoxes = document.querySelectorAll('.day-box');
    const locationsMap = new Map();
    allDayBoxes.forEach(box => {
        const date = box.dataset.date;
        const isTravel = box.querySelector('.travel-label') !== null;
        const cityText = box.querySelector('.text-xs');
        if (isTravel) {
            const fromCity = box.querySelectorAll('.travel-label')[0]?.textContent.trim();
            const toCity = box.querySelectorAll('.travel-label')[1]?.textContent.trim();
            if (fromCity && cityCoordinates[fromCity]) locationsMap.set(fromCity, cityCoordinates[fromCity]);
            if (toCity && cityCoordinates[toCity]) locationsMap.set(toCity, cityCoordinates[toCity]);
        } else if (cityText) {
            const cityName = cityText.textContent.trim();
            if (cityName && cityCoordinates[cityName]) locationsMap.set(cityName, cityCoordinates[cityName]);
        }
    });

    const uniqueLocations = Array.from(locationsMap.entries()).map(([name, coords]) => ({ name, ...coords }));

    if (uniqueLocations.length === 0) {
        mapEl.innerHTML = '<div class="flex justify-center items-center h-full text-gray-500">No locations saved to display.</div>';
        if(mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }
        mapModalLoader.classList.add('hidden');
        mapEl.classList.remove('hidden');
        return;
    }

    // Clean up existing map before re-initializing
    if (mapInstance) {
        mapInstance.remove();
    }

    // Remove the hidden class on the map container before initializing Leaflet
    mapEl.classList.remove('hidden');

    // Initialize map
    mapInstance = L.map('map').setView([48.8566, 2.3522], 4); // Default to Paris with zoom 4
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    const bounds = [];
    const coordinates = [];
    
    uniqueLocations.forEach((loc, index) => {
        // Create a custom Leaflet marker icon with explicit sizing
        const myIcon = L.divIcon({
            className: 'numbered-marker',
            html: `<div>${index + 1}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        const marker = L.marker([loc.lat, loc.lng], { icon: myIcon }).addTo(mapInstance);
        marker.bindPopup(`<b>${loc.name}</b>`).openPopup();
        bounds.push([loc.lat, loc.lng]);
        coordinates.push([loc.lat, loc.lng]);
    });

    if (coordinates.length > 1) {
        const polyline = L.polyline(coordinates, { color: '#3b82f6', weight: 4, opacity: 0.7 }).addTo(mapInstance);
    }

    if (bounds.length > 0) {
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Force a re-render of the map after it becomes visible
    mapInstance.invalidateSize();

    // Hide the loader after the map has been fully rendered
    mapModalLoader.classList.add('hidden');
}

// Function to hide the map modal
function closeMapModal() {
    mapModalContent.classList.remove('scale-100', 'opacity-100');
    mapModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => mapModal.classList.add('hidden'), 300);
}

// Handle keyboard navigation for the calendar
function setupKeyboardNavigation() {
    calendarDaysEl.addEventListener('keydown', (e) => {
        const selectedDay = calendarDaysEl.querySelector('[data-selected="true"]');
        if (!selectedDay) return;

        const allDayBoxes = Array.from(calendarDaysEl.querySelectorAll('.day-box'));
        const currentIndex = allDayBoxes.indexOf(selectedDay);
        let newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowRight':
                newIndex = currentIndex + 1;
                break;
            case 'ArrowLeft':
                newIndex = currentIndex - 1;
                break;
            case 'ArrowDown':
                newIndex = currentIndex + 7;
                break;
            case 'ArrowUp':
                newIndex = currentIndex - 7;
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedDay.dataset.date) {
                    openCityModal(selectedDay.dataset.date);
                }
                return;
            default:
                return;
        }

        const newDay = allDayBoxes[newIndex];
        if (newDay && !newDay.classList.contains('empty')) {
            unselectAllDays();

            newDay.classList.add('selected-day-box');
            newDay.dataset.selected = 'true';
            newDay.setAttribute('tabindex', '0');
            newDay.focus();
        }
    });
}


initializeAppAndListeners();