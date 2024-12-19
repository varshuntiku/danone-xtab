import plotly.graph_objects as go


def get_simulator_plot(df):
    """
    Simulator plot
    """

    # Create the figure
    fig = go.Figure()

    # Check which column to use for filtering
    if "category" in df.columns:
        filter_level = "category"
    else:
        filter_level = "product"

    df[filter_level] = df[filter_level].astype(str)

    products = df[filter_level].unique()

    # Initial visibility lists
    initial_visibility_updated = []
    initial_visibility_baseline = []

    # Create a trace for each product
    for product in products:
        product_df = df[df[filter_level] == product]
        # For updated sales, make the first product's trace visible
        visible_updated = True if product == products[0] else False
        initial_visibility_updated.append(visible_updated)
        fig.add_trace(
            go.Scatter(
                x=product_df["Date"],
                y=product_df["updated_sales"],
                mode="lines+markers",
                name=f"Updated Sales {product}",
                visible=visible_updated,  # Set initial visibility based on the product
            )
        )
        # For baseline sales, make the first product's trace visible
        visible_baseline = True if product == products[0] else False
        initial_visibility_baseline.append(visible_baseline)
        fig.add_trace(
            go.Scatter(
                x=product_df["Date"],
                y=product_df["baseline_sales"],
                mode="lines+markers",
                name=f"Baseline Sales {product}",
                visible=visible_baseline,  # Set initial visibility based on the product
            )
        )

    # Create the dropdown menus
    updatemenus = [
        dict(
            buttons=[
                dict(
                    args=[{"visible": [product == p for product in products for _ in range(2)]}],
                    label=str(p),
                    method="update",
                )
                for p in products
            ],
            direction="down",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=1,
            xanchor="right",
            y=1.5,  # Increasing this will move the dd up
            yanchor="top",
        )
    ]

    # Update the layout
    fig.update_layout(
        updatemenus=updatemenus,
        title=f"Sales Over Time by {filter_level.capitalize()}",
        xaxis_title="Date",
        yaxis_title="Sales",
        hovermode="x unified",
        xaxis=dict(showgrid=False, showline=True, zeroline=False),
        yaxis=dict(showgrid=False, showline=True, zeroline=False),
        legend=dict(
            x=0.5,  # Center the legend horizontally
            xanchor="center",  # Center the legend's x-anchor to the x position
            y=-0.6,  # Position the legend below the x-axis title
            yanchor="top",  # Anchor the legend's top to the y position
            orientation="h",  # Make the legend horizontal
        ),
        margin=dict(l=40, r=40, t=40, b=80),  # Increase the bottom margin to accommodate the legend
        # legend=dict(
        #     orientation="h",
        #     yanchor="bottom",
        #     y=-0.3,
        #     xanchor="center",
        #     x=0.5
        # ),
        # margin=dict(l=20, r=20, t=100, b=80)  # Adjust margins if necessary
    )

    return fig


def get_simulator_plot_o(df):
    """
    Simulator plot
    """

    # Create the figure
    fig = go.Figure()

    # Get the list of unique products
    if "category" in df.columns:
        filter_level = "category"
    else:
        filter_level = "product"

    df[filter_level] = df[filter_level].astype(str)

    products = df[filter_level].unique()

    # Create a trace for each product
    traces = []
    for product in products:
        product_df = df[df[filter_level] == product]
        traces.append(
            go.Scatter(
                x=product_df["Date"],
                y=product_df["updated_sales"],
                mode="lines+markers",
                name=f"Updated Sales {product}",
            )
        )
        traces.append(
            go.Scatter(
                x=product_df["Date"],
                y=product_df["baseline_sales"],
                mode="lines+markers",
                name=f"Baseline Sales {product}",
                visible=False,  # Initially hide the baseline sales
            )
        )

    # Add all traces to the figure
    for trace in traces:
        fig.add_trace(trace)

    # Create the dropdown menus
    updatemenus = [
        dict(
            buttons=list(
                [
                    dict(
                        args=[
                            {
                                "visible": [
                                    str(product) == p for trace in traces for product in (trace.name.split()[-1],)
                                ]
                            }
                        ],
                        label=str(p),
                        method="update",
                    )
                    for p in products
                ]
            ),
            direction="down",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=1,
            xanchor="right",
            y=1.15,
            yanchor="top",
        )
    ]

    # Add annotation for the dropdown label
    annotations = [
        dict(
            text="Select Product",  # Label text
            x=1,
            xanchor="right",
            xref="paper",
            y=1.35,  # Adjust y position of label
            yanchor="bottom",
            yref="paper",
            showarrow=False,
            align="right",
        )
    ]

    # Update the layout
    fig.update_layout(
        updatemenus=updatemenus,
        annotations=annotations,
        title=f"Sales Over Time by {filter_level}",
        xaxis_title="Date",
        yaxis_title="Sales",
        legend_title="Legend",
        hovermode="x unified",
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=False),
    )

    fig.update_layout(
        xaxis=dict(
            title="Date",
            showgrid=False,  # Remove the x-axis grid lines
            showline=True,  # Show the x-axis line,
            zeroline=True,
            # linecolor='black',  # X-axis line color
        ),
        yaxis=dict(
            title="Sales",
            showgrid=False,  # Remove the y-axis grid lines
            showline=True,  # Show the y-axis line
            zeroline=True,
            # linecolor='black',  # Y-axis line color
        ),
    )

    # Set the first product's sales to be visible when the graph is first rendered
    # initial_product = products[0]
    # for i, trace in enumerate(traces):
    #     if initial_product in trace.name:
    #         trace.visible = True

    return fig


