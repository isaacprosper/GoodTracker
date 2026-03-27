// ==========================================
// GLOBAL EXPRESS - FAKE TRACKING SYSTEM
// ==========================================

// Pre-made fake packages with realistic data
let packages = JSON.parse(localStorage.getItem('gex_packages')) || [
    {
        id: 'GEX784321',
        customer: 'Michael Johnson',
        status: 'transit',
        currentLocation: 'Memphis, TN',
        destination: 'New York, NY',
        origin: 'Los Angeles, CA',
        estimatedDelivery: '2024-10-28',
        deliveryTime: 'By 8:00 PM',
        weight: '4.2',
        service: 'Express Saver',
        shipDate: 'Oct 24, 2024',
        progress: 65,
        history: [
            { time: 'Oct 24, 8:15 AM', location: 'Los Angeles, CA', status: 'Picked Up', completed: true, note: 'Package received at origin facility' },
            { time: 'Oct 24, 6:42 PM', location: 'Los Angeles, CA', status: 'Departed Facility', completed: true, note: 'Left origin facility' },
            { time: 'Oct 25, 2:30 AM', location: 'Phoenix, AZ', status: 'Arrived at Hub', completed: true, note: 'Package processed at regional hub' },
            { time: 'Oct 25, 5:15 AM', location: 'Phoenix, AZ', status: 'Departed Hub', completed: true, note: 'In transit to next facility' },
            { time: 'Oct 25, 2:45 PM', location: 'Memphis, TN', status: 'Arrived at Facility', completed: true, note: 'Package at national distribution center' },
            { time: 'Oct 25, 4:20 PM', location: 'Memphis, TN', status: 'In Transit', completed: false, note: 'On schedule for next destination' }
        ],
        route: [
            { city: 'Los Angeles', time: 'Oct 24', completed: true },
            { city: 'Phoenix', time: 'Oct 25', completed: true },
            { city: 'Memphis', time: 'Oct 25', completed: true },
            { city: 'New York', time: 'Oct 28', completed: false }
        ]
    },
    {
        id: 'GEX784322',
        customer: 'Sarah Williams',
        status: 'delivered',
        currentLocation: 'Delivered - Front Porch',
        destination: 'Chicago, IL',
        origin: 'Miami, FL',
        estimatedDelivery: 'Delivered',
        deliveryTime: 'Oct 24 at 2:30 PM',
        weight: '2.1',
        service: 'Overnight',
        shipDate: 'Oct 23, 2024',
        progress: 100,
        history: [
            { time: 'Oct 23, 4:00 PM', location: 'Miami, FL', status: 'Picked Up', completed: true, note: 'Package received' },
            { time: 'Oct 23, 9:30 PM', location: 'Atlanta, GA', status: 'Departed Hub', completed: true, note: 'In transit to destination' },
            { time: 'Oct 24, 6:00 AM', location: 'Chicago, IL', status: 'Arrived at Facility', completed: true, note: 'Package at local facility' },
            { time: 'Oct 24, 8:15 AM', location: 'Chicago, IL', status: 'Out for Delivery', completed: true, note: 'With delivery courier' },
            { time: 'Oct 24, 2:30 PM', location: 'Chicago, IL', status: 'Delivered', completed: true, note: 'Left at front porch' }
        ],
        route: [
            { city: 'Miami', time: 'Oct 23', completed: true },
            { city: 'Atlanta', time: 'Oct 23', completed: true },
            { city: 'Chicago', time: 'Oct 24', completed: true }
        ]
    },
    {
        id: 'GEX784323',
        customer: 'David Chen',
        status: 'pending',
        currentLocation: 'Awaiting Pickup - Seattle, WA',
        destination: 'Boston, MA',
        origin: 'Seattle, WA',
        estimatedDelivery: '2024-10-30',
        deliveryTime: 'By 6:00 PM',
        weight: '8.5',
        service: 'Ground',
        shipDate: 'Pending',
        progress: 10,
        history: [
            { time: 'Oct 25, 10:00 AM', location: 'Seattle, WA', status: 'Label Created', completed: true, note: 'Shipper created label, awaiting pickup' }
        ],
        route: [
            { city: 'Seattle', time: 'Oct 25', completed: true },
            { city: 'Denver', time: 'Oct 27', completed: false },
            { city: 'Boston', time: 'Oct 30', completed: false }
        ]
    }
];

