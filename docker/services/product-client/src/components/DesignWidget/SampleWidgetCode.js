export default {
    code: `
    import pandas as pd
    import plotly.graph_objs as go
    from plotly.offline import plot
    from bubbly.bubbly import bubbleplot
    import os
    from collections import namedtuple

    CON = {
        'INTS': ['int16', 'int32', 'int64', 'int'],
        'FLOATS': ['float16', 'float32', 'float64', 'float'],
        'COMPLEX': ['complex64', 'complex128'],
        'NUMS': ['int', 'int16', 'int32', 'int64', 'float16', 'float32', 'float64','float'],
        'STRINGS': [],
        'DATES': [],
        'NAN': ['None', '', ' ', 'nan', 'Nan', 'NaN']
    }

    CON = namedtuple("CONSTANTS", CON.keys())(*CON.values())

    @pd.api.extensions.register_dataframe_accessor("bivariate")
    class bivariate(object):

        def __init__(self, pandas_obj):
            self._obj = pandas_obj

        def generateStackedBarPlot(self, col_x, col_y, x_label= None, y_label=None, plot_title=None,show_text=True):
            """A stacked-bar plotly graph with categorical variable on both X and Y
            axis.

            Parameters
            ----------
            col_x : string, required
                Column Name of categorical variable in dataframe.
            col_y : string, required
                Column Name of categorical variable in dataframe.
            x_label : string, optional (default=None)
                User input name for x-axis
            y_label : string, optional (default=None)
                User input name for y-axis
            plot_title: string, optional (default=None)
                User input name for title
            show_text : boolean, optional (default=True)
                If show text is False percentage of each decile will only be present on hover
            Usage
            --------
            >>> df.bivariate.generateStackedBarPlot("categoricalVariable1","categoricalVariable2")
            >>>

            Returns
            -------
            Plotly Object
                    The statement 'plot(fig, config = config)' plots the stacked bar plot in a new tab of the default web browser
            """
            if x_label is None:
                column_x = col_x
            else:
                column_x = x_label

            if y_label is None:
                column_y = col_y
            else:
                column_y = y_label

            if plot_title is None:
                plot_title = column_y+' - '+column_x

            if col_x!=col_y:
                layout = go.Layout(
                    title = plot_title,
                    xaxis=dict(
                        title=column_x,
                        showline=True
                        ),
                        yaxis=dict(
                            title=column_y,
                            showline=True
                        ),
                        barmode='stack'
                        )

                mybar=self._obj.groupby([col_x,col_y])[col_y].count().reset_index(name='count')
                data=[]

                for i in self._obj[col_y].unique():
                    if show_text == True:
                        data.append(go.Bar(
                            x=mybar[col_x][mybar[col_y]==i],
                            y=mybar['count'][mybar[col_y]==i],
                            text=[round(i,2) for i in mybar['count'][mybar[col_y]==i]], textposition='auto',textfont=dict(family='opensans',size=10),
                            name=str(i).lower()))
                    else:
                        data.append(go.Bar(
                            x=mybar[col_x][mybar[col_y]==i],
                            y=mybar['count'][mybar[col_y]==i],
                            name=str(i).lower()))
                fig = go.Figure(data=data,layout=layout)

                return fig
            else:
                return go.Figure(data=data, layout=go.Layout(title="Please select two seperate columns"))

        def generateScatterPlot(self, col_x, col_y, category_color=None, x_label=None, y_label=None, plot_title=None):
            """A scatter plot is opened up in a new tab of the default web browser.

            Parameters
            ----------
            col_x : String, required
                The name of the first numerical column
            col_y : String, required
                Then name of the second numerical column
            category_color : String, optional (default=None)
                Name of a categorical column. This will create scatter plot where each color represent each category
            x_label : string, optional (default=None)
                User input name for x-axis
            y_label : string, optional (default=None)
                User input name for y-axis
            plot_title: string, optional (default=None)
                User input name for title
            Usage
            -----
            >>> df.bivariate.generateScatterPlot("categoricalVariable1","categoricalVariable2")
            >>>

            Returns
            -------
            Nothing
            The statement 'plot(fig, config = config)' plots the scatter plot in a new tab of the default web browser
            """

            if category_color is not None:
                data=[]
                for i in self._obj[category_color].unique():
                    data.append(go.Scatter(
                        x=self._obj[col_x][self._obj[category_color] == i],
                        y=self._obj[col_y][self._obj[category_color] == i],
                        mode='markers',
                        name=str(i).lower(),
                        marker=dict(
                            symbol='circle',
                        )
                    ))
            else:
                trace = go.Scatter(
                    x = self._obj[col_x],
                    y = self._obj[col_y],
                    mode = 'markers',
                    marker = dict(
                        color = '#EB984E')
                    )
                data = [trace]

            if x_label is None:
                column_x = col_x
            else:
                column_x = x_label

            if y_label is None:
                column_y = col_y
            else:
                column_y = y_label

            if plot_title is None:
                plot_title = 'Scatter plot between ' + column_x + " and " + column_y


            if category_color is not None:
                title = plot_title+' '+category_color

            layout = go.Layout(
                title=plot_title,
                xaxis=dict(
                        title= column_x,
                        titlefont=dict(
                                family='Courier New, monospace',
                                size=18,
                                color='#7f7f7f'
                                ),
                        zeroline=False,
                        showline=True
                        ),
                yaxis=dict(
                        title= column_y,
                        titlefont=dict(
                                family='Courier New, monospace',
                                size=18,
                                color='#7f7f7f'
                                ),
                        zeroline=False,
                        showline=True
                        )
                )
            fig = go.Figure(data=data, layout=layout)

            return fig

        def generatePlotDependent(self,col_x,col_y,event,dep_var=None,nbins=10, category_limit=20,x_label=None,y_label=None,plot_title=None,show_text=True):
            """A bar-line plotly graph with independent variable on X-Axis and
            percentage of event of dependent variable in each category/decile.

            Note : This Function will only work if dependent is categorical, use generateBarlinePlot
                if dependent is continuous.
            Parameters
            ----------
            col_x : string, required
                Name of column in dataframe df passed as string.
            col_y : string, required
                Column name of dependent variable passed as string.
            dep_var : string, optional (default=None)
                Column name of categorical variable passed as string. Can be used only when event is specified.
            event : string, required
                Category in the dependent column passed as string.
            x_label : string, optional (default=None)
                User input name for x-axis (Default=None)
            y_label : string, optional (default=None)
                User input name for y-axis (Default=None)
            plot_title: string, optional (default=None)
                User input name for title  (Default=None)
            show_text : boolean, optional (default=True)
                If show text is False percentage of each decile will only be present on hover

            Usage
            -----
            >>> df.bivariate.generatePlotDependent(col_x="excolumn_name1",col_y="excolumn_name2",event="excolumn_name2")
            >>>

            Returns
            -------
            Plotly Object
            The statement 'plot(fig, config = config)' plots the barline plot in a new tab of the default web browser
            """
            data=[]
            if dep_var==None:
                dep_var=col_y

            if x_label is None:
                column_x = col_x
            else:
                column_x = x_label

            if y_label is None:
                column_y = col_y
            else:
                column_y = y_label

            if plot_title is None:
                plot_title = "Percentage of "+column_y+" in "+column_x


            layout = go.Layout(
                title=plot_title,
                xaxis = dict(zeroline=False,
                    showline=True
                        ),
                yaxis=dict(
                    title=("Population in "+column_x).lower(),
                    zeroline=False,
                    showline=True
                ),
                yaxis2=dict(
                    title= ("% of event").lower(),
                    titlefont=dict(
                        color='rgb(0, 0, 0)'
                    ),
                    tickfont=dict(
                        color='rgb(0, 0, 0)'
                    ),
                    overlaying='y',
                    side='right',
                    zeroline=False,
                    showline=True
                )
            )

            # for continuous columns
            if event!=None and (len(self._obj[col_x].unique()) > category_limit or len(self._obj[col_y].unique()) > category_limit) and event in self._obj[dep_var].unique():
                if col_x==dep_var:
                    col_x=col_y
                    col_y=dep_var
                bar = self._obj.groupby(pd.qcut(self._obj[col_x],nbins,duplicates='drop',precision=2))[col_x].count().reset_index(name='count')
                mxbar = bar[col_x].astype(str)
                mybar = bar['count']
                line=self._obj.groupby(pd.qcut(self._obj[col_x],nbins,duplicates='drop',precision=0))[col_y].value_counts().reset_index(name='count')
                myline = line.groupby([col_x])['count'].sum().reset_index()
                line=pd.merge(line,myline,how='left',on=col_x)
                line['percent']=line['count_x']/line['count_y']*100
                line['percent'][line[col_y]!=event]=0
                myline = line.groupby([col_x])['percent'].sum().reset_index()
                # Creating bar and line graphs
                if show_text == True:
                    data = [go.Bar(x=mxbar,y=mybar, name=(column_x).lower(), marker=dict(color='rgb(62,64,62)')),go.Scatter(x=mxbar,y =myline['percent'], marker=dict(color='rgb(237,112,56)'),name =(column_y).lower(), text=[round(i,2) for i in myline['percent']], textposition='bottom center',textfont=dict(family='opensans',color='rgb(245,168,65)'),mode='lines+text',yaxis='y2')]
                else:
                    data = [go.Bar(x=mxbar,y=mybar, name=(column_x).lower(), marker=dict(color='rgb(62,64,62)')),go.Scatter(x=mxbar,y =myline['percent'], marker=dict(color='rgb(237,112,56)'),name =(column_y).lower(),mode='lines',yaxis='y2')]
                return go.Figure(data=data, layout=layout)


            # for categorical columns
            elif event!=None and event in self._obj[dep_var].unique():
                if col_x==dep_var:
                    col_x=col_y
                    col_y=dep_var
                bar = pd.crosstab(self._obj[col_x],self._obj[col_y]).reset_index()
                bar['sum'] = bar.sum(axis=1)
                bar['percent']=(bar[event]/bar['sum'])*100
                if show_text == True:
                    data = [go.Bar(x=bar[col_x],y=bar['sum'], name=(column_x).lower(), marker=dict(color='rgb(62,64,62)')),go.Scatter(x=bar[col_x],y =bar['percent'], name=(column_y).lower(), marker=dict(color='rgb(237,112,56)'), text=[round(i,2) for i in bar['percent']], textposition='bottom center',textfont=dict(family='opensans',color='rgb(245,168,65)'),mode='lines+text',yaxis='y2')]
                else:
                    data = [go.Bar(x=bar[col_x],y=bar['sum'], name=(column_x).lower(), marker=dict(color='rgb(62,64,62)')),go.Scatter(x=bar[col_x],y =bar['percent'], name=(column_y).lower(), marker=dict(color='rgb(237,112,56)'),mode='lines',yaxis='y2')]
                return go.Figure(data=data, layout=layout)
            else:
                return go.Figure(data=data, layout=go.Layout(title="Given event not found in dep_var variable"))


        def generateBubblePlot(self,col_x,col_y,bubble_size, bubble_column, bubble_color=None,
                              bubble_size_scale=1, col_z=None, time_column=None,
                              x_logscale=False, y_logscale=False, z_logscale=False,
                              x_title=None, y_title=None, z_title=None, title=None, marker_opacity=None,
                              marker_border_width=None, show_slider=True, show_button=True,
                              width=None, height=None):
            """A bubble graph from plotly with continuous or categorical variable
            column for X-Axis and Y-Axis. A Categorical variables for bubble color
            and bubble group. A continuous column for bubble size.

            Parameters
            ----------
            col_x : string, required
                Column Name of continuous variable in dataframe.
            col_y : string, required
                Column Name of continuous variable in dataframe.
            bubble_size : string, required
                Column Name of a continuous variable; used to set the of bubble for each variable
            bubble_color : string, optional (default=None)
                Column Name of categorical variable; used to set color of the bubble before plotting.
            bubble_column: string, required
                Column name of categorical variable; used to group data into set of categories,
                Number of bubbles will be equal to number of unique categories in this column
            bubble_size_scale : float, optional (default=1)
                To scale the bubble size in the graph,this number will be considered as reference.
            time_column : string, optional (default=None)
                Column Name of datetime variable in dataframe.
            x_logscale : boolean, optional (default=False)
                Value by which col_x need to scale up or scale down
            y_logscale : boolean, optional (default=False)
                Value by which col_y need to scale up or scale down
            z_logscale : boolean, optional (default=False)
                Value by which col_z need to scale up or scale down
            x_title : string, optional (default=None)
                Given input will be set as title of x-axis.
                By default value is col_x
            y_title : string, optional (default=None)
                Given input will be set as title of y-axis.
                By default value is col_y
            z_title : string, optional (default=None)
                Given input will be set as title of z-axis.
                By default value is col_z
            title : string, optional (default=None)
                Title of the Plot.
                By default value is col_x+' - '+col_y+' - '+bubble_column+' - '+bubble_size
            marker_opacity : float, optional (default=None)
                Set the opacity of bubbles, value can vary between >0 to 1
            marker_border_width= float, optional (default=None)
                Width of the border of the bubbles.
            show_slider : boolean, optional (default=True)
                You can set weather or not you want to see time slider, by default value
                is True. Slider will only be visible when time_column is defined
            show_button : boolean, optional (default=True)
                You can set weather or not you want to see button along with time slider, by default value
                is True. Slider will only be visible when time_column is defined
            width : float, optional (default=None)
                This will change width of the graph.
            height : float, optional (default=None)
                This will change height of the graph.

            Usage
            -----
            >>> df.bivariate.generateBubblePlot("col_a","col_b","col_c""col_d")
            >>>

            Returns
            -------
            Nothing
            The statement 'plot(fig, config = config)' plots the bubble plot in a new tab of the default web browser
            """


            df = self._obj.copy()
            df.dropna(inplace=True)
            data=[]
            if title == None:
                title = col_x+' - '+col_y+' - '+bubble_column+' - '+bubble_size

            if bubble_color is not None and title is not None:
                title = (title+" - "+bubble_color).title()

            if x_title == None:
                x_title = (col_x).lower()

            if y_title == None:
                y_title = (col_y).lower()

            # for x or y are categorical columns
            if df[col_x].dtype in CON.NUMS and df[col_y].dtype in CON.NUMS and df[bubble_size].dtype in CON.NUMS:
                if min(df[bubble_size])<= 0:
                    k=1-min(df[bubble_size])
                    df[bubble_size]+=k
            else:
                return go.Figure(data = [], layout=go.Layout(title="Either X-Axis,Y-Axis or bubble_size are not numerical"))


            if bubble_color is not None:
                data = bubbleplot(df, x_column=col_x, y_column=col_y, bubble_column=bubble_column, z_column=col_z,
                time_column=time_column, size_column=bubble_size, color_column=bubble_color,
                x_logscale=x_logscale, y_logscale=y_logscale, z_logscale=z_logscale,
                x_title=x_title, y_title=y_title, z_title=z_title, title=title,
                scale_bubble=bubble_size_scale, marker_opacity=marker_opacity, marker_border_width=marker_border_width,
                show_slider=show_slider, show_button=show_button,
                width=width, height=height)
                return go.Figure(data = data)
            if bubble_color is None:
                data = bubbleplot(df, x_column=col_x, y_column=col_y, bubble_column=bubble_column, z_column=col_z,
                time_column=time_column, size_column=bubble_size,
                x_logscale=x_logscale, y_logscale=y_logscale, z_logscale=z_logscale,
                x_title=x_title, y_title=y_title, z_title=z_title, title=title,
                scale_bubble=bubble_size_scale, marker_opacity=marker_opacity, marker_border_width=marker_border_width,
                show_slider=show_slider, show_button=show_button,
                width=width, height=height)
            return go.Figure(data = data)

        def generateBarLinePlot(self, col_x, col_y, nbins = 10, category_limit=2, x_label=None, y_label=None, plot_title=None,show_text=True):
            """A barline plot is opened up in a new tab of the default web browser.
            If dependent variable is continuous, col_y can be set to dependent variable.

            Parameters
            ----------
            col_x : String, required
                The name of a first column
            col_y : String, required
                The name of the second column
            nbins : int, (default=10)
                The number of bins the X-axis needs to be divided into.
            category_limit : int, optional (default=2)
                Number of unique values in numerical column below which column will be considered categorical
            x_label : string, optional (default=None)
                User input name for x-axis
            y_label : string, optional (default=None)
                User input name for y-axis
            plot_title: string, optional (default=None)
                User title name
            show_text : boolean, optional (Default=True)
                If show text is False percentage of each decile will only be present on hover
            Usage
            -----
            >>> df.bivariate.generateBarLinePlot("column_x","column_y")
            >>>

            Returns
            -------
            Nothing
            The statement 'plot(fig, config = config)' plots the barline plot in a new tab of the default web browser
            """

            listObjects=[]
            for i in self._obj:
                if (self._obj[i].dtype) in CON.NUMS and len(self._obj[i].unique())>category_limit:
                    listObjects.append(i)
            cont_vars = listObjects
            data=[]
            if x_label is None:
                column_x = col_x
            else:
                column_x = x_label

            if y_label is None:
                column_y = col_y
            else:
                column_y = y_label

            if plot_title is None:
                plot_title = "Percentage of "+column_y+" in "+column_x

            layout = go.Layout(
                title=plot_title,
                xaxis = dict(zeroline=False,
                    title = (str(column_x) + " levels").lower(),
                        showline=True
                        ),
                yaxis=dict(
                    title=("Population in "+column_x).lower(),
                    zeroline=False,
                    showline=True
                    ),
                yaxis2=dict(
                    title= ("% of "+column_y).lower(),
                    titlefont=dict(
                        color='rgb(0,0,0)'
                        ),
                    tickfont=dict(
                        color='rgb(0,0,0)'
                        ),
                    overlaying='y',
                    side='right',
                    zeroline=False,
                    showline=True
                )
            )

            if(col_x in cont_vars and col_y in cont_vars):
                # creating deciles from column x and getting count in each decile
                bar = self._obj.groupby(pd.qcut(self._obj[col_x],nbins,duplicates='drop',precision=0))[col_x].count().reset_index(name='count')
                mxbar = bar[col_x].astype(str)
                mybar = bar['count']

                line = self._obj.groupby(pd.qcut(self._obj[col_x],nbins,duplicates='drop',precision=0))[col_y].sum().reset_index(name = 'sum')
                # calculating percentage of column y in decile of column x
                line['percent'] = (line['sum']/line['sum'].sum())*100

                # Creating bar and line graphs
                if show_text ==True:
                    data = [go.Bar(x=mxbar,y=mybar, name=column_x, marker=dict(color='rgb(62,64,62)')),go.Scatter(x=mxbar,y =line['percent'], name=("percent of "+column_y).lower(), marker=dict(color='rgb(237,112,56)'), text=[round(i,2) for i in line['percent']],textposition='bottom center',textfont=dict(family='opensans',color='rgb(245,168,65)'),mode='lines+text',yaxis='y2')]
                else:
                    data = [go.Bar(x=mxbar,y=mybar, name=column_x, marker=dict(color='rgb(62,64,62)')),go.Scatter(x=mxbar,y =line['percent'], name=("percent of "+column_y).lower(), marker=dict(color='rgb(237,112,56)'),mode='lines',yaxis='y2')]
                fig=go.Figure(data=data, layout=layout)
                return fig

            elif(col_x in cont_vars and col_y not in cont_vars):
                temp=col_y
                col_y=col_x
                col_x=temp

            if col_y in cont_vars:
                bar = self._obj.groupby([col_x])[col_x].count().reset_index(name='count')
                mxbar=bar[col_x]
                mybar=bar['count']
                data=[]
                line = self._obj.groupby([col_x])[col_y].sum().reset_index(name='sum')
                line['percent'] = line['sum']/line['sum'].sum()*100
                if show_text == True:
                    data = [go.Bar(x=mxbar,y=mybar, name=(column_x).lower(), marker=dict(color='rgb(62,64,62)')), go.Scatter(x=mxbar,y =line['percent'],name =("Percent of "+column_y).lower(), marker=dict(color='rgb(237,112,56)'), text=[round(i,2) for i in line['percent']], textposition='bottom center',textfont=dict(family='opensans',color='rgb(245,168,65)'),mode='lines+text',yaxis='y2')]
                else:
                    data = [go.Bar(x=mxbar,y=mybar, name=(column_x).lower(), marker=dict(color='rgb(62,64,62)')), go.Scatter(x=mxbar,y =line['percent'],name =("Percent of "+column_y).lower(), marker=dict(color='rgb(237,112,56)'),mode='lines',yaxis='y2')]
                fig=go.Figure(data=data, layout=layout)

            else:
                return go.Figure(data = [], layout=go.Layout(title="One of the column needs to be continuous to plot"))
            return fig

        def generateBivariateReport(self,dep_var,event=None, column_name=None, category_limit=20):
            """The function generates bivariate report.

            Parameters
            ----------
            dep_var : string, required
                column name of depenedent variable. Can be used only when event is specified.
            event : string, optional (default=None)
                Category in the dep_var column passed as string. Note that event can be none if column is
                continuous

            Usage
            -----
            >>> df.bivariate.generateBivariateReport("excolumn_name1","excolumn_name2")
            >>>
            Returns
            -------
            It generates bivariate report in csv file
            """
            df = self._obj
            col_y = dep_var
            if event==None and df[col_y].dtype in CON.NUMS:
                report = pd.DataFrame(columns = ['Column Name','Deciles/Category','Count','Mean'])
            else:
                report = pd.DataFrame(columns = ['Column Name','Deciles/Category','Count','Percent'])
            if column_name is None:
                column_name = list(df.columns)
                column_name = filter(lambda a: a != dep_var, column_name)
            if len(df)<category_limit:
                category_limit=len(df)/2
            for i in column_name:
                if df[i].dtype in CON.NUMS and len(df[i].unique())>category_limit:

                    # for Continuous
                    col_x=i
                    bar = df.groupby(pd.qcut(df[col_x],10,duplicates='drop',precision=0))[col_x].count().reset_index(name='count')
                    if event==None and df[col_y].dtype in CON.NUMS and len(df[i].unique())>category_limit:
                        line=df.groupby(pd.qcut(df[col_x],10,duplicates='drop',precision=0))[col_y].mean().reset_index(name='Mean')
                        bar['Column Name'] = col_x
                        cols = bar.columns.tolist()
                        cols = cols[-1:] + cols[:-1]
                        bar = bar[cols]
                        bar['Mean'] = line['Mean']
                        bar.columns = ['Column Name','Deciles/Category','Count','Mean']
                        bar['Deciles/Category'] = bar['Deciles/Category'].astype(str)
                        report = report.append(bar, ignore_index=True)
                    else:
                        line=df.groupby(pd.qcut(df[col_x],10,duplicates='drop',precision=0))[col_y].value_counts().reset_index(name='count')
                        myline = line.groupby([col_x])['count'].sum().reset_index()
                        line=pd.merge(line,myline,how='left',on=col_x)
                        line['percent']=line['count_x']/line['count_y']*100
                        line['percent'][line[col_y]!=event]=0
                        myline = line.groupby([col_x])['percent'].sum().reset_index()
                        bar['percent'] = myline['percent']
                        bar['Column Name'] = col_x
                        cols = bar.columns.tolist()
                        cols = cols[-1:] + cols[:-1]
                        bar = bar[cols]
                        bar.columns = ['Column Name','Deciles/Category','Count','Percent']
                        bar['Deciles/Category'] = bar['Deciles/Category'].astype(str)
                        report = report.append(bar,sort=True, ignore_index=True)

                else:
                    col_y=dep_var
                    col_x=i
                    if event==None and df[col_y].dtype in CON.NUMS and len(df[i].unique())>category_limit:
                        bar = df.groupby(df[col_x])[col_x].count().reset_index(name='count')
                        line = df.groupby(df[col_x])[col_y].mean().reset_index(name='Mean')
                        bar['Column Name'] = col_x
                        cols = bar.columns.tolist()
                        cols = cols[-1:] + cols[:-1]
                        bar = bar[cols]
                        bar['Mean'] = line['Mean']
                        bar.columns = ['Column Name','Deciles/Category', 'Count','Mean']
                        bar['Deciles/Category'] = bar['Deciles/Category'].astype(str)
                        report = report.append(bar, ignore_index=True)
                    else:
                        bar = pd.crosstab(df[col_x],df[col_y])
                        bar['count'] = bar.sum(axis=1)
                        bar['percent']=(bar[event]/bar['count'])*100
                        temp = bar[['count','percent']].copy()
                        temp[col_x] = temp.index
                        temp.columns = ['count','percent',col_x]
                        cols = temp.columns.tolist()
                        cols = cols[-1:] + cols[:-1]
                        temp = temp[cols]
                        temp['Column Name'] = col_x
                        cols = temp.columns.tolist()
                        cols = cols[-1:] + cols[:-1]
                        temp = temp[cols]
                        temp.columns = ['Column Name','Deciles/Category','Count','Percent']
                        temp['Deciles/Category']=temp['Deciles/Category'].astype(str)
                        report = report.append(temp, sort=True, ignore_index=True)

            if not os.path.exists('Reports'):
                os.makedirs('Reports')
            return report.to_csv("Reports/bivariateReport.csv", index=False)

        # def plot(self, figure, filename = False, is_notebook = False):
        #     """
        #     This function will plot, plotly figures

        #     Paramenter:
        #     -----------

        #     self      : A pandas DataFrame
        #     figure    : Plotly figure object (figure_objs)
        #     filename  : str object need to be provided to save graphs in current directory
        #     is_notebook: boolean, optional. plot graph inside notebook if true
        #     """
        #     config = {'showLink': False, 'displaylogo':False, 'modeBarButtonsToRemove':['sendDataToCloud']}
        #     if is_notebook:
        #         if filename!=False:
        #             iplot(figure, filename=filename, config=config)
        #         else:
        #             iplot(figure, config=config)
        #     else:
        #         if filename!=False:
        #             plot(figure, filename=filename, config=config)
        #         else:
        #             plot(figure, config=config)
    `
};
