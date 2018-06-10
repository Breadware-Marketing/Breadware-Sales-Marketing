import re

"""
Holds Helper Functions
"""

def return_number(input):
    return (int((re.findall('\d+', input.replace(',', '') ))[0]))
