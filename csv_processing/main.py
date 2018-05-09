import csv
import re

import helper

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
            self.header = next(reader)
            for row in reader:
                self.data.append(row)

    # Find Specific Field By Name
    def find_field(self, field):
        if field in (self.header):
            return self.header.index(field)

    # Remove Rows that Don't Have Enough Employees
    def clean_by_employees(self, field, count):
        field_location = self.find_field(field)
        for i in self.data:
            if (helper.return_number(i[field_location]) >= count):
                self.filtered_data.append(i)
        print("{} Companies Remaining".format(len(self.filtered_data)))

    # Create CSV
    def create_csv(self, filename):
        if self.filtered_data:
            data = self.filtered_data
        else:
            data = self.data

        with open('outputs/' + filename + '.csv', 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=self.header)
            writer.writeheader()
            for data_row in data:
                info = {}
                for i, header in enumerate(self.header):
                    info[header] = data_row[i]
                writer.writerow(info)
            print("A CSV of {} Companies Was Created. Check the Output Folder".format(len(data)))

data = Analyze_CSV('inputs/company_info.csv')
data.clean_by_employees('employees_on_linkedin', 10)
data.create_csv('more_than_10_employees')