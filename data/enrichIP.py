import json
import requests

# Function to get enriched data from an IP
def get_ip_data(ip):
    api_url = f"http://api.ipapi.com/{ip}?access_key=<API_KEY>" # INSERT API KEY
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        return {
            "ipInfo": {
                "data": {
                    "IP": {
                        "address": ip,
                        "geolocation": {
                            "accuracyRadius": data.get("location", {}).get("accuracy_radius", 100),
                            "latitude": data.get("latitude", 0),
                            "longitude": data.get("longitude", 0),
                            "postalCode": data.get("postal_code", ""),
                            "timezone": data.get("location", {}).get("timezone", ""),
                            "city": {
                                "name": data.get("city", "")
                            },
                            "country": {
                                "code": data.get("country_code", ""),
                                "name": data.get("country_name", "")
                            },
                            "continent": {
                                "code": data.get("continent_code", ""),
                                "name": data.get("continent_name", "")
                            },
                            "subdivisions": [
                                {
                                    "isoCode": data.get("region_code", ""),
                                    "name": data.get("region_name", "")
                                }
                            ]
                        }
                    }
                }  # Closing the "data" dictionary
            }  # Closing the "ipInfo" dictionary
        }  # Closing the main return dictionary
    else:
        return {}

with open("fingerprintData.txt", "r") as file:
    data = file.readlines()
    unique_ips = {json.loads(line).get("ipAddress") for line in data}

    # Get enriched data for all unique IPs
    enriched_ip_data = {}
    for ip in unique_ips:
        enriched_ip_data[ip] = get_ip_data(ip)

    enriched_data = []
    for line in data:
        entry = json.loads(line)
        ip = entry.get("ipAddress")

        # Attach enriched data
        if ip in enriched_ip_data:
            entry.update(enriched_ip_data[ip])
            enriched_data.append(entry)

with open("fingerprintDataEnriched.json", "w") as outfile:
    json.dump(enriched_data, outfile, indent=4)

print("Data enrichment complete!")


