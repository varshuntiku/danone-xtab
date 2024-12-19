from .artifact_manager.artifact_manager import ArtifactManager
from .loaders.dataframe_loader import DataFrameLoader
from .loaders.figure_loader import FigureLoader
from .loaders.function_loader import FunctionLoader
from .loaders.model_loader import ModelLoader
from .loggers.dataframe_logger import DataFrameLogger
from .loggers.figure_logger import FigureLogger
from .loggers.function_logger import FunctionLogger
from .loggers.model_logger import ModelLogger

save_dataframe = DataFrameLogger().save_dataframe
save_figure = FigureLogger().save_figure
save_model = ModelLogger().save_model
save_function = FunctionLogger().save_function

load_dataframe = DataFrameLoader().load_dataframe
load_figure = FigureLoader().load_figure
load_model = ModelLoader().load_model
load_function = FunctionLoader().load_function

artifact_manager = ArtifactManager()

list_all = artifact_manager.list_all_artifacts
list_dataframes = artifact_manager.list_dataframes
list_figures = artifact_manager.list_figures
list_models = artifact_manager.list_models
list_functions = artifact_manager.list_functions
