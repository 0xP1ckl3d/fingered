# Fingered! - Browser Fingerprinting Tool
## Description
Fingered! is a browser fingerprinting tool designed to capture an array of browser and system details from visitors. The captured data provides insights into the devices, browser settings, software stacks, and in some cases, even the physical locations your site is accessed from. Each time a browser accesses your web-page, the tool logs the fingerprinting data to __FingerprintData.txt__.
## What Data Does It Obtain?
1. __Network information:__ IP address, source port, timestamping, timzone.
2. __Basic Browser & Device Details:__ User agent, , screen resolution, color depth, cookie & localStorage status.
3. __WebGL Data:__ Renderer, vendor, and shading language version.
4. __Browser Plugins:__ List of installed browser plugins.
5. __Audio Data:__ Sample rate from the browser's AudioContext.
6. __Touch Data:__ Whether touch is supported and the number of touch points.
7. __Network Information:__ Connection type, effective type, downlink, and RTT.
8. __Canvas Fingerprinting:__ Unique canvas drawing data that can be used to identify devices.
9. __Browser Settings & Preferences:__ DoNotTrack setting, browser's set language(s).
10. __Fonts:__ List of available fonts.
11. __IP Address:__ External and internal IP addresses.
12. __Battery Data:__ Battery status, charging status, charging time, and discharging time.
13. __Incognito Detection:__ Check if the user is browsing in private mode.
14. __Persistance__: Uses cookies to identify users and track their first and last connections.
15. __Enriched IP Data (Using ipapi.com API service):__ Geographical location, timezone, city, country, continent, and subdivisions.
## Setup in a Production Environment
Ensure you have Node.js installed. If not, download and install from [here](https://nodejs.org/en).
1. Clone the repository:
```bash
git clone https://github.com/0xP1ckl3d/fingered.git
cd fingered
```
2. Install the necessary Node.js dependencies:
```bash
3. npm install express body-parser fs
```
4. Start the application:
```
node server.js
```
The server will start running on port 3000.
## Setup in a Test Environment
Ensure you have Node.js and nodemon installed. If nodemon is not installed:
```bash
npm install -g nodemon
```
Follow steps 2-3 from the production environment setup.

Start the application using nodemon for hot reloads:
```
nodemon server.js
```
## Required Dependencies
* Node.js
* Nodemon (for testing environment)
* Express.js: Web server framework.
* Body-parser: To parse incoming JSON requests.
* Ensure the latest version of __ua-parser.min.js__ exists within the __/public__ directory to ensure accuracy in user agent parsing [available here](https://github.com/faisalman/ua-parser-js)
## Enriching IP Data
The Python script __enrichIP.py__ fetches additional details about the captured IP addresses like geolocation, timezone, city, and other geographical details. To run this:
1. Ensure you have Python installed.
2. Install the required Python libraries:
```bash
pip install requests
```
3. Insert your IP enrichment service API key in the __enrichIP.py__ script where it says <API_KEY>.
4. Run the script:
```bash
python enrichIP.py
```
The enriched data will be saved in a new file named __fingerprintDataEnriched.json__.
## Convert JSON to CSV
The Python script __json2csv.py__ converts the fingerprinting data from JSON to CSV format. To run this:
1. Follow step 1 from Enriching IP Data.
Run the script:
```bash
python json2csv.py
```
The CSV data will be saved in a file named __fingerprintData.csv__.
## Example enriched data
```json
    {
        "timeZone": "UTC+10:00",
        "timestamp": "2023-07-21T01:38:26.842Z",
        "ipAddress": "1.145.32.160",
        "sourcePort": 59468,
        "browserDetails": {
            "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "browser": {
                "name": "Chrome",
                "version": "114.0.0.0",
                "major": "114"
            },
            "cpu": {
                "architecture": "amd64"
            },
            "device": {},
            "engine": {
                "name": "Blink",
                "version": "114.0.0.0"
            },
            "os": {
                "name": "Windows",
                "version": "10"
            }
        },
        "basic": {
            "screenResolution": "2560x1440",
            "colorDepth": 24,
            "timeZoneOffset": -600,
            "cookiesEnabled": true,
            "localStorageEnabled": true
        },
        "webGLData": {
            "renderer": "WebKit WebGL",
            "vendor": "WebKit",
            "shadingLanguageVersion": "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)"
        },
        "plugins": [
            "PDF Viewer",
            "Chrome PDF Viewer",
            "Chromium PDF Viewer",
            "Microsoft Edge PDF Viewer",
            "WebKit built-in PDF"
        ],
        "audioData": {
            "sampleRate": 48000
        },
        "touchData": {
            "touchSupport": false,
            "maxTouchPoints": 0
        },
        "networkData": {
            "effectiveType": "4g",
            "downlink": 9.5,
            "rtt": 100
        },
        "canvasFingerprint": "data:image/png;base64,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",
        "settings": {
            "doNotTrack": null,
            "language": "en-US",
            "languages": [
                "en-US",
                "en"
            ]
        },
        "fonts": [],
        "firstSeenAt": {
            "global": "2023-07-21T00:52:02.696Z",
            "subscription": "2023-07-21T00:52:02.696Z"
        },
        "lastSeenAt": {
            "global": "2023-07-21T01:38:27.084Z",
            "subscription": "2023-07-21T01:38:27.084Z"
        },
        "incognito": false,
        "ips": [
            "3b3e112d-c17f-498a-ae7c-455a37b0996d.local"
        ],
        "acceptLanguage": "en-US,en;q=0.9",
        "ipInfo": {
            "data": {
                "IP": {
                    "address": "1.145.32.160",
                    "geolocation": {
                        "accuracyRadius": 100,
                        "latitude": -33.87070083618164,
                        "longitude": 151.20680236816406,
                        "postalCode": "",
                        "timezone": "",
                        "city": {
                            "name": "Sydney"
                        },
                        "country": {
                            "code": "AU",
                            "name": "Australia"
                        },
                        "continent": {
                            "code": "OC",
                            "name": "Oceania"
                        },
                        "subdivisions": [
                            {
                                "isoCode": "NSW",
                                "name": "New South Wales"
                            }
                        ]
                    }
                }
            }
        }
    }
```
