""" temporary script for testing things """

from joblib import dump, load
import preprocess as pre

"""
data = pre.read_data()

for i in range(len(data)):
    data['text'][i] = pre.clean_text(data['text'][i])
"""

X, Y = pre.loadXY(True)

#features = load('features.joblib')