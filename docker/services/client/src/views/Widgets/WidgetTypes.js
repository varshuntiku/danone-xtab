export default [
  { label: 'Sources & Factors', short_label: 'KF', light_color: '#D1C4E9', dark_color: '#673AB7', type: 'FACTORS', options: [
    { id: "factor_map", label: "Factor map" },
    { id: "feature_map", label: "Feature map" },
    { id: "feature_relations", label: "Feature relationships" },
  ]},
  { label: 'Ingestion', short_label: 'DC', type: 'INGEST', light_color: '#FFCDD2', dark_color: '#E53935', options: [
    { id: "sql", label: "SQL" },
    { id: "nosql", label: "NoSQL" },
    { id: "columnar", label: "Columnar" },
    { id: "hdfs", label: "HDFS" },
    { id: "file_system", label: "File system" },
    { id: "upload", label: "Upload" }
  ]},
  { label: 'Aggregation', short_label: 'DA', type: 'AGGREGATE', light_color: '#B2DFDB', dark_color: '#009688', options: [
    { id: "group_by", label: "Group by" },
    { id: "rollup", label: "Rollup" },
    { id: "inner_join", label: "Inner JOIN" },
    { id: "outer_join", label: "Outer JOIN" },
    { id: "union", label: "Union" },
    { id: "intersect", label: "Intersect" },
    { id: "minus", label: "Minus" }
  ]},
  { label: 'Exploration', short_label: 'DE', type: 'EXPLORE', light_color: '#C8E6C9', dark_color: '#4CAF50', options: [
    { id: "column_stats", label: "Column Stats" },
    { id: "descriptive_stats", label: "Descriptive Stats" },
    { id: "missing_values", label: "Missing values" },
    { id: "univariate", label: "Univariate" },
    { id: "bivariate", label: "Bivariate" },
    { id: "multivariate", label: "Multivariate" },
    { id: "trend_analysis", label: "Trend analysis" }
  ]},
  { label: 'Feature Engineering', short_label: 'DT', type: 'TRANSFORM', light_color: '#BBDEFB', dark_color: '#2196F3', options: [
    { id: "new_features", label: "New features" },
    { id: "scaling_outliers", label: "Scaling outliers" },
    { id: "impute_categorical", label: "Impute categorical" },
    { id: "impute_continuous", label: "Impute continuous" },
    { id: 'box muller', label: 'Box Muller' },
    { id: 'gradient descent', label: 'Gradient Descent' },
    { id: 'gauss newton', label: 'Gauss Newton' },
    { id: 'levenberg-marquardt', label: 'Levenberg-Marquardt' },
    { id: 'sq rt', label: 'Sq rt' },
    { id: 'cube root', label: 'Cube Root' },
    { id: 'reciprocal', label: 'Reciprocal' },
    { id: 'z-transfomation', label: 'z-transfomation' },
    { id: 'log', label: 'Log transformation' },
    { id: 'box cox', label: 'Box Cox transformation' },
    { id: 'feature selection', label: 'Feature selection' }
  ]},
  { label: 'Algorithm Build', short_label: 'DM', type: 'MODEL', light_color: '#FFCCBC', dark_color: '#FF5722', options: [
    { id: "pca", label: "PCA" },
    { id: "regression", label: "Regression" },
    { id: "classification", label: "Classification" },
    { id: "decision_trees", label: "Decision Trees" },
    { id: "nlp", label: "NLP" },
    { id: "affinity_models", label: "Affinity Models" },
    { id: "recommendation_engines", label: "Recommendation Engines" }
  ]},
  { label: 'Publish', short_label: 'DR', type: 'PREDICT', light_color: '#FFE0B2', dark_color: '#FF9800', options: [
    { id: "model_winner", label: "Model Winner" },
    { id: "forecast", label: "Forecast" },
    { id: "predict", label: "Predict" },
    { id: "driver_analysis", label: "Driver analysis" },
    { id: "api", label: "Rest API" },
    { id: "export", label: "Export" },
    { id: "notification", label: "Notification" }
  ]},
  { label: 'Democratize', short_label: 'DD', type: 'DEMOCRATIZE', light_color: '#C5CAE9', dark_color: '#220047', options: [
    { id: "feature_store", label: "Feature store" },
    { id: "central_repository", label: "Central repository" },
    { id: "data_warehouse", label: "Datawarehouse" },
    { id: "data_mart", label: "Data Mart" },
    { id: "simulator", label: "Simulator" },
    { id: "dashboard", label: "Dashboard" }
  ]},
  { label: 'Custom', short_label: '-', type: 'CUSTOM', light_color: '#efefef', dark_color: '#b1b1b1', options: [
    { id: "container", label: "Container" },
    { id: "placeholder", label: "Placeholder" }
  ]}
];