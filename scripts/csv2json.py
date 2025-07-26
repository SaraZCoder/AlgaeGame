import json
import os
import sys
import pandas as pd

def csv_to_json(csv_file_path, json_file_path):
    """
    Reads data from a CSV file and converts it to a JSON file.

    Args:
        csv_file_path (str): The path to the input CSV file.
        json_file_path (str): The path to the output JSON file.
    """
    df = pd.read_csv(csv_file_path)
    data = {}
    for _, row in df.iterrows():
        textPages = row[1].split("\n")
        new_list = [item for item in textPages if item != ""]
        data[row[0]] = new_list

    # Ensure the output directory exists
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)

    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    # Assuming the script is run from the root of the project
    # and the CSV file is in the 'scripts' directory.
    csv_file = "scripts/" + sys.argv[1]
    json_file = "public/assets/data.json"

    csv_to_json(csv_file, json_file)

    print(f"Successfully converted {csv_file} to {json_file}")
