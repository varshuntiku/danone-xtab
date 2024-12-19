import json

# import pandas as pd
import sqlalchemy

conn_str1 = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex"
conn_str2 = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex_product"


db_engine1 = sqlalchemy.create_engine(conn_str1)
db_engine2 = sqlalchemy.create_engine(conn_str2)

initial_theme_data = [
    {
        "name": "Red",
        "mode": "light",
        "bg_variant": "v2",
        "contrast_color": "#CC4354",
        "chart_colors": [
            "#CC4354",
            "#F66796",
            "#F6BD79",
            "#736CD6",
            "#9FBBFF",
            "#D091FC",
            "#83BD63",
            "#CBE28D",
            "#60C29F",
            "#F7E3E5",
        ],
    },
    {
        "name": "Red",
        "mode": "dark",
        "bg_variant": "v2",
        "contrast_color": "#D03C4E",
        "chart_colors": [
            "#D03C4E",
            "#E56590",
            "#E7B376",
            "#6F67D2",
            "#92ACEE",
            "#B983E0",
            "#82BB62",
            "#CBE28D",
            "#60C29F",
            "#CDB8B8",
        ],
    },
    {
        "name": "Blue",
        "mode": "light",
        "bg_variant": "v2",
        "contrast_color": "#1373E5",
        "chart_colors": [
            "#1373E5",
            "#A59CFD",
            "#62C6FC",
            "#FC6B96",
            "#F99992",
            "#FCA9F4",
            "#CAE882",
            "#80D388",
            "#EFE47E",
            "#D7CDBD",
        ],
    },
    {
        "name": "Blue",
        "mode": "dark",
        "bg_variant": "v2",
        "contrast_color": "#287DE1",
        "chart_colors": [
            "#308FFF",
            "#A384FC",
            "#62C6FC",
            "#FC6B96",
            "#FE9088",
            "#DA81D1",
            "#A3BD59",
            "#5EB567",
            "#DCD16C",
            "#6E6E82",
        ],
    },
    {
        "name": "Yellow",
        "mode": "light",
        "bg_variant": "v2",
        "contrast_color": "#FFBF00",
        "chart_colors": [
            "#FFBF00",
            "#F8B15E",
            "#C2D355",
            "#B786F5",
            "#8375E9",
            "#F363A8",
            "#52ECBE",
            "#8AD3ED",
            "#2CACA4",
            "#B5B3C2",
        ],
    },
    {
        "name": "Yellow",
        "mode": "dark",
        "bg_variant": "v2",
        "contrast_color": "#EDCE65",
        "chart_colors": [
            "#EDCE65",
            "#EA9D42",
            "#BFCC6B",
            "#A37FD7",
            "#7065C8",
            "#CF5692",
            "#8AD3ED",
            "#45CAA4",
            "#25938E",
            "#AAA7B9",
        ],
    },
    {
        "name": "Green",
        "mode": "light",
        "bg_variant": "v2",
        "contrast_color": "#37BE8F",
        "chart_colors": [
            "#37BE8F",
            "#A6D8FB",
            "#B3E78D",
            "#C084EB",
            "#FC8AD2",
            "#8980EB",
            "#F88981",
            "#F8C67D",
            "#FD9CB8",
            "#EADEC9",
        ],
    },
    {
        "name": "Green",
        "mode": "dark",
        "bg_variant": "v2",
        "contrast_color": "#0FC183",
        "chart_colors": [
            "#0FC183",
            "#80C4F2",
            "#BFF299",
            "#C584F4",
            "#FD7DCE",
            "#948DE7",
            "#E76043",
            "#E5AA52",
            "#F28AA8",
            "#56605C",
        ],
    },
    {
        "name": "Purple",
        "mode": "light",
        "bg_variant": "v2",
        "contrast_color": "#8257FC",
        "chart_colors": [
            "#8257FC",
            "#70A1FC",
            "#E69DFF",
            "#F6BB75",
            "#EF9880",
            "#F96CAC",
            "#D9F196",
            "#94C077",
            "#72D2CD",
            "#8DE6E7",
        ],
    },
    {
        "name": "Purple",
        "mode": "dark",
        "bg_variant": "v2",
        "contrast_color": "#AA8EFC",
        "chart_colors": [
            "#7D61D2",
            "#608BDB",
            "#C387DB",
            "#FEAB49",
            "#DE775D",
            "#D45190",
            "#B8CE82",
            "#7EA468",
            "#73C0B7",
            "#484661",
        ],
    },
    {
        "name": "Orange",
        "mode": "light",
        "bg_variant": "v2",
        "contrast_color": "#FCA74A",
        "chart_colors": [
            "#FCA74A",
            "#FA8585",
            "#F0E18C",
            "#C6A2F3",
            "#A397F3",
            "#FFA0CE",
            "#BEF49A",
            "#7BDAC9",
            "#ADDDFF",
            "#E2DACB",
        ],
    },
    {
        "name": "Orange",
        "mode": "dark",
        "bg_variant": "v2",
        "contrast_color": "#EE9636",
        "chart_colors": [
            "#EE9636",
            "#E56669",
            "#D9C96B",
            "#A87BE3",
            "#7065C9",
            "#CF5692",
            "#9ED97B",
            "#65C0B1",
            "#4C9FDA",
            "#CAC1B2",
        ],
    },
]

