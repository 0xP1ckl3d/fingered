const dataCollection = {};

// Send data to server
function sendDataToServer(data) {
    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log('Data saved:', data));
}

// Initial Data Collection
dataCollection.browserDetails = UAParser(navigator.userAgent);

// Basic browser and device details
dataCollection.basic = {
    screenResolution: window.screen.width + "x" + window.screen.height,
    colorDepth: window.screen.colorDepth,
    timeZoneOffset: new Date().getTimezoneOffset(),
    cookiesEnabled: navigator.cookieEnabled,
    localStorageEnabled: (function () {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    })()
};

dataCollection.webGLData = collectWebGLData();

// Plugins
dataCollection.plugins = Array.from(navigator.plugins).map(p => p.name);

// Audio stack
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
dataCollection.audioData = {
    sampleRate: audioCtx.sampleRate
};

// Touch data
dataCollection.touchData = {
    touchSupport: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints || 0
};

// Network information
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
dataCollection.networkData = {
    type: connection && connection.type,
    effectiveType: connection && connection.effectiveType,
    downlink: connection && connection.downlink,
    rtt: connection && connection.rtt
};

dataCollection.canvasFingerprint = getCanvasFingerprint();

// Browser settings & preferences
dataCollection.settings = {
    doNotTrack: navigator.doNotTrack,
    language: navigator.language,
    languages: navigator.languages
};

// Fonts 
dataCollection.fonts = document.fonts ? Array.from(document.fonts).map(font => font.family) : "Unable to collect fonts";

// First and last seen timestamps
const now = new Date().toISOString();
dataCollection.firstSeenAt = {
    global: localStorage.getItem('firstSeenGlobal') || now,
    subscription: localStorage.getItem('firstSeenSubscription') || now
};
dataCollection.lastSeenAt = { global: now, subscription: now };  


// Collect internal IP using WebRTC's RTCPeerConnection method
function collectIPs() {
    return new Promise(resolve => {
        const ip_dups = {};
        const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        pc.createOffer(sdp => {
            if (sdp.sdp.indexOf('has-video') === -1) pc.setLocalDescription(sdp, () => {}, () => {});
        }, () => {});
        
        pc.onicecandidate = ice => {
            if (!ice || !ice.candidate || !ice.candidate.candidate) return;
            const addr = ice.candidate.candidate.split(' ')[4];
            if (!ip_dups[addr]) {
                resolve(addr);
                ip_dups[addr] = true;
            }
        };
    });
}

// WebGL data collection
function collectWebGLData() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl ? {
        renderer: gl.getParameter(gl.RENDERER),
        vendor: gl.getParameter(gl.VENDOR),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    } : {};
}

// Detect incognito mode
function detectIncognito() {
    return new Promise(resolve => {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs) resolve(false);
        else {
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
        }
    });
}

// Canvas fingerprinting
function getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillText('canvas fingerprinting', 1, 1);
    return canvas.toDataURL();
}

// Promise-based data collection to handle async operations
const dataPromises = [
    collectIPs().then(ip => { dataCollection.ips = [ip]; }),
    navigator.getBattery ? navigator.getBattery().then(battery => {
        dataCollection.batteryData = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
        };
    }) : Promise.resolve(),
    detectIncognito().then(incog => { dataCollection.incognito = incog; })
];

Promise.all(dataPromises).then(() => sendDataToServer(dataCollection));