// Status configurations
const statusConfig = {
    pending: { label: 'Pending', subtext: 'Awaiting pickup from shipper', icon: 'fa-clipboard-list', color: '#ffc107' },
    picked: { label: 'Picked Up', subtext: 'Package collected', icon: 'fa-box', color: '#17a2b8' },
    facility: { label: 'At Facility', subtext: 'Being processed', icon: 'fa-warehouse', color: '#17a2b8' },
    transit: { label: 'In Transit', subtext: 'On schedule for delivery', icon: 'fa-truck-moving', color: '#FF6600' },
    local: { label: 'At Local Facility', subtext: 'Preparing for delivery', icon: 'fa-building', color: '#17a2b8' },
    out: { label: 'Out for Delivery', subtext: 'With delivery courier', icon: 'fa-shipping-fast', color: '#28a745' },
    delivered: { label: 'Delivered', subtext: 'Package delivered', icon: 'fa-check-circle', color: '#28a745' }
};

// Location options for each status
const locationOptions = {
    pending: ['Awaiting Pickup - Los Angeles, CA', 'Awaiting Pickup - Seattle, WA', 'Awaiting Pickup - Miami, FL', 'Label Created - New York, NY'],
    picked: ['Picked Up - Los Angeles, CA', 'Picked Up - Chicago, IL', 'Picked Up - Dallas, TX', 'Origin Facility - Atlanta, GA'],
    facility: ['Los Angeles Hub, CA', 'Memphis Distribution Center, TN', 'Chicago Facility, IL', 'Dallas Hub, TX', 'Phoenix Sorting Center, AZ'],
    transit: ['In Transit - En Route to Memphis', 'In Transit - En Route to Chicago', 'In Transit - En Route to New York', 'Departed Memphis Hub'],
    local: ['Local Facility - New York, NY', 'Local Facility - Boston, MA', 'Local Facility - Chicago, IL', 'Local Facility - Seattle, WA'],
    out: ['Out for Delivery - New York, NY', 'Out for Delivery - Los Angeles, CA', 'Out for Delivery - Chicago, IL'],
    delivered: ['Delivered - Front Porch', 'Delivered - Left with Receptionist', 'Delivered - Side Door', 'Delivered - Garage']
};

// ==========================================
// CUSTOMER FUNCTIONS
// ==========================================

function trackPackage() {
    const input = document.getElementById('trackingInput').value.trim().toUpperCase();
    const pkg = packages.find(p => p.id === input);
    
    if (pkg) {
        showResults(pkg);
    } else {
        document.getElementById('resultsArea').classList.add('hidden');
        document.getElementById('notFound').classList.remove('hidden');
    }
}

function showResults(pkg) {
    const config = statusConfig[pkg.status];
    
    // Update status banner
    document.getElementById('mainStatus').textContent = config.label;
    document.getElementById('statusSubtext').textContent = config.subtext;
    document.getElementById('statusIcon').className = 'fas ' + config.icon;
    document.getElementById('statusBanner').style.borderLeftColor = config.color;
    document.getElementById('statusIcon').parentElement.style.background = config.color + '20';
    document.getElementById('statusIcon').parentElement.style.color = config.color;
    
    // Update delivery info
    document.getElementById('estDate').textContent = pkg.estimatedDelivery;
    document.getElementById('estTime').textContent = pkg.deliveryTime;
    
    // Update location card
    document.getElementById('currentLoc').textContent = pkg.currentLocation;
    
    // Update details
    document.getElementById('detailTracking').textContent = pkg.id;
    document.getElementById('detailWeight').textContent = pkg.weight + ' lbs';
    document.getElementById('shipDate').textContent = pkg.shipDate;
    
    // Build route visualization
    const routeContainer = document.getElementById('routeStops');
    routeContainer.innerHTML = '';
    document.getElementById('routeProgress').style.width = pkg.progress + '%';
    
    pkg.route.forEach((stop, index) => {
        const div = document.createElement('div');
        div.className = 'route-stop ' + (stop.completed ? 'completed' : '') + (index === pkg.route.findIndex(s => !s.completed) && !stop.completed ? ' active' : '');
        div.innerHTML = `
            <div class="stop-dot"></div>
            <div class="stop-city">${stop.city}</div>
            <div class="stop-time">${stop.time}</div>
        `;
        routeContainer.appendChild(div);
    });
    
    // Build timeline
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    pkg.history.slice().reverse().forEach((event, index) => {
        const div = document.createElement('div');
        div.className = 'timeline-item ' + (event.completed ? 'completed' : 'current');
        div.innerHTML = `
            <div class="timeline-marker">
                <i class="fas ${event.completed ? 'fa-check' : 'fa-truck'}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-status">${event.status}</div>
                <div class="timeline-location">${event.location}</div>
                <div class="timeline-time">${event.time} • ${event.note}</div>
            </div>
        `;
        timeline.appendChild(div);
    });
    
    // Show results
    document.getElementById('notFound').classList.add('hidden');
    document.getElementById('resultsArea').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('resultsArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetSearch() {
    document.getElementById('trackingInput').value = '';
    document.getElementById('notFound').classList.add('hidden');
    document.getElementById('trackingInput').focus();
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

function checkLogin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === 'admin2024') {
        localStorage.setItem('gex_admin', 'true');
        showDashboard();
    } else {
        document.getElementById('loginError').textContent = 'Invalid access code';
    }
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    updateStats();
    loadShipments();
    updateLocations();
}

