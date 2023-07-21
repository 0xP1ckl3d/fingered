import json
import csv

def flatten_json(y):
    out = {}

    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '_')
        elif type(x) is list:
            i = 0
            for a in x:
                flatten(a, name + str(i) + '_')
                i += 1
        else:
            out[name[:-1]] = x

    flatten(y)
    return out

if __name__ == '__main__':
    # Read the file
    with open("fingerprintData.txt", "r") as file:
        lines = file.readlines()

    # Convert each line to json and then flatten
    data = [flatten_json(json.loads(line)) for line in lines]

    # Write the csv file
    with open("fingerprintData.csv", "w", newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys())
        writer.writeheader()
        for row in data:
            writer.writerow(row)

