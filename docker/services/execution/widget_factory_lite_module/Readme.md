<b> NOTE - Codex Widget Factory Lite is the proprietary repository for TheMathCompany . Contains the utils and helper code for powering the co.dx UI screens and components.Plus additional workflows and templates </b>



# Introduction

This project contains the lite version of widget factory. The objective of this package is to -

* Enable users to connect to various data sources while writing code strings. The supported data sources include -
  * File storage -
    * Azure blob storage
    * AWS S3
    * Google cloud storage (To-do)
  * SQL databases
    * mySQL
    * PostgreSQL
    * Microsoft SQL Server
  * BigQuery (To-do)
  * Snowflake (To-do)
* Conversion utilities to convert python objects  such as dataframes, lists, etc. to JSON structures which can power the co.dx UI components. The following UI components are currently supported -
  * Filters
  * Simple Table
  * Expandable table
  * Plots (Is this needed)
  * KPIs/Metrics
  * Insights
  * Grid table (To-do)
  * Switch Button View (To-do)
  * Dropdown Switch View (To-do)

# Installation




# Contributing Guidelines

## Include the author and license information as header in all files

All files (with a few exceptions such as .gitignore, requirements.txt, dockerfile, etc.) needs to have a header with author and license information. Use this template

```
#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.
#
```


## Do not use print statements

* Use logger instead of print statements, detailed info can be found here - https://docs.python.org/3/howto/logging.html
* Depending on the importance messages that need to shown, use appropriate config - DEBUG, INFO, WARN, ERROR
* Why logging is preferred over print - https://stackoverflow.com/questions/6918493/in-python-why-use-logging-instead-of-print


## Folder Structure

* The project will have one module called `codex_widget_factory_lite`
* It will have the following submodules -
  * `dataConnectors` - all data source connectors and associated modules
  * `conversionUtils` - all conversion utils to generate JSON structures for co.dx UI components


## Naming Conventions

* All modules, sub-modules and file names to follow snake case (underscore naming convention)
* Class names should be nouns, in mixed cases with the first letter of each internal word capitalized
* All methods and variable names need to follow snake case

## Usage of private variables and methods

* Hide all methods and variables that do not need to be exposed to the user by making them private
* For reference -
  * In classes - class attributes are made private by prefixing attribute names with __. Example - `__initialise_component_dict`
  * For modules - prefix _ before variable names to make them private


## Abstract Classes for Conversion Utils

All the conversion functions written for each component will inherit the abstract class `base_conversion`. The abstract class currently ensures -

* All components have a property `component_dict` (initialized as an empty dictionary) which is the dictionary representation of the component JSON structure
* All components have a property `json_string`  which returns json structure of component as string


# Documentation

`pdoc` is used to generate the module documentation. The command used to generate the documentation -

```
pdoc --html codex_widget_factory_lite/ --force
```

# Testing

The module uses `pytest` to run test cases








