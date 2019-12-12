import os

SKIP_FILES = {'cmds'}



SOURCES = [
    ('Enron/1/ham', 'ham'),
    ('Enron/1/spam', 'spam'),
    ('Enron/2/ham', 'ham'),
    ('Enron/2/spam', 'spam'),
    ('Enron/3/ham', 'ham'),
    ('Enron/3/spam', 'spam'),
    ('Enron/4/ham', 'ham'),
    ('Enron/4/spam', 'spam'),
    ('Enron/5/ham', 'ham'),
    ('Enron/5/spam', 'spam'),
    ('Enron/6/ham', 'ham'),
    ('Enron/6/spam', 'spam')
]

fout = open('enron.txt', 'w')

for path, classification in SOURCES:
    for root, dir_names, file_names in os.walk(path):
        for file_name in file_names:
            if file_name not in SKIP_FILES:
                fin = open(path + '/' + file_name, errors='ignore')
                x = fin.read()
                x = x[8:]
                lines = x.split(',')
                x = ''
                for line in lines:
                    words = line.split()
                    for word in words:
                        x += word.strip() + ' '
                
                fout.write(classification + ',' + x.strip() + ',\n')
                fin.close()

fout.close()



SOURCES = [
    ('spamassassin/easy_ham', 'ham'),
    ('spamassassin/easy_ham(2)', 'ham'),
    ('spamassassin/easy_ham_2', 'ham'),
    ('spamassassin/hard_ham', 'ham'),
    ('spamassassin/hard_ham(2)', 'ham'),
    ('spamassassin/spam', 'spam'),
    ('spamassassin/spam(2)', 'spam'),
    ('spamassassin/spam_2', 'spam'),
    ('spamassassin/spam_2(2)', 'spam')
    
]

fout = open('spamassassin.txt', 'w', errors='replace')

for path, classification in SOURCES:
    for root, dir_names, file_names in os.walk(path):
        for file_name in file_names:
            if file_name not in SKIP_FILES:
                fin = open(path + '/' + file_name, errors='replace')
                x = fin.read()
                i = x.find('\n\n')
                x = x[i:]
                x.replace(',', '')
                lines = x.split(',')
                x = ''
                for line in lines:
                    words = line.split()
                    for word in words:
                        x += word.strip() + ' '
                
                fout.write(classification + ',' + x.strip() + ',\n')
                fin.close()

fout.close()
