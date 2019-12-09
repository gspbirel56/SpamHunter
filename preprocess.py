import numpy as np
import pandas as pd
import re
import os
from collections import Counter
from joblib import dump, load

features = []

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

    return data


def clean_text(text):
    #remove html tags
    clean = re.sub('<[^<]+?>', '', text)
    #remove urls
    clean = re.sub('http[s]?://\S+', '', clean)
    #remove email addresses
    clean = re.sub('\S*@\S*\s?', '', clean)
    #remove any remaining non alphabetic characters
    clean = re.sub('[^a-zA-Z]+', ' ', clean)
    clean = clean.lower().strip()    
    return clean



### create features from training data
### input - spam/ham training set
### returns a list of feature words
def define_features(data, num_features=1000):
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
        #clean text
        clean = clean_text(text[i])
        #create list of words from text
        words = clean.split()
        for word in words:
            #add each word occurrence for spam words, subtract for ham words
            if len(word) > 1 and word not in stop_words:
                if labels[i] == 'spam':
                    word_count[word] += 1
                else:
                    word_count[word] -= 1
    
    #select the most 50 most common ham and spam words as features
    feature_list = word_count.most_common(num_features // 2)
    feature_list.extend(word_count.most_common()[-(num_features //2):])
    
    #return list of keywords
    global features
    features = [item[0] for item in feature_list]
    dump(features, 'features.joblib')



### creates a feature vector from a message
### input - list of feature words and an sms message
### returns a feature vector of 1 if feature is found in text and 0 if feature is not
def extract(message):
    global features
    
    if len(features) == 0:
        if os.path.isfile('features.joblib'):
            print('Loading features from file...')
            features = load('features.joblib')
        else:
            print('Defining features...')
            loadXY(True)
    
    vector = [0] * len(features)
    #clean text
    clean = clean_text(message)
    #create list of words from text
    words = clean.split()
    
    #one-hot
    #set feature value to 1 if word is found in text
    for i in range(len(features)):
        if features[i] in words:
            vector[i] = 1
    """
    #count occurrences of feature word in text
    for i in range(len(features)):
        vector[i] = words.count(features[i])
    """
    return vector



### creates a feature matrix from a data set
### input - list of feature words and data set to extract features from
### returns a numpy matrix containing a feature vector for each message, also returns an array of correct labels
def prepare(data):
    #create list of text and labels
    text =  data['text'].tolist()
    labels = data['class'].tolist()
    
    #create feature matrix
    matrix = []
    for sample in text:
        #add feature vector to matrix for each message
        matrix.append(extract(sample))
    
    #label each sample - ham = 0, spam = 1
    target = np.ones(len(labels), dtype=int)
    for i in range(len(labels)):
        if labels[i] == 'ham':
            target[i] = 0
    
    return np.array(matrix), target


# for API
def loadXY(refresh_data=False):
    if not os.path.isfile('X0.joblib') or not os.path.isfile('X1.joblib') or not os.path.isfile('Y.joblib') or refresh_data:
        data = read_data()
        
        #extract features from training data
        define_features(data)
        
        #create feature matrix for training and testing data
        X, Y = prepare(data)
        dump(X[:20000, :], 'X0.joblib')
        dump(X[20000:, :], 'X1.joblib')
        dump(Y, 'Y.joblib')        
        return X, Y
    else :
        X = np.concatenate((load('X0.joblib'), load('X1.joblib')))
        Y = load('Y.joblib')
        return X, Y
