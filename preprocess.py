import numpy as np
import pandas as pd
import re
import os
from collections import Counter
import xml.etree.ElementTree
from joblib import dump, load

### define features from training data
### input - spam/ham training set
### returns a list of feature words
def defineFeatures(data, num_features=1000):
    #create list of text and labels
    text =  data['text'].tolist()
    labels = data['class'].tolist()
    
    #read in list of stop words
    stop_words = []
    fin = open('stop_words.txt')
    for line in fin:
        stop_words.append(line.strip().lower())
    fin.close()
    
    #extract words from text
    word_count = Counter()
    for i in range(len(text)):
        #remove all non alphabetic characters from text
        clean = re.sub('[^a-zA-Z\']+', '|', text[i])
        #create list of words from text
        words = clean.lower().split('|')
        for word in words:
            #add each word occurrence for ham words, subtract for spam words
            #typically ham words will have a large positive value
            #typically spam words will have a large negative value
            if len(word) > 1 and word not in stop_words:
                if labels[i] == 'ham':
                    word_count[word] += 1
                else:
                    word_count[word] -= 1
    
    #select the most 50 most common ham and spam words as features
    features = word_count.most_common(num_features // 2)
    features.extend(word_count.most_common()[-(num_features //2):])
    
    #return list of keywords
    return [item[0] for item in features]


### creates a feature vector from a message
### input - list of feature words and an sms message
### returns a feature vector of 1 if feature is found in text and 0 if feature is not
def extract(features, message):
    vector = [0] * len(features)
    #remove all non alphabetic characters from text
    clean = re.sub('[^a-zA-Z\']+', '|', message)
    #create list of words from text
    words = clean.lower().split('|')
    
    """
    #one-hot
    #set feature value to 1 if word is found in text
    for i in range(len(features)):
        if features[i] in words:
            vector[i] = 1
    """
    #count occurrences of feature word in text
    for i in range(len(features)):
        vector[i] = words.count(features[i])
    
    return vector


### creates a feature matrix from a data set
### input - list of feature words and data set to extract features from
### returns a numpy matrix containing a feature vector for each message, also returns an array of correct labels
def prepare(features, data):
    #create list of text and labels
    text =  data['text'].tolist()
    labels = data['class'].tolist()
    
    #create feature matrix
    matrix = []
    for sample in text:
        #add feature vector to matrix for each message
        matrix.append(extract(features, sample))
    
    #label each sample - ham = -1, spam = +1
    target = np.ones(len(labels), dtype=int)
    for i in range(len(labels)):
        if labels[i] == 'ham':
            target[i] = -1
    
    return np.array(matrix), target


##############################################################################################################################################
#read in training and testing data
#kaggle and UCI contain the same data
def read_data():
    #read kaggle data
    data = pd.read_csv('UCI.csv', header=None).drop(2, axis=1)
    
    #read enron data
    data = pd.concat([data, pd.read_csv('enron.csv', header=None).drop(2, axis=1)])
    
    #read spamassassin data
    data = pd.concat([data, pd.read_csv('spamassassin.csv', header=None).drop(2, axis=1)])

    data = data.drop_duplicates()
    data = data.dropna(axis=0, how='any')
    data.reset_index(drop=True, inplace=True)
    data.columns = ['class', 'text']
    #print(data.describe())

    """
    #remove html tags, urls, and emails from data
    for i in range(len(data)):
        #df[1][i] = '' + xml.etree.ElementTree.fromstring(str(df[1][i])).itertext()
        data[1][i] = re.sub(r'<[^>]+>', '', data[1][i])
    """
    
    #extract features from training data
    features = defineFeatures(data)
    dump(features, 'features.joblib')
    
    #create feature matrix for training and testing data
    X, Y = prepare(features, data)
    dump(X, 'X.joblib')
    dump(Y, 'Y.joblib')

# for API
def loadXY():
    if not os.path.isfile('X.joblib') or not os.path.isfile('Y.joblib'):
        read_data()
    
    X = load('X.joblib')
    Y = load('Y.joblib')
    
    return X, Y

read_data()