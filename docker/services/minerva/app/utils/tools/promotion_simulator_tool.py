#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import datetime
import json
import logging
from typing import Any, List

import pandas as pd
import plotly.graph_objects as go
from app.schemas.minerva_conversation_schema import MinervaConversationDBBase

# TODO - check with anoop about me creating a new utils file
from app.utils.tools.text_to_sql_utils import promo_planning_helper
from app.utils.tools.tool_utils import openai_functions, summarize_question_context
from langchain.tools import BaseTool
from sqlalchemy import create_engine
from sqlalchemy.orm import Session


class PromoSimulator(BaseTool):
    llm: Any
    tool_config: dict
    history: List[MinervaConversationDBBase]
    max_retries: int = 3
    db: Session
    minerva_application_id: int
    query_trace_id: str = None
    window_id: int = None
    user_info: dict = None
    user_input_form: dict = None

    # Tool methods that have to be defined
    async def _run(self, query: str) -> dict:
        """Use the tool."""
        try:
            widgets = []
            know_more = ""
            # Case where simulated promo calendar is provided by user
            if self.user_input_form is not None:
                scenario_df = pd.DataFrame(self.user_input_form["rows"])
                scenario_output = self.run_scenario(scenario_promo_calendar=scenario_df)
                scenario_output["period_end_date"] = scenario_output["period_end_date"].astype(str)
                # Create a bar chart from the DataFrame
                bar_data = []
                for column in scenario_output.columns:
                    bar_data.append(scenario_output[column].tolist())
                # # fig = px.bar(scenario_output, x="period_end_date", y=["expected_sales", "scenario_expected_sales"], barmode="group")
                # fig = px.bar(x=bar_data[0], y=bar_data[1:], barmode="group")
                trace1 = go.Bar(x=bar_data[0], y=bar_data[1], name="expected_sales")
                trace2 = go.Bar(x=bar_data[0], y=bar_data[2], name="scenario_expected_sales")
                # Add the traces to the figure
                fig = go.Figure(data=[trace1, trace2])
                fig.update_layout(barmode="group")
                fig.update_layout(
                    title="Comparing the As-Is sales to Sales of the scenario created",
                    xaxis_title="Period End Date",
                    yaxis_title="Sales",
                )
                fig.update_layout(legend=dict(x=1.1, y=1.1, xanchor="left", yanchor="top"))
                widgets.append(
                    {
                        "name": "bar",
                        "type": "chart",
                        "title": "Comparing the As-Is sales to Sales of the scenario created",
                        "value": fig.to_dict(),
                    }
                )

                response = promo_planning_helper(scenario_output, self.llm)
                know_more = """<b>Promo simulation and optimization</b><p>To know more - <a href="https://app-codx-ui-prod.azurewebsites.net/app/1593/slice-creation" target="_blank" style="background-color: blue; color: white;">Navigate to the app.</a></p>
                """
            # Case where promo calendar is not yet provided to user - generate promo calendar for user
            else:
                promo_simulation_requirements = [
                    {
                        "name": "run_promo",
                        "description": "Run promotion simulation for a SKU for future time periods to calculate incremental revenue",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "start_date": {
                                    "type": "string",
                                    "description": "Start date of promotion simulation specified in the question. This must be in dd/mm/yyyy format",
                                },
                                "end_date": {
                                    "type": "string",
                                    "description": "End date of promotion simulation specified in the question. This must be in dd/mm/yyyy format and must be greater than the start date",
                                },
                                "sku_name": {
                                    "type": "string",
                                    "description": "The name of the SKU for which promotion needs to be simulated. Examples of SKU names - SKU_2, SKU_60, SKU_200, SKU_43",
                                },
                            },
                            "required": ["start_date", "end_date", "sku_name"],
                        },
                    }
                ]
                modified_user_query = summarize_question_context(
                    convo_history=self.history,
                    user_query=query,
                    llm=self.llm,
                )
                llm_messages = openai_functions(
                    llm_config=self.llm,
                    functions=promo_simulation_requirements,
                    query=modified_user_query,
                    messages=[],
                )
                llm_response = llm_messages[-1]
                if llm_response.function_call:
                    # response = "The extracted information is = {info}".format(
                    #     info=llm_response["function_call"]["arguments"]
                    # )
                    promo_args = json.loads(llm_response.function_call.arguments)
                    df = self.get_current_promo_calendar(
                        start_date=promo_args["start_date"],
                        end_date=promo_args["end_date"],
                        sku_list=[promo_args["sku_name"]],
                    )
                    input_widget = self.get_grid_table_input(df=df)
                    widgets.append(input_widget)
                    response = "Please configure your simulator inputs to calculate incremental revenue."
                else:
                    response = llm_response.content

        except Exception as e:
            logging.error(e)
            response = "Query failed"
            know_more = ""
        return {
            "type": "promotion_simulator",
            "response": {
                "text": response,
                "sql_query": know_more,
                "widgets": widgets if len(widgets) > 0 else None,
                "processed_query": "",
            },
        }

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")

    def get_current_promo_calendar(self, start_date, end_date, sku_list, retailer="Retailer 1"):
        start_date = datetime.datetime.strptime(start_date, "%d/%m/%Y")
        end_date = datetime.datetime.strptime(end_date, "%d/%m/%Y")
        # load the as-is from db
        con_str = "postgresql://ergo42:Mathco_42@minerva-server.postgres.database.azure.com:5432/dev"
        schema = "test_jd"
        # scenario_promo_calendar['data_level'] # filter sku (need to update logic based on info from UI) - period_end_date, product_ppg, weighted_tdp, promo_mechanism, final_display_type, tactic, expected_sales
        query = f"""Select * from current_promo_calendar
        where period_end_date > '{start_date}' AND
        period_end_date <= '{end_date}' AND
        market_long_description = '{retailer}' AND
        product in ({','.join(f"'{level}'" for level in sku_list)})"""
        current_promo_calendar = self.get_ingested_data_sql(con_str, schema, query)
        current_promo_calendar_df = current_promo_calendar[
            [
                "product",
                "period_end_date",
                "tactic",
                "promo_mechanism",
                "final_display_type",
                "weighted_tdp",
                "non_promo_price",
            ]
        ]
        return current_promo_calendar_df

    def run_scenario(self, scenario_promo_calendar, retailer="Retailer 1"):
        # values for setting the outcome
        avg_sales = 25992
        sku_mapping = {
            "SKU_3": 2.00035,
            "SKU_42": 1.4,
            "SKU_44": 2.5,
            "SKU_45": 3.00755,
            "SKU_2": 2.00115,
            "SKU_28": 1.02667,
            "SKU_9": 1.4,
            "SKU_25": 0.649662,
            "SKU_4": 1.4,
            "SKU_39": 1.7,
            "SKU_43": 0.7,
            "SKU_30": 1.19887,
            "SKU_10": 1.37853,
            "SKU_36": 2.25,
            "SKU_55": 3.45868,
            "SKU_46": 3.50452,
            "SKU_47": 1.35,
            "SKU_37": 1.7,
            "SKU_49": 2.5,
            "SKU_29": 1.7,
            "SKU_0": 3.50932,
            "SKU_5": 1.0,
            "SKU_19": 3.39,
            "SKU_20": 3.39,
            "SKU_14": 5.7748,
            "SKU_27": 0.85,
            "SKU_22": 1.1,
            "SKU_48": 1.5,
            "SKU_58": 0.85,
            "SKU_34": 3.47503,
            "SKU_33": 6.99,
            "SKU_8": 1.0,
            "SKU_52": 2.0,
            "SKU_17": 3.99,
            "SKU_32": 1.42677,
            "SKU_18": 3.39,
            "SKU_1": 3.50654,
            "SKU_41": 0.85,
            "SKU_53": 2.34962,
            "SKU_54": 1.0,
            "SKU_35": 2.475,
            "SKU_56": 3.29,
            "SKU_62": 1.2,
            "SKU_15": 2.29,
            "SKU_12": 3.29,
            "SKU_50": 0.7,
            "SKU_59": 1.3125,
            "SKU_51": 2.48874,
            "SKU_24": 1.4,
            "SKU_57": 4.48101,
            "SKU_63": 1.0,
            "SKU_7": 2.49501,
            "SKU_11": 4.5,
            "SKU_13": 0.286784,
            "SKU_23": 3.5,
            "SKU_6": 0.95,
            "SKU_16": 1.2,
            "SKU_31": 2.31214,
            "SKU_40": 1.59,
            "SKU_60": 1.0,
            "SKU_64": 1.7,
            "SKU_67": 1.19,
            "SKU_74": 1.69,
            "SKU_65": 1.25,
            "SKU_38": 1.45,
            "SKU_68": 1.59,
            "SKU_69": 2.69,
            "SKU_70": 2.49,
            "SKU_73": 0.65,
            "SKU_71": 5.0,
            "SKU_72": 1.29,
            "SKU_26": 1.84409,
            "SKU_61": 1.3,
            "SKU_66": 2.6784,
            "SKU_21": 1.36364,
            "SKU_78": 5.5,
            "SKU_79": 2.5,
            "SKU_80": 1.0,
            "SKU_82": 0.98,
            "SKU_83": 1.5,
            "SKU_84": 2.53593,
            "SKU_85": 2.49833,
            "SKU_86": 1.4,
            "SKU_81": 7.67308,
            "SKU_77": 0.96,
            "SKU_87": 2.5,
            "SKU_88": 2.2,
            "SKU_89": 1.39,
            "SKU_75": 2.0,
            "SKU_76": 2.5,
            "SKU_90": 4.49,
        }
        promo_mechanism_mapping = {
            "$2.25 ": 2.25,
            "3f$3.00": 1.0,
            "No Promo": 0.4,
            "$1.50 ": 1.5,
            "2f$2.50": 1.25,
            "5f$5": 1.0,
            "4f$4": 1.0,
            "$3.50 ": 3.5,
            "$2.50 ": 2.5,
            "3f$4.00": 1.33333,
            "4f$3.00": 0.75,
            "$3.00 ": 3.0,
            "4f$5.00": 1.25,
            "$2.75 ": 2.75,
            "2f$6.00": 3.0,
            "$1.75": 1.75,
        }
        final_display_type_mapping = {
            "Shelf": 1.0,
            "No Promo": 0.5,
            "Gondola End": 1.5,
            "Front of Store": 1.7,
            "Side Stack / Ladder Rack": 0.8,
        }
        tactic_mapping = {"TPC": 1.3, "Multibuy": 1.0, "No Promo": 0.8}

        # create expected sales column for scenario
        scenario_promo_calendar["scenario_expected_sales"] = avg_sales
        for index, row in scenario_promo_calendar.iterrows():
            scenario_promo_calendar.loc[index, "scenario_expected_sales"] = (
                avg_sales
                * tactic_mapping.get(row["tactic"], 1.1)
                * final_display_type_mapping.get(row["final_display_type"], 1)
                * promo_mechanism_mapping.get(row["promo_mechanism"], 1.1)
                * sku_mapping.get(row["product"], 1.2)
                * ((row["weighted_tdp"] + 50) / 100)
            )
        # coverting period end date str column to datetime format for the merge
        scenario_promo_calendar["period_end_date"] = [
            datetime.datetime.date(datetime.datetime.strptime(date, "%Y-%m-%d"))
            for date in scenario_promo_calendar["period_end_date"]
        ]
        # load the as-is from db
        con_str = "postgresql://ergo42:Mathco_42@minerva-server.postgres.database.azure.com:5432/dev"
        schema = "test_jd"
        # identify the data required
        min_date = scenario_promo_calendar["period_end_date"].min()
        max_date = scenario_promo_calendar["period_end_date"].max()
        # Get the unique values in the DataFrame
        unique_values = scenario_promo_calendar["product"].unique()
        # Convert the unique values to a list
        sku_list = list(unique_values)
        # scenario_promo_calendar['data_level'] # filter sku (need to update logic based on info from UI) - period_end_date, product_ppg, weighted_tdp, promo_mechanism, final_display_type, tactic, expected_sales
        query = f"""Select * from current_promo_calendar
        where period_end_date >= '{min_date}' AND
        period_end_date <= '{max_date}' AND
        market_long_description = '{retailer}' AND
        product in ({','.join(f"'{level}'" for level in sku_list)})"""
        current_promo_calendar = self.get_ingested_data_sql(con_str, schema, query)
        # Compare As-Is to simulated scenario
        # Merging DataFrames
        merged_df = pd.merge(
            current_promo_calendar,
            scenario_promo_calendar,
            on=["product", "period_end_date"],
            how="inner",
        )
        # writing back to the app dbs

        # Get the current time
        now = datetime.datetime.now()
        # Format the current time in the specified format
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S.%f")
        x = (
            "Copilot"
            + " | "
            + retailer
            + " | "
            + merged_df["product_category"][0]
            + " | "
            + str(len(sku_list))
            + " PPG "
            + " | "
            + str(min_date)
            + " to "
            + str(max_date)
            + " | "
            + str(datetime.datetime.now().ctime())
        )
        data = [
            [
                formatted_time,
                formatted_time,
                "Active",
                json.dumps(
                    {
                        "Country": "USA",
                        "Retailer": retailer,
                        "Category": merged_df["product_category"][0],
                        "SubCategory": merged_df["product_subcategory"][0],
                        "PPGCluster": sku_list,
                        "YearlyQuarterly": ["2023 Q4"],
                        "Month": ["2023 November"],
                        "Week": ["2023 Week 44"],
                    }
                ),
                x,
                x,
            ]
        ]
        slice_write_to_db = pd.DataFrame(
            data,
            columns=[
                "createdon",
                "modifiedon",
                "slicestatus",
                "slicefilter",
                "slicename",
                "viewname",
            ],
        )
        # write to slice table
        self.write_data(con_str, schema, "slice_selections_mo", slice_write_to_db)
        # write to scenario db
        # scenario_write_to_db=merged_df[['period_end_date', 'market_long_description', 'product_category', 'product_subcategory', 'product', 'promo__flag', 'week', 'year', 'avg_price', 'weighted_tdp_y', 'price_per_kg', 'promo_mechanism_y', 'final_display_type_y', 'tactic_y', 'weight_in_kg', 'cannibalizer_1', 'cannibalizer_2', 'cannibalizer_3', 'ptr_un_base', 'actual_ppg_sales_last_year', 'avg_price_last_year', 'tdp_last_year', 'price_per_kg_last_year', 'cann_1_avg_price', 'cann_1_price_per_kg', 'cann_2_avg_price', 'cann_2_price_per_kg', 'cann_3_avg_price', 'cann_3_price_per_kg']]
        # TODO - update the columns needed for db
        scenario_write_to_db = merged_df
        scenario_write_to_db["created_on"] = formatted_time
        scenario_write_to_db["modified_on"] = formatted_time
        # scenario_write_to_db['predicted_ppg_sales_model_op']=merged_df['scenario_expected_sales']
        scenario_write_to_db["slice_name"] = x
        scenario_write_to_db["scenario_name"] = (
            "Copilot | Scenario | "
            + str(min_date)
            + " to "
            + str(max_date)
            + " | "
            + str(datetime.datetime.now().ctime())
        )
        scenario_write_to_db["slice_ppg_flag"] = True
        # Renaming the _y columns to column names present in the DB
        scenario_write_to_db = scenario_write_to_db.rename(
            columns={
                "weighted_tdp_y": "weighted_tdp",
                "promo_mechanism_y": "promo_mechanism",
                "final_display_type_y": "final_display_type",
                "tactic_y": "tactic",
                "non_promo_price_y": "non_promo_price",
            }
        )
        scenario_write_to_db_final = scenario_write_to_db[
            [
                "period_end_date",
                "week",
                "year",
                "product_category",
                "product_subcategory",
                "product",
                "market_long_description",
                "weight_per_unit",
                "pack_size",
                "weight_in_kg",
                "promo__flag",
                "weighted_tdp",
                "promo_mechanism",
                "final_display_type",
                "tactic",
                "promo_mechanic_pack_feature",
                "week_of_promo",
                "length_of_promo",
                "perc_promo_completed",
                "promo_price",
                "non_promo_price",
                "avg_price",
                "price_per_kg",
                "week_since_last_promo",
                "promo_fraction",
                "cannibalizer_1",
                "cannibalizer_2",
                "cannibalizer_3",
                "competitor_cannibalizer_1",
                "competitor_cannibalizer_2",
                "competitor_cannibalizer_3",
                "cannibalizer_1_weight_per_unit",
                "cannibalizer_1_pack_size",
                "cannibalizer_1_weight_in_kg",
                "cann_1_promo_flag",
                "cann_1_promo_mechanism",
                "cann_1_final_display_type",
                "cann_1_tactic",
                "cann_1_week_of_promo",
                "cann_1_length_of_promo",
                "cann_1_week_since_last_promo",
                "cann_1_promo_price",
                "cann_1_non_promo_price",
                "cann_1_avg_price",
                "cann_1_price_per_kg",
                "cann_1_weighted_tdp",
                "cannibalizer_2_weight_per_unit",
                "cannibalizer_2_pack_size",
                "cannibalizer_2_weight_in_kg",
                "cann_2_promo_flag",
                "cann_2_promo_mechanism",
                "cann_2_final_display_type",
                "cann_2_tactic",
                "cann_2_week_of_promo",
                "cann_2_length_of_promo",
                "cann_2_week_since_last_promo",
                "cann_2_promo_price",
                "cann_2_non_promo_price",
                "cann_2_avg_price",
                "cann_2_price_per_kg",
                "cann_2_weighted_tdp",
                "cannibalizer_3_weight_per_unit",
                "cannibalizer_3_pack_size",
                "cannibalizer_3_weight_in_kg",
                "cann_3_promo_flag",
                "cann_3_promo_mechanism",
                "cann_3_final_display_type",
                "cann_3_tactic",
                "cann_3_week_of_promo",
                "cann_3_length_of_promo",
                "cann_3_week_since_last_promo",
                "cann_3_promo_price",
                "cann_3_non_promo_price",
                "cann_3_avg_price",
                "cann_3_price_per_kg",
                "cann_3_weighted_tdp",
                "month",
                "l12w_percent_subcat_sales_volume",
                "product_ppg_promo_depth",
                "cann_1_promo_depth",
                "cann_2_promo_depth",
                "cann_3_promo_depth",
                "lag1_promo_depth",
                "lag2_promo_depth",
                "wow_change_in_promo_depth",
                "distinct_ppg_count",
                "ppgs_on_promo",
                "comp_1_price_per_kg",
                "comp_2_price_per_kg",
                "comp_3_price_per_kg",
                "comp_1_avg_price",
                "comp_2_avg_price",
                "comp_3_avg_price",
                "comp_1_weighted_tdp",
                "comp_2_weighted_tdp",
                "comp_3_weighted_tdp",
                "competitor_1_weight_per_unit",
                "competitor_2_weight_per_unit",
                "competitor_3_weight_per_unit",
                "competitor_1_pack_size",
                "competitor_2_pack_size",
                "competitor_3_pack_size",
                "competitor_1_weight_in_kg",
                "competitor_2_weight_in_kg",
                "competitor_3_weight_in_kg",
                "comp_product_count",
                "cann_1_percent_diff_in_kg_price",
                "cann_2_percent_diff_in_kg_price",
                "cann_3_percent_diff_in_kg_price",
                "cann_1_percent_diff_in_unit_price",
                "cann_2_percent_diff_in_unit_price",
                "cann_3_percent_diff_in_unit_price",
                "cann_1_weight_percent_diff",
                "cann_2_weight_percent_diff",
                "cann_3_weight_percent_diff",
                "unique_barcodes",
                "new_barcode_flag",
                "base_price",
                "holiday_flag",
                "stringent_index",
                "epl_flag",
                "gdp",
                "population",
                "co2_emissions",
                "flood_warning_flag",
                "air_frost_days",
                "avg_temp",
                "rainfall_days",
                "rain_data",
                "sunshine_hours",
                "christmas_flag",
                "year_start_peak_flag",
                "school_start_flag",
                "cpi",
                "cannibalizer_1_base_price",
                "cannibalizer_2_base_price",
                "cannibalizer_3_base_price",
                "avg_price_updated",
                "redemption",
                "ptr_un_base",
                "tdp",
                "created_on",
                "modified_on",
                "slice_name",
                "scenario_name",
                "slice_ppg_flag",
                "scenario_expected_sales",
            ]
        ]
        self.write_data(con_str, schema, "predicted_scenarios_mo", scenario_write_to_db_final)
        # return the df to send to minerva graph tool
        graph_df = merged_df[["period_end_date", "expected_sales", "scenario_expected_sales"]]
        return graph_df

    def write_data(self, connection_uri, schema_name, table_name, data_frame):
        engine = None
        try:
            engine = create_engine(
                connection_uri,
                connect_args={"options": "-csearch_path={}".format(schema_name)},
            )  # Create a database engine
            data_frame.to_sql(table_name, con=engine, if_exists="append", index=False)  # Write data to table
            return True
        except Exception as e:
            print("Error establishing connection to database", e)
            return False
        finally:
            if engine is not None:
                engine.dispose()  # Dispose the database engine

    def get_ingested_data_sql(self, connection_uri, schema_name, query):
        connection = None
        engine = None
        try:
            engine = create_engine(
                connection_uri,
                connect_args={"options": "-csearch_path={}".format(schema_name)},
            )
            connection = engine.connect()
            sql_query = pd.read_sql_query(query, connection)
            data_frame = pd.DataFrame(sql_query)
            return data_frame
        except Exception as error:
            print("Error while connecting to Db : " + str(error))
            return pd.DataFrame()
        finally:
            if connection is not None:
                connection.close()
            if engine is not None:
                engine.dispose()

    def get_grid_table_input(self, df):
        return {
            "type": "input-form",
            "value": {
                "layout": [
                    {
                        "grid": 12,
                        "element": "table-input",
                        "elementProps": {
                            "gridTableProps": {
                                "coldef": [
                                    {
                                        "headerName": "SKU",
                                        "field": "product",
                                        "editable": False,
                                        "cellRenderer": "text",
                                        "align": "right",
                                    },
                                    {
                                        "headerName": "Week",
                                        "field": "period_end_date",
                                        "editable": False,
                                        "cellRenderer": "text",
                                    },
                                    {
                                        "headerName": "Tactic",
                                        "field": "tactic",
                                        "editable": True,
                                        "cellRenderer": "text",
                                        "cellEditor": "select",
                                        "cellEditorParams": {"options": ["TPC", "Multibuy", "No Promo"]},
                                    },
                                    {
                                        "headerName": "Promo Mechanism",
                                        "field": "promo_mechanism",
                                        "editable": True,
                                        "cellRenderer": "text",
                                        "cellEditor": "select",
                                        "cellEditorParams": {
                                            "options": [
                                                "$2.25 ",
                                                "3f$3.00",
                                                "No Promo",
                                                "$1.50 ",
                                                "2f$2.50",
                                                "5f$5",
                                                "4f$4",
                                                "$3.50 ",
                                                "$2.50 ",
                                                "3f$4.00",
                                                "4f$3.00",
                                                "$3.00 ",
                                                "4f$5.00",
                                                "$2.75 ",
                                                "2f$6.00",
                                                "$1.75",
                                            ],
                                        },
                                    },
                                    {
                                        "headerName": "Display Type",
                                        "field": "final_display_type",
                                        "editable": True,
                                        "cellRenderer": "text",
                                        "cellEditor": "select",
                                        "cellEditorParams": {
                                            "options": [
                                                "Shelf",
                                                "No Promo",
                                                "Gondola End",
                                                "Front of Store",
                                                "Side Stack / Ladder Rack",
                                            ],
                                        },
                                    },
                                    {
                                        "headerName": "Weighted TDP",
                                        "field": "weighted_tdp",
                                        "editable": True,
                                        "cellRenderer": "text",
                                        "cellEditor": "input",
                                    },
                                    {
                                        "headerName": "Base Price",
                                        "field": "non_promo_price",
                                        "editable": False,
                                        "cellRenderer": "text",
                                    },
                                ],
                                "rowData": df.to_dict("records"),
                                "gridOptions": {
                                    "outerActions": [
                                        {
                                            "name": "Simulate",
                                            "variant": "outlined",
                                            "size": "small",
                                            "tool": "PromoSimulator",
                                        }
                                    ]
                                },
                            }
                        },
                    }
                ]
            },
        }