for i, el in enumerate(initial_theme_data):
    if i % 2 == 0:
        db_engine2.execute(f"""INSERT INTO public.app_theme (name) VALUES('{el['name']}');""")

    db_engine2.execute(
        f"""INSERT INTO public.app_theme_mode (mode, bg_variant, contrast_color, chart_colors, params, app_theme_id) select '{el['mode']}', '{el['bg_variant']}', '{el['contrast_color']}', '{json.dumps(el['chart_colors'])}', '{json.dumps({})}', id from app_theme where name='{el['name']}';"""
    )

# ### end Alembic commands ###


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # correcting the data anomaly in functions table and container_mapping table

    # Step 1: soft delete functions from functions table with deleted industry
    db_engine2.execute(
        """update "functions" set deleted_at=now() where industry_id in (select id from industry i where i.deleted_at is not null)"""
    )

    # Step2: Function duplicate soft delete:
    db_engine2.execute(
        """
update "functions" set deleted_at = now() where id in (
    select id from "functions" f1 inner join(
        select min(id) as min_id, industry_id, function_name
        from "functions" f where deleted_at is null
        group by industry_id, function_name
        having count(*) > 1
        ) q1 on f1.industry_id=q1.industry_id and f1.function_name=q1.function_name where deleted_at is null and f1.id != q1.min_id)
"""
    )

    # Step 3: soft delete container_mapping with deleted industries or functions
    db_engine2.execute(
        """
update container_mapping set deleted_at = now() where id in (
    SELECT
    id
    from container_mapping cm where industry_id in (
        select id from industry i where i.deleted_at is not null
        ) or function_id in (
        select id from "functions" f where f.deleted_at is not null
        ))
"""
    )

    # step 4: soft delete container mapping for duplicate container id, industry id and function id
    db_engine2.execute(
        """
update container_mapping set deleted_at = now() where id in (
    select id from container_mapping c1 inner join
    (select
     min(id) as min_id, container_id, function_id, industry_id
     FROM
     container_mapping cm where deleted_at is null
     GROUP BY
     container_id, function_id, industry_id
     HAVING
     COUNT(*) > 1
     ) q1 on c1.container_id=q1.container_id and c1.industry_id=q1.industry_id and c1.function_id=q1.function_id where deleted_at is null and c1.id != q1.min_id)
"""
    )

    # step 5: insert a miscellaneous industry to address all the industry less containers
    db_engine2.execute(
        """
INSERT INTO public.industry(created_at, updated_at, deleted_at, industry_name, logo_name, created_by, updated_by, deleted_by, horizon, color, "level", description)
select now(), NULL, NULL, 'Miscellaneous Industry', 'Technology',
    NULL, NULL, NULL, 'vertical', NULL, NULL, ''
where not exists (
    select id from public.industry where industry_name = 'Miscellaneous Industry'
)
"""
    )

    # step 6: insert a miscellaneous function to address all the function less containers
    db_engine2.execute(
        """
INSERT INTO public."functions"
(created_at, updated_at, deleted_at, function_name, description,
 logo_name, created_by, updated_by, deleted_by, parent_function_id, color, "level")
select now(), NULL, NULL, 'Miscellaneous Function', '', 'RetailCustomerInsightsIcon', NULL, NULL, NULL, NULL, NULL, null
where not exists (
    select f.id from public."functions" f inner join industry i on f.industry_id = i.id where i.industry_name = 'Miscellaneous Industry'
)
"""
    )

    # step 7: update function with Miscellaneous Industry id
    db_engine2.execute(
        """
update public."functions"
set
industry_id = (select id from "industry" where industry_name='Miscellaneous Industry')
where industry_id is null
"""
    )

    # step 8: insert container into container mapping table which doesn't have mapping with any function/industry
    db_engine2.execute(
        """
insert into container_mapping(container_id)
select container_id from app where container_id not in (select container_id from container_mapping cm)
"""
    )

    # step 9: update container_mapping records which is not mapped with any industry or fucntion
    db_engine2.execute(
        """
update container_mapping
set
industry_id = (select i.id from "functions" f inner join industry i on f.industry_id = i.id where i.industry_name = 'Miscellaneous Industry' and function_name='Miscellaneous Function'),
function_id = (select f.id from "functions" f inner join industry i on f.industry_id = i.id where i.industry_name = 'Miscellaneous Industry' and function_name='Miscellaneous Function')
where industry_id is null or function_id is null
"""
    )

    # ### end Alembic commands ###
