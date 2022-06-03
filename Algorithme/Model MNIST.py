from keras.datasets import mnist
import keras.backend as K
from keras.models import Sequential
from keras.layers import Dropout, Dense
from keras.layers import Conv2D, MaxPool2D, Flatten, Activation
from keras.utils.np_utils import to_categorical




import tensorflowjs as tfjs

import pandas as pd
import numpy as np

from matplotlib import pyplot as plt
# %matplotlib inline
# %config InlineBackend.figure_format='retina'
#on telecharge les images de training et du test
(X_train, y_train), (X_test, y_test) = mnist.load_data()

X_train = X_train.reshape(-1, 28, 28, 1)
X_test = X_test.reshape(-1, 28, 28, 1)
y_train_cat = to_categorical(y_train)
y_test_cat = to_categorical(y_test)
X_train = X_train.astype('float32')
X_test = X_test.astype('float32')
X_train /= 255.0
X_test /= 255.0
model = Sequential()
#layer1
model.add(Conv2D(32, (5,5), input_shape=(28, 28, 1)))
model.add(Conv2D(32, (5,5), input_shape=(28, 28, 1)))
model.add(MaxPool2D(pool_size=(2, 2)))
model.add(Activation('relu'))
model.add(Dropout(0.25))
#layer2
#layer1
model.add(Conv2D(64, (3,3), input_shape=(28, 28, 1)))
model.add(Conv2D(64, (3,3), input_shape=(28, 28, 1)))
model.add(MaxPool2D(pool_size=(2, 2)))
model.add(Activation('relu'))
model.add(Dropout(0.25))

#fully connected layer and output
# model.add(Flatten())
# model.add(Dense(256, activation = "relu"))
# model.add(Dropout(0.25))
# model.add(Dense(14, activation = "softmax"))
model.add(Flatten())

model.add(Dense(128, activation='relu'))
model.add(Dropout(0.25))
model.add(Dense(10, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
#model.fit(X_train, y_train_cat, batch_size=32, epochs=4, verbose=1, validation_split=0.3)
model.fit(X_train, y_train_cat, batch_size=86, epochs=5, verbose=1, validation_split=0.3)
model.evaluate(X_test, y_test_cat)
tfjs.converters.save_keras_model(model, 'modelfin.json')
# model.save("./A7senModel/model.h5")
