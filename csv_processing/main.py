import csv
import re
import requests
from urllib.parse import urlparse

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

    # def clean_by_website(self, field):
    #     for i in self.data:
    #         if not i[field] and not urlparse(row[field]).scheme and not urlparse(row[field]).netloc:
    #             del(i)

    # Remove Rows that Don't Have Enough Employees
    def clean_by_employees(self, field, count):
        field_location = self.find_field(field)
        website_field_loc = self.find_field('website')
        for i in self.data:
            if (helper.return_number(i[field_location]) >= count) and i[website_field_loc] and urlparse(i[website_field_loc]).scheme and urlparse(i[website_field_loc]).netloc:
                print(urlparse(i[website_field_loc]))
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

# class Get_user_email(object):
#     def __init__(self, csv_location):
#         self.csv_location = csv_location
#         self.open_csv()
#         self.header = []
#         self.data= []
#
#     def open_csv(self):
#         with open(self.csv_location) as csvfile:
#             reader = csv.reader(csvfile, delimiter=',')
#             self.header = next(reader)
#             for row in reader:
#                 url = 'https://email-finder-breadware.herokuapp.com/api?name='+row['name'].replace(' ', '%20')+'&url='+row['website']
#                 r = requests.get(url)
#                 if len(r.json()['email'][1]) > 2:
#                     email = r.json()['email'][0]
#                 else:
#                     email = r.json()['email']
#
#                 self.data.append(row + ',' + email)
#
#     def create_csv(self, filename):
#         data = self.data
#
#         with open('outputs/' + filename + '.csv', 'w') as csvfile:
#             writer = csv.DictWriter(csvfile, fieldnames=self.header)
#             writer.writeheader()
#             for data_row in data:
#                 info = {}
#                 for i, header in enumerate(self.header):
#                     info[header] = data_row[i]
#                 writer.writerow(info)
#             print('---')

data = Analyze_CSV('inputs/company_info.csv')
data.clean_by_employees('employees_on_linkedin', 10)
data.create_csv('more_than_10_employees')

# data = Get_user_email('inputs/test_input.csv')
# data.create_csv('things_and_what_not')
