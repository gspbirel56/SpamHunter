from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import Perceptron, SGDClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier
from joblib import dump, load
import os

from warnings import simplefilter
simplefilter(action='ignore')

import preprocess

# global variables
X = []
Y = []
pla = None
sgc = None
nn = None
tree = None


def printMetrics(y_actual, y_pred):
    print('Accuracy: ', accuracy_score(y_actual, y_pred))
    print('Precision:', precision_score(y_actual, y_pred, average='macro'))
    print('Recall:   ', recall_score(y_actual, y_pred, average='macro'))
    print('F1:       ', f1_score(y_actual, y_pred, average='macro'))


def preprocessing():
    global X, Y
    XYList = preprocess.loadXY()
    X = XYList[0]
    Y = XYList[1]


def trainModels():
    preprocessing()
    
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=0)
    
    global pla, sgc, nn, tree
    
    print('\n==================================================\n')
    
    ### train perceptron
    # 'n_jobs': [16]
    params = {'tol': [.1, .01, .001, .0001]}
    pla = GridSearchCV(Perceptron(), params, cv=5)
    pla.fit(X_train, Y_train)
    pred_y_train = pla.predict(X_train)
    pred_y_test = pla.predict(X_test)
    
    print('Perceptron CV parameters:')
    print('Best: ', pla.best_params_)
    accuracy = pla.cv_results_['mean_test_score']
    for acc, param in zip(accuracy, pla.cv_results_['params']):
        print("%0.5f - %r"% (acc, param))
    
    print('\nPerceptron (training data):')
    printMetrics(Y_train, pred_y_train)
    print('\nPerceptron (testing data):')
    printMetrics(Y_test, pred_y_test)
    
    dump(pla.best_estimator_, 'pla.joblib')
    print('\n==================================================\n')
    
    
    ### train logistic regression
    # 'n_jobs': [16]
    params = {'alpha': [.00001, .0001, .001, .01, .1]}
    sgc = GridSearchCV(SGDClassifier(), params, cv=5)
    sgc.fit(X_train, Y_train)
    pred_y_train = sgc.predict(X_train)
    pred_y_test = sgc.predict(X_test)
    
    print('Stochastic Gradient Descent CV parameters:')
    print('Best: ', sgc.best_params_)
    accuracy = sgc.cv_results_['mean_test_score']
    for acc, param in zip(accuracy, sgc.cv_results_['params']):
        print("%0.5f - %r"% (acc, param))
    
    print('\nSGD (training data):')
    printMetrics(Y_train, pred_y_train)
    print('\nSGD (testing data):')
    printMetrics(Y_test, pred_y_test)
    
    dump(sgc.best_estimator_, 'sgc.joblib')
    print('\n==================================================\n')
    
    
    ### train neural network
    #params = {'hidden_layer_sizes': [(500,), (1000,), (1500,)], 'alpha': [.0001, .001, .01]}
    params = {'hidden_layer_sizes': [(100,)], 'alpha': [.001]}
    nn = GridSearchCV(MLPClassifier(), params, cv=5)
    nn.fit(X_train, Y_train)
    pred_y_train = nn.predict(X_train)
    pred_y_test = nn.predict(X_test)
    
    print('Neural Network CV parameters:')
    print('Best: ', nn.best_params_)
    accuracy = nn.cv_results_['mean_test_score']
    for acc, param in zip(accuracy, nn.cv_results_['params']):
        print("%0.5f - %r"% (acc, param))
    
    print('\nNeural Network (training data):')
    printMetrics(Y_train, pred_y_train)
    print('\nNeural Network (testing data):')
    printMetrics(Y_test, pred_y_test)
    
    dump(nn.best_estimator_, 'nn.joblib')
    print('\n==================================================\n')
    
    
    ### train decision tree
    tree = DecisionTreeClassifier()
    tree.fit(X_train, Y_train)
    pred_y_train = tree.predict(X_train)
    pred_y_test = tree.predict(X_test)
    
    print('Decision Tree (training data):')
    printMetrics(Y_train, pred_y_train)
    print('\nDecision Tree (testing data):')
    printMetrics(Y_test, pred_y_test)
    
    dump(tree, 'tree.joblib')
    print('\n==================================================\n')


def loadModels():
    global pla, sgc, nn, tree
    
    if not os.path.isfile('pla.joblib') or not os.path.isfile('sgc.joblib') or not os.path.isfile('nn.joblib') or not os.path.isfile('tree.joblib'):
        print('Training models...')
        trainModels()
    else:
        print('Loading models from file...')
        pla = load('pla.joblib')
        sgc = load('sgc.joblib')
        nn = load('nn.joblib')
        tree = load('tree.joblib')


def testModels():
    if len(X) == 0:
        preprocessing()
    
    if tree == None:
        loadModels()
    
    pred_y = pla.predict(X)
    print('Perceptron (all data):')
    printMetrics(Y, pred_y)
    
    pred_y = sgc.predict(X)
    print('\nStochastic Gradient Descent (all data):')
    printMetrics(Y, pred_y)
    
    pred_y = nn.predict(X)
    print('\nNeural Network (all data):')
    printMetrics(Y, pred_y)
    
    pred_y = tree.predict(X)
    print('\nDecision Tree (all data):')
    printMetrics(Y, pred_y)

#### not finished 
def makePrediction(message):
    if tree == None:
        loadModels()
    
    pred_y = tree.predict([preprocess.extract(message)])
    print(pred_y)
    
    if pred_y[0] == 1:
        return 'spam'
    else:
        return 'ham'


# declaring, training, fitting each algorithm
def mlinit():
    pass

def partialFitNewData():
    pass

def switchCurrentAlgorithm():
    pass