function logout() {
    localStorage.removeItem('gex_admin');
    location.reload();
}

// Auto-login check
if (document.getElementById('adminDashboard')) {
    if (localStorage.getItem('gex_admin') === 'true') {
        showDashboard();
    }
}

function updateStats() {
    document.getElementById('statTotal').textContent = packages.length;
    document.getElementById('statTransit').textContent = packages.filter(p => p.status === 'transit' || p.status === 'out').length;
    document.getElementById('statDelivered').textContent = packages.filter(p => p.status === 'delivered').length;
}

function updateLocations() {
    const status = document.getElementById('newStatus').value;
    const select = document.getElementById('newLocation');
    select.innerHTML = '';
    locationOptions[status].forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        select.appendChild(opt);
    });
}

function createShipment(e) {
    e.preventDefault();
    
    const id = document.getElementById('newTracking').value.toUpperCase();
    const status = document.getElementById('newStatus').value;
    const location = document.getElementById('newLocation').value;
    const destination = document.getElementById('newDestination').value;
    
    // Generate fake route based on origin/destination
    const route = generateFakeRoute(location, destination, status);
    
    const newPkg = {
        id: id,
        customer: document.getElementById('newCustomer').value,
        status: status,
        currentLocation: location,
        destination: destination,
        origin: location.includes('Awaiting') ? location.replace('Awaiting Pickup - ', '') : location,
        estimatedDelivery: document.getElementById('newDelivery').value,
        deliveryTime: 'By 8:00 PM',
        weight: document.getElementById('newWeight').value,
        service: document.getElementById('newService').value,
        shipDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        progress: calculateProgress(status),
        history: generateHistory(status, location),
        route: route
    };
    
    packages.push(newPkg);
    savePackages();
    
    // Show tracking link
    const link = `${window.location.origin}/index.html?track=${id}`;
    alert(`Shipment Created!\n\nTracking Number: ${id}\n\nCustomer tracking link:\n${link}\n\n(Copied to clipboard if allowed)`);
    
    // Try to copy
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link);
    }
    
    e.target.reset();
    updateStats();
    loadShipments();
}

function generateFakeRoute(origin, destination, status) {
    // Simple fake route generator
    const cities = ['Los Angeles', 'Phoenix', 'Memphis', 'Chicago', 'New York', 'Dallas', 'Atlanta', 'Denver', 'Seattle', 'Miami', 'Boston'];
    const originCity = origin.split(',')[0].replace('Awaiting Pickup - ', '').replace('Picked Up - ', '');
    const destCity = destination.split(',')[0];
    
    let route = [{ city: originCity, time: 'Today', completed: true }];
    
    if (status !== 'pending' && status !== 'picked') {
        route.push({ city: 'Transit Hub', time: 'Tomorrow', completed: ['facility', 'transit', 'local', 'out', 'delivered'].includes(status) });
    }
    
    if (['local', 'out', 'delivered'].includes(status)) {
        route.push({ city: destCity, time: 'Est. Delivery', completed: status === 'delivered' });
    } else {
        route.push({ city: destCity, time: 'Est. Delivery', completed: false });
    }
    
    return route;
}

