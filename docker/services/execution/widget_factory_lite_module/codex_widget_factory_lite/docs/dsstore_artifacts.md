# Introduction

Documentation for DSStore Artifacts.

# Attributes and Methods
- `load_dataframe` :
<div style="white-space: pre;">
Loads a pandas DataFrame.
Args:
    dataframe_name (string): The name of the artifact to be loaded.
Returns:
    pd.DataFrame: The loaded DataFrame, or None if an error occurs.
</div>

## usage
```
import dsstore
dsstore.load_dataframe("df1")  #user specified name
```
- `load_figure` :
<div style="white-space: pre;">
Loads a Plotly figure from a base64-encoded PNG artifact.
Args:
    figure_name (string): The name of the artifact to be loaded.
Returns:
    go.Figure: The loaded Plotly figure, or None if an error occurs.
</div>

## usage
```
import dsstore
dsstore.load_figure("fig1")  #user specified name
```
- `load_model` :
<div style="white-space: pre;">
Loads a machine learning model.
Args:
    model_name (string): The name of the artifact to be loaded.
Returns:
    out (object): The loaded machine learning model, or None if an error occurs.
</div>

## usage
```
import dsstore
model = dsstore.load_model("xgb_model") #user specified name
model.predict(X_test)
```
- `save_dataframe` : Saves a pandas DataFrame Args: dataframe (pd.DataFrame): The DataFrame to be saved. dataframe_name (str, optional): The name of the artifact. If not provided, a unique name will be generated.

## usage
```
import dsstore
import pandas as pd
df = pd.DataFrame([[1,2,3], [4,5,6]])
dsstore.save_dataframe(df)      # without name
dsstore.save_dataframe(df, "df1")   # with name
```
- `save_figure` :
<div style="white-space: pre;">
Saves a plotly graph.
Args:
    figure_name (str, optional): The name of the artifact. If not provided, a unique name will be generated.
</div>

## usage
```
import dsstore
import plotly.graph_objects as go
fig = go.Figure(data=go.Scatter(x=[4, 5, 6], y=[1,1,1]))
dsstore.save_figure(fig)  # without name
dsstore.save_figure(fig, "fig1")  # with name
```
- `save_model` :
<div style="white-space: pre;">
Saves a machine learning model.
Args:
    model: The machine learning model to be saved.
    model_name (str, optional): The name of the artifact. If not provided, a unique name will be generated.
</div>

## usage
```
import dsstore
import xgboost as xgb
import pandas as pd
from sklearn.model_selection import train_test_split
data = {
    'feature1': [1, 2, 3, 4, 5],
    'feature2': [5, 4, 3, 2, 1],
    'target': [0, 1, 0, 1, 0]
}
df = pd.DataFrame(data)
X = df[['feature1', 'feature2']]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
model = xgb.XGBClassifier(objective='binary:logistic', eval_metric='logloss')
model.fit(X_train, y_train)
dsstore.save_model(model)   # without name
dsstore.save_model(model, "xgb_model") # with name
```
- `list_dataframes` :
<div style="white-space: pre;">
Retrieves a list of all saved DataFrames.
Returns:
    pd.DataFrame: A DataFrame with the names of the saved DataFrames, or None if an error occurs.
</div>

## usage
```
import dsstore
dsstore.list_dataframes()
```
- `list_figures` :
<div style="white-space: pre;">
Retrieves a list of all saved Figures.
Returns:
    pd.DataFrame: A DataFrame with the names of the saved Plotly Figures, or None if an error occurs
</div>

## usage
```
import dsstore
dsstore.list_figures()
```
- `list_models` :
<div style="white-space: pre;">
Retrieves a list of all saved models.
Returns:
    pd.DataFrame: A DataFrame with the names of the saved models, or None if an error occurs.
</div>

## usage
```
import dsstore
dsstore.list_models()
```