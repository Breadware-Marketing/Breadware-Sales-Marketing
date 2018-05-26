import csv
import requests

class Analyze_CSV(object):
    """
    CSV Object
    """

    # Initial Variables
    def __init__(self, location):

        self.location = location
        self.header = []
        self.data = []
        self.filtered_data = []
        self.open_csv()

    # Open CSV and Set Data and Header
    def open_csv(self):
        with open(self.location) as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            # self.header = next(reader)
            for row in reader:
                data = {
                    'name': row[1],
                    'linkedin_url': row[2],
                    'website': row[3],
                    'geography': row[4],
                    'industry': row[5],
                    'employees_on_linkedin': row[6],
                    'companyId': row[7]
                }
                r = requests.post("http://localhost:8000/company/", data=data)
                self.data.append(row)

data = Analyze_CSV('inputs/peeps_w_emails.csv')