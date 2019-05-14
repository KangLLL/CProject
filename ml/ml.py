from __future__ import division
from mysql.connector import MySQLConnection, Error
from db_config import connection_dict

import pandas as pd
import numpy as np
import  collections
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score
from sklearn import svm
from sklearn.naive_bayes import MultinomialNB, GaussianNB, BernoulliNB
from sklearn.linear_model import LogisticRegression


from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns


def get_training_data():
    data = None
    dict = {}
    try:
        conn = MySQLConnection(**connection_dict)
        cursor = conn.cursor()
        cursor.execute('select NAME, CATEGORY from usproduct where CATEGORY in (select CATEGORY from usproduct where CATEGORY is not null group by(CATEGORY) having count(*)>100)')
        rows = cursor.fetchall()
        data = pd.DataFrame(rows, columns=['name', 'category'])

        cursor.execute('select ID, NAME from category')
        rows = cursor.fetchall()

        df = pd.DataFrame(rows, columns=['id', 'name'])
        for index, row in df.iterrows():
            dict[row['id']] = str(row['name'])


    except Error as e:
        print(e)

    finally:
        cursor.close()
        conn.close()

    return (data, dict)

def process_data(data):
    words = []
    prefix = ''
    for i in range(0, 5):
        for j in range(0, 10):
            words.append(prefix + str(j))
        prefix += '0'
    vectorizer = TfidfVectorizer(stop_words=words)
    X = vectorizer.fit_transform(data['name'])
    print(X.shape)
    Y = data['category']
    return (X, Y, vectorizer)

def model_comparison(X, Y):
    print('Naive Bayes Score:')
    variables = [0.001, 0.01, 0.1, 0.5, 1, 10]
    scores = []
    for alpha in variables:
        nb = MultinomialNB(alpha=alpha)
        score = cross_val_score(nb, X, Y, cv=10)
        print('smoothing parameter alpha=%.3f, score:%.4f'%(alpha, np.mean(score)))
        scores.append(np.mean(score))
    plt.plot(variables, scores, 'bo', variables, scores, 'k')
    plt.ylabel('Accuracy', fontsize=26)
    plt.xlabel('Alpha', fontsize=26)
    plt.title('Multinomial Naive Bayes', fontsize=28)
    plt.show()

    print('Logistic Regression Score:')
    variables = [0.01, 0.1, 1, 10, 100]
    scores = []
    for c in variables:
        lr = LogisticRegression(C=c, solver='lbfgs', multi_class='auto')
        score = cross_val_score(lr, X, Y, cv=10)
        print('regularization strength C=%.2f, score:%.4f'%(c, np.mean(score)))
        scores.append(np.mean(score))
    plt.plot(variables, scores, 'bo', variables, scores, 'k')
    plt.ylabel('Accuracy', fontsize=26)
    plt.xlabel('C', fontsize=26)
    plt.title('Logistic Regression', fontsize=28)
    plt.show()

    print('SVM with Linear Kernel Score:')
    variables = [0.01, 0.1, 1, 10, 100]
    scores = []
    for c in variables:
        clf = svm.SVC(kernel='linear', C=c)
        score = cross_val_score(clf, X, Y, cv=10)
        print('penalty parameter C=%.2f, score:%.4f' % (c, np.mean(score)))
        scores.append(np.mean(score))
    plt.plot(variables, scores, 'ro', variables, scores, 'k')
    plt.ylabel('Accuracy', fontsize=26)
    plt.xlabel('C', fontsize=26)
    plt.title('SVM with Linear Kernel', fontsize=28)
    plt.show()

    print('SVM with rbf Kernel Score:')
    variables = [0.01, 0.1, 1, 10]
    scores = []
    for c in variables:
        clf = svm.SVC(kernel='rbf', C=c, gamma='scale')
        score = cross_val_score(clf, X, Y, cv=10)
        print('penalty parameter C=%.2f, score:%.4f' % (c, np.mean(score)))
        scores.append(np.mean(score))
    plt.plot(variables, scores, 'ro', variables, scores, 'k')
    plt.ylabel('Accuracy', fontsize=26)
    plt.xlabel('C', fontsize=26)
    plt.title('SVM with rbf Kernel', fontsize=28)
    plt.show()

def show_model_heat_map(X, Y, dict):
    names = Y.drop_duplicates().sort_values().map(dict)
    clf = svm.SVC(kernel='linear', C=1)
    fold = 10
    percs = 0
    kf = KFold(fold, False, 0)

    for train_index, test_index in kf.split(X):
        clf.fit(X[train_index], Y[train_index])

        i = 0
        correct = 0
        total = len(test_index)

        pres = clf.predict(X[test_index])

        pres = list(map(lambda t:dict[t], pres))
        acts = list(map(lambda t:dict[t], Y[test_index]))
        #
        # print(collections.Counter(pres))
        # print(collections.Counter(Y[test_index]))
        #
        # print(Y[test_index].values)

        conf_mat = confusion_matrix(acts, pres)
        fig, ax = plt.subplots(figsize=(10,10))

        heat_map = sns.heatmap(conf_mat, annot=True, fmt='d', xticklabels=names.values, yticklabels=names.values)
        heat_map.set_xticklabels(heat_map.get_xticklabels(), rotation=0)
        plt.ylabel('Actual')
        plt.xlabel('Predicted')

        for y in pres:
            if y == acts[i]:
                correct += 1
            # else:
            #     print('pre:' + str(y) + ',act:' + str(Y[test_index].values[i]) + ',total:' + str(i))
            i += 1
        percs += correct / total
        print(correct / total)
        plt.show()

    print(percs / fold)

def train_model(X, Y):
    clf = svm.SVC(kernel='linear', C=1)
    clf.fit(X, Y)
    return clf

def get_predict_data():
    data = None
    try:
        conn = MySQLConnection(**connection_dict)
        cursor = conn.cursor()
        cursor.execute(
            'select NAME from promotion')
        rows = cursor.fetchall()
        data = pd.DataFrame(rows, columns=['name'])

    except Error as e:
        print(e)

    finally:
        cursor.close()
        conn.close()

    return data

def predict(clf, X):
    Y = clf.predict(X)
    return Y

def save_predict_data(data, result):
    try:
        conn = MySQLConnection(**connection_dict)
        cursor = conn.cursor()
        cursor.executemany('update promotion set CATEGORY = %s where NAME = %s', zip(result, data))
        conn.commit()

    except Error as e:
        print(e)

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    data, dict = get_training_data()
    if data is not None and len(dict) > 0:
        X, Y, vectorizer = process_data(data)
        # model_comparison(X, Y)
        show_model_heat_map(X, Y, dict)

        # print('start train')
        # clf = train_model(X, Y)
        #
        # test = get_predict_data()
        # if test is not None:
        #     print('start predict')
        #     result = predict(clf, vectorizer.transform(test['name']))
        #     print('start save')
        #     save_predict_data(test['name'].values, list(map(lambda r:int(r), result)))