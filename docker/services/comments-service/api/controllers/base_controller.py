import math
from typing import List

from pydantic import BaseModel, TypeAdapter


class BaseController:

    """
    Base Controller Class working as helper class.
    We can add any generalised supported methods into this class.
    """

    def get_serialized_data(self, schema: BaseModel, obj: object) -> dict:
        return schema(**obj.__dict__)

    def get_serialized_list(self, schema: BaseModel, objs: List[object]) -> List[dict]:
        type_adapter = TypeAdapter(List[schema])
        return type_adapter.validate_python([obj.__dict__ for obj in objs])

    def get_serialized_list_basic(self, schema: BaseModel, objs: List[object]) -> List[dict]:
        return [schema(**obj.__dict__) for obj in objs]

    def validate_request_data(self, request_data, db):
        # Override methode to do validations.
        # Example - Validations like data already exist.
        return request_data

    def handle_pagination_response(self, data, page, page_size, total, schema):
        """
        This function is creating paginated response.
        data is paginated query(converted in DTO objects) which is generated using limit and offset.
        page is page number(start with idex as 0)
        page_size is size of each page for the pagination.
        total is count of all the objects of query without limit and offset.
        schema is serialization for the each data object.
        """
        count = len(data)
        paginated_data = {"items": [], "total": total, "page": page, "size": 0, "pages": 0}
        if count > 0:
            paginated_data["items"] = self.get_serialized_list(schema, data)
            paginated_data["total"] = total
            paginated_data["page"] = page
            paginated_data["size"] = page_size if total > page_size else count
            paginated_data["pages"] = math.floor((total - 1) / page_size) + 1 if total > page_size else 1
        return paginated_data
