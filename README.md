# Portion Planner PWA

Portion Planner.

## Functions

- English by default;
- switch to Nederlands;
- shift presets and save your presets;
- calculation of portions by working time;
- accounting for breaks;
- names of breaks;
- continuation of the portion after the break;
- midnight shift support;
- calculation of the incomplete last portion;
- proportional calculation of fat, water, sugar and flour;
- total values for fat, water, sugar and flour;
- highlighting negative additives;
- copying the schedule;
- history of recent calculations;
- the 'Now` button for a quick start from the current time;
- saving the entered data in the browser;
- PWA manifest and service worker to add to the iPhone home screen.

## How to open on Windows 11

The simplest local startup:

```powershell
cd yourProjectPath
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

You can also run the 'start-server.ps1` file from this folder.

## How to open on iPhone

Option 1: upload the folder to any HTTPS hosting, such as Netlify, Vercel, GitHub Pages, or your server.

Option 2: If the iPhone and Windows 11 are on the same Wi-Fi network:

1. Start a local server on Windows.
2. Find out the IP address of the Windows computer on the local network.
3. Open Safari on iPhone:

```text
http://yourIp:8080
```

4. Click `Share'.
5. Select `Add to Home Screen'.

For a full-fledged PWA installation and reliable offline work, it is better to use HTTPS hosting.