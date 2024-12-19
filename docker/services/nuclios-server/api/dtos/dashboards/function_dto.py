from api.models.base_models import Functions


class FunctionDTO:
    def __init__(self, function, parent_function_name, industries_ids=[]):
        self.industry_name = function.industry.industry_name if function.industry else None
        self.industry_id = function.industry.id if function.industry else None
        self.function_id = function.id
        self.parent_function_id = function.parent_function_id if function.parent_function_id else None
        self.function_name = function.function_name
        self.description = function.description
        self.logo_name = function.logo_name
        self.order = function.order
        self.level = function.level
        self.color = function.color
        self.parent_function_name = parent_function_name

        if len(industries_ids) and function.industry_id not in industries_ids:
            self.industry_name = ""
            self.industry_id = None


class BaseFunctionDTO:
    def __init__(self, function):
        self.industry_name = function.industry.industry_name
        self.industry_id = function.industry_id
        self.function_id = function.id
        self.parent_function_id = function.parent_function_id
        self.function_name = function.function_name
        self.description = function.description
        self.logo_name = function.logo_name
        self.order = function.order
        self.level = function.level
        self.color = function.color


class CreateFunctionDTO:
    def __init__(self, function: Functions):
        self.id = function.id
        self.industry_id = function.industry_id
        self.parent_function_id = function.parent_function_id
        self.function_name = function.function_name
        self.description = function.description
        self.logo_name = function.logo_name
        self.order = function.order
        self.level = function.level
        self.color = function.color
