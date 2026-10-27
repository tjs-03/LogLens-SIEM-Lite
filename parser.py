import re

# Flexible pattern for quotes and spaces inside the path who can't Block easyly
log_pattern = r'(?P<ip>\S+) \S+ \S+ \[(?P<date>.*?)\] "(?P<method>\S+) (?P<path>.+?) HTTP/\d\.\d" (?P<status>\d+) \S+'

def parse_log_stream(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            match = re.match(log_pattern, line)
            if match:
                yield match.groupdict()

if __name__ == "__main__":
    print("Flexible Parser Engine Ready!")
