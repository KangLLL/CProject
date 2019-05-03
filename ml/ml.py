from __future__ import division
from mysql.connector import MySQLConnection, Error
from db_config import connection_dict

import pandas as pd
import  collections
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import KFold
from sklearn import svm

from sklearn.metrics import  confusion_matrix
import  matplotlib.pyplot as plt
import seaborn as sns

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

data = pd.read_csv('../cron/out.csv')

if data is not None:
    words = []
    prefix = ''
    for i in range(0, 5):
        for j in range(0, 10):
            words.append(prefix + str(j))
        prefix += '0'
    # print(words)
    vectorizer = TfidfVectorizer(stop_words = words)
    X = vectorizer.fit_transform(data['name'])

    print(vectorizer.get_feature_names())
    print(len(vectorizer.get_feature_names()))
    print(X.shape)

    Y = data['category']

    fold = 10
    kf = KFold(fold, False, 2)
    clf = svm.SVC(kernel='linear',C=10)

    percs = 0

    vs = Y.drop_duplicates().sort_values()

    temp = vs.map(dict)
    # print(vs)
    # print(temp)

    for train_index, test_index in kf.split(X):
        clf.fit(X[train_index], Y[train_index])
        # lin_clf.fit(X[train_index], Y[train_index])
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
        # print(pres)
        # print(Y[test_index].values)

        conf_mat = confusion_matrix(acts, pres)
        fig, ax = plt.subplots(figsize=(10,10))



        heat_map = sns.heatmap(conf_mat, annot=True, fmt='d', xticklabels=temp.values, yticklabels=temp.values)
        heat_map.set_xticklabels(heat_map.get_xticklabels(), rotation=0)
        plt.ylabel('Actual')
        plt.xlabel('Predicted')


        for y in pres:
        # for y in lin_clf.predict(X[test_index]):
            # print('=====')
            # print(y)
            # print(Y[test_index].values[i])
            if y == acts[i]:
                correct += 1
            # else:
            #     print('pre:' + str(y) + ',act:' + str(Y[test_index].values[i]) + ',total:' + str(i))
            i += 1
        percs += correct / total
        print(correct / total)
        plt.show()

    print(percs / fold)

# print(vectorizer.get_feature_names())
# print(response.toarray())