function generateHistory(status, location) {
    const now = new Date();
    const time = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    let history = [];
    
    if (status === 'pending') {
        history.push({ time: time, location: location.replace('Awaiting Pickup - ', ''), status: 'Label Created', completed: true, note: 'Shipper created label, awaiting pickup' });
    } else if (status === 'picked') {
        history.push({ time: time, location: location.replace('Picked Up - ', ''), status: 'Picked Up', completed: true, note: 'Package collected from shipper' });
    } else if (status === 'facility') {
        history.push({ time: time, location: location, status: 'Arrived at Facility', completed: true, note: 'Package being processed' });
    } else if (status === 'transit') {
        history.push({ time: time, location: location, status: 'In Transit', completed: false, note: 'On schedule for next destination' });
    } else if (status === 'local') {
        history.push({ time: time, location: location, status: 'Arrived at Local Facility', completed: true, note: 'Preparing for delivery' });
    } else if (status === 'out') {
        history.push({ time: time, location: location.replace('Out for Delivery - ', ''), status: 'Out for Delivery', completed: false, note: 'With delivery courier' });
    } else if (status === 'delivered') {
        history.push({ time: time, location: location.replace('Delivered - ', ''), status: 'Delivered', completed: true, note: 'Package delivered successfully' });
    }
    
    return history;
}

function calculateProgress(status) {
    const progress = { pending: 10, picked: 25, facility: 40, transit: 60, local: 75, out: 90, delivered: 100 };
    return progress[status] || 10;
}

function loadShipments() {
    const container = document.getElementById('shipmentsList');
    container.innerHTML = '';
    
    packages.forEach(pkg => {
        const div = document.createElement('div');
        div.className = 'shipment-row';
        div.innerHTML = `
            <div class="shipment-info">
                <strong>${pkg.id}</strong>
                <span>${pkg.customer} • ${statusConfig[pkg.status].label} • ${pkg.currentLocation}</span>
            </div>
            <div class="shipment-actions">
                <button class="btn-update" onclick="quickUpdate('${pkg.id}')">Update</button>
                <button class="btn-delete" onclick="deleteShipment('${pkg.id}')">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function quickUpdate(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    
    document.getElementById('quickId').value = id;
    document.getElementById('quickStatus').value = pkg.status;
    updateQuickLocations();
    document.getElementById('quickLocation').value = pkg.currentLocation;
    document.getElementById('quickModal').classList.remove('hidden');
}

function updateQuickLocations() {
    const status = document.getElementById('quickStatus').value;
    const select = document.getElementById('quickLocation');
    select.innerHTML = '';
    locationOptions[status].forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        select.appendChild(opt);
    });
}

function closeQuickModal() {
    document.getElementById('quickModal').classList.add('hidden');
}

function saveQuickUpdate() {
    const id = document.getElementById('quickId').value;
    const pkg = packages.find(p => p.id === id);
    
    if (pkg) {
        const oldStatus = pkg.status;
        pkg.status = document.getElementById('quickStatus').value;
        pkg.currentLocation = document.getElementById('quickLocation').value;
        pkg.progress = calculateProgress(pkg.status);
        
        // Add history entry
        const now = new Date();
        const time = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        pkg.history.push({
            time: time,
            location: pkg.currentLocation.replace(/(Awaiting Pickup|Picked Up|Out for Delivery|Delivered) - /, ''),
            status: statusConfig[pkg.status].label,
            completed: pkg.status === 'delivered',
            note: document.getElementById('quickNote').value || 'Status updated'
        });
        
        // Update route
        if (pkg.status === 'delivered') {
            pkg.route[pkg.route.length - 1].completed = true;
            pkg.estimatedDelivery = 'Delivered';
            pkg.deliveryTime = time;
        }
        
        savePackages();
        updateStats();
        loadShipments();
        closeQuickModal();
        
        alert(`Shipment ${id} updated successfully!`);
    }
}

function deleteShipment(id) {
    if (confirm('Delete this shipment permanently?')) {
        packages = packages.filter(p => p.id !== id);
        savePackages();
        updateStats();
        loadShipments();
    }
}

function searchShipments() {
    const term = document.getElementById('searchShipments').value.toLowerCase();
    const rows = document.querySelectorAll('.shipment-row');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? 'flex' : 'none';
    });
}

function savePackages() {
    localStorage.setItem('gex_packages', JSON.stringify(packages));
}

// Auto-track from URL
if (document.getElementById('trackingInput')) {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('track');
    if (trackId) {
        document.getElementById('trackingInput').value = trackId;
        trackPackage();
    }
    
    // Enter key
    document.getElementById('trackingInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') trackPackage();
    });
}