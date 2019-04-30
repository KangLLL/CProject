from __future__ import division
from mysql.connector import MySQLConnection, Error
from db_config import connection_dict

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import KFold
from sklearn import svm

data = None

try:
    conn = MySQLConnection(**connection_dict)
    cursor = conn.cursor()
    cursor.execute("select NAME, CATEGORY from usproduct where CATEGORY in (select CATEGORY from usproduct where CATEGORY is not null group by(CATEGORY) having count(*)>100)")
    rows = cursor.fetchall()

    data = pd.DataFrame(rows, columns=['name', 'category'])

except Error as e:
    print(e)

finally:
    cursor.close()
    conn.close()

# data = pd.read_csv('../cron/out.csv')
#
if data is not None:
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(data['name'])
    Y = data['category']

    print(Y[0])

    kf = KFold(10, False, 2)
    clf = svm.SVC(gamma='scale')

    lin_clf = svm.LinearSVC(C=1)

    for train_index, test_index in kf.split(X):
        clf.fit(X[train_index], Y[train_index])
        lin_clf.fit(X[train_index], Y[train_index])
        i = 0
        correct = 0
        total = len(test_index)
        for y in clf.predict(X[test_index]):
        # for y in lin_clf.predict(X[test_index]):
            # print('=====')
            # print(y)
            # print(Y[test_index].values[i])
            if y == Y[test_index].values[i]:
                i += 1
                correct += 1
        print(correct / total)


# print(vectorizer.get_feature_names())
# print(response.toarray())