def single_plot(df):
    # Create the figure
    fig = go.Figure()

    # Add the updated sales trace
    fig.add_trace(go.Scatter(x=df["Date"], y=df["updated_sales"], mode="lines", name="Updated Sales"))

    # Add the baseline sales trace
    fig.add_trace(go.Scatter(x=df["Date"], y=df["baseline_sales"], mode="lines", name="Baseline Sales"))

    # Update layout to add axis lines without gridlines
    fig.update_layout(
        title="Sales Over Time",
        xaxis=dict(
            title="Date",
            showgrid=False,  # Remove the x-axis grid lines
            showline=True,  # Show the x-axis line,
            zeroline=True,
            # linecolor='black',  # X-axis line color
        ),
        yaxis=dict(
            title="Sales",
            showgrid=False,  # Remove the y-axis grid lines
            showline=True,  # Show the y-axis line
            zeroline=True,
            # linecolor='black',  # Y-axis line color
        ),
        # legend=dict(
        #     x=1,  # Anchor legend to the right
        #     xanchor='auto',  # Auto-adjust the exact position
        #     y=1,  # Anchor legend to the top
        #     yanchor='auto',  # Auto-adjust the exact position
        # ),
        # margin=dict(l=0, r=0, t=0, b=0),
        # showlegend=True
        legend=dict(
            x=0.5,  # Center the legend horizontally
            xanchor="center",  # Center the legend's x-anchor to the x position
            y=-0.5,  # Position the legend below the x-axis title
            yanchor="top",  # Anchor the legend's top to the y position
            orientation="h",  # Make the legend horizontal
        ),
        margin=dict(l=40, r=40, t=40, b=80),  # Increase the bottom margin to accommodate the legend
        showlegend=True,
    )
    # Adjust margin to ensure entire legend is visible if needed
    # fig.update_layout(margin=dict(l=40, r=40, t=40, b=20))

    return fig


def multi_plot(df):
    # Initialize figure with subplots
    fig = go.Figure()

    # Add traces, one for each selection option
    for product in df["product"].unique():
        fig.add_trace(
            go.Scatter(
                x=df[df["product"] == product]["Date"],
                y=df[df["product"] == product]["updated_sales"],
                mode="lines",
                name=f"Updated Sales {product}",
                visible=(product == "A"),  # Only show 'A' by default
            )
        )

        fig.add_trace(
            go.Scatter(
                x=df[df["product"] == product]["Date"],
                y=df[df["product"] == product]["baseline_sales"],
                mode="lines",
                name=f"Baseline Sales {product}",
                visible=(product == "A"),  # Only show 'A' by default
            )
        )

    # Create a list of dictionaries for the dropdown
    # updatemenus = [
    #     {
    #         'buttons': [
    #             {
    #                 'method': 'update',
    #                 'label': product,
    #                 'args': [
    #                     {'visible': [(el == f'Updated Sales {product}' or el == f'Baseline Sales {product}')
    #                                  for el in df['product'].unique() for _ in (0, 1)]},
    #                 ]
    #             }
    #             for product in df['product'].unique()
    #         ],
    #         'direction': 'down',
    #         'showactive': True,
    #     }
    # ]

    updatemenus = [
        {
            "buttons": [
                {
                    "args": [
                        "visible",
                        [True if val.startswith(product) else False for val in df["product"].unique() for _ in (0, 1)],
                    ],
                    "label": product,
                    "method": "restyle",
                }
                for product in df["product"].unique()
            ],
            "direction": "down",
            "pad": {"r": 10, "t": 10},
            "showactive": True,
            "x": 0.5,
            "xanchor": "center",
            "y": 1.2,  # This has been increased to move the dropdown up
            "yanchor": "top",
        }
    ]

    # Customize the layout
    fig.update_layout(
        updatemenus=updatemenus,
        title="Sales Over Time",
        xaxis=dict(
            title="Date",
            showline=True,  # add x-axis line
            showgrid=False,  # remove gridlines
            # linecolor='black',  # x-axis line color
        ),
        yaxis=dict(
            title="Sales",
            showline=True,  # add y-axis line
            showgrid=False,  # remove gridlines
            # linecolor='black',  # y-axis line color
        ),
        legend=dict(
            title_text="Legend",  # Set the legend title
        ),
        hovermode="x unified",
    )

    # Set the layout for the dropdown
    fig.update_layout(
        updatemenus=[
            {
                "buttons": [
                    {
                        "args": [
                            "visible",
                            [
                                True if val.startswith(product) else False
                                for val in df["product"].unique()
                                for _ in (0, 1)
                            ],
                        ],
                        "label": product,
                        "method": "restyle",
                    }
                    for product in df["product"].unique()
                ],
                "direction": "down",
                "pad": {"r": 10, "t": 10},
                "showactive": True,
                "x": 0,
                "xanchor": "left",
                "y": 1.15,
                "yanchor": "top",
            }
        ]
    )
    return fig
