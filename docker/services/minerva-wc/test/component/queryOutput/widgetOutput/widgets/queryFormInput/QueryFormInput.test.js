import { render, fireEvent, screen } from '@testing-library/preact';
import QueryFormInput from '../../../../../../src/component/queryOutput/widgetOutput/widgets/queryFormInput/QueryFormInput';
import QueryItemContextProvider from '../../../../../../src/context/queryItemContext';
import RootContextProvider, { RootContext } from '../../../../../../src/context/rootContext';
import QueryService from '../../../../../../src/service/queryService';
import MainService from '../../../../../../src/service/mainService';
import { StatusType } from '../../../../../../src/model/Query';

describe('QueryFormInput test', () => {
    test('component should render 1', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const query = {
            "id": 573,
            "input": "sales acorss barnds",
            "output": {
              "type": "sql",
              "response": {
                "text": "The sales across different brands are as follows:\n- Sodax: 769,336\n- Icex: 1,276,130\n- Drinksjet: 3,834,760\n- Softella: 180,672\n- Waterhut: 5,738,560\n\nNotable trends:\n- Waterhut has the highest sales, followed by Drinksjet and Icex.\n- Softella has the lowest sales among the brands.\n\nRecommendations:\n- Focus on promoting Waterhut, Drinksjet, and Icex as they have the highest sales.\n- Consider strategies to increase sales for Softella, such as targeted marketing campaigns or product improvements.",
                "sql_query": "\n#### SQL Query\n\n```\nSELECT brand, SUM(volume) AS total_sales FROM cpg.cpgnew_v2 GROUP BY brand;\n```\n\n",
                "widgets": [
                    {
                    "type": "input-form",
                    "value": {
                      "layout": [
                        {
                          "grid": true,
                          "element": "button-options",
                          "elementProps": {
                            "buttons": [
                              {
                                "query": "Submit",
                                "variant": "outlined"
                              }
                            ]
                          }
                        },
						{
							"grid": true,
							"element": null,
						}
                      ]
                    }
                  }
                ],
                "processed_query": "sales acorss barnds"
              }
            },
            "window_id": 61,
            "feedback": null,
            "status": StatusType.resolved
        }
        queryService.queries.value = [query]
        const { container } = render(<RootContextProvider value={{queryService: queryService}}>
          <QueryItemContextProvider value={{ query, citationEnabled: false }}>
            <QueryFormInput data={query.output.response.widgets[0].value} />
        </QueryItemContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toMatch('Submit');
    });

	test('component should render 2', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const query1 = {
            "id": 573,
            "input": "sales acorss barnds",
            "output": {
              "type": "sql",
              "response": {
                "text": "The sales across different brands are as follows:\n- Sodax: 769,336\n- Icex: 1,276,130\n- Drinksjet: 3,834,760\n- Softella: 180,672\n- Waterhut: 5,738,560\n\nNotable trends:\n- Waterhut has the highest sales, followed by Drinksjet and Icex.\n- Softella has the lowest sales among the brands.\n\nRecommendations:\n- Focus on promoting Waterhut, Drinksjet, and Icex as they have the highest sales.\n- Consider strategies to increase sales for Softella, such as targeted marketing campaigns or product improvements.",
                "sql_query": "\n#### SQL Query\n\n```\nSELECT brand, SUM(volume) AS total_sales FROM cpg.cpgnew_v2 GROUP BY brand;\n```\n\n",
                "widgets": [
                    {
                    "type": "input-form",
                    "value": {
                      "layout": [
                        {
                          "grid": true,
                          "element": "button-options",
                          "elementProps": {
                            "buttons": [
                              {
                                "query": "Submit",
                                "variant": "outlined"
                              }
                            ]
                          }
                        },
						{
							"grid": true,
							"element": null,
						}
                      ]
                    }
                  }
                ],
                "processed_query": "sales acorss barnds"
              }
            },
            "window_id": 61,
            "feedback": null,
            "status": StatusType.resolved
        };
		const query2 = {
            "id": 574,
            "input": "sales acorss barnds",
            "output": {
              "type": "sql",
              "response": {
                "text": "The sales across different brands are as follows:\n- Sodax: 769,336\n- Icex: 1,276,130\n- Drinksjet: 3,834,760\n- Softella: 180,672\n- Waterhut: 5,738,560\n\nNotable trends:\n- Waterhut has the highest sales, followed by Drinksjet and Icex.\n- Softella has the lowest sales among the brands.\n\nRecommendations:\n- Focus on promoting Waterhut, Drinksjet, and Icex as they have the highest sales.\n- Consider strategies to increase sales for Softella, such as targeted marketing campaigns or product improvements.",
                "sql_query": "\n#### SQL Query\n\n```\nSELECT brand, SUM(volume) AS total_sales FROM cpg.cpgnew_v2 GROUP BY brand;\n```\n\n",
                "widgets": [
                    {
                    "type": "input-form",
                    "value": {
                      "layout": [
                        {
                          "grid": true,
                          "element": "button-options",
                          "elementProps": {
                            "buttons": [
                              {
                                "query": "Submit",
                                "variant": "outlined"
                              }
                            ]
                          }
                        },
						{
							"grid": true,
							"element": null,
						}
                      ]
                    }
                  }
                ],
                "processed_query": "sales acorss barnds"
              }
            },
            "window_id": 61,
            "feedback": null
        }
        queryService.queries.value = [query1, query2]
        const { container } = render(<RootContextProvider value={{queryService: queryService}}>
          <QueryItemContextProvider value={{ query:query1, citationEnabled: false }}>
            <QueryFormInput data={query1.output.response.widgets[0].value} />
        </QueryItemContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toMatch('Submit');
    });

	test('component should render 3', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const query1 = {
            "id": 573,
            "input": "sales acorss barnds",
            "output": {
              "type": "sql",
              "response": {
                "text": "The sales across different brands are as follows:\n- Sodax: 769,336\n- Icex: 1,276,130\n- Drinksjet: 3,834,760\n- Softella: 180,672\n- Waterhut: 5,738,560\n\nNotable trends:\n- Waterhut has the highest sales, followed by Drinksjet and Icex.\n- Softella has the lowest sales among the brands.\n\nRecommendations:\n- Focus on promoting Waterhut, Drinksjet, and Icex as they have the highest sales.\n- Consider strategies to increase sales for Softella, such as targeted marketing campaigns or product improvements.",
                "sql_query": "\n#### SQL Query\n\n```\nSELECT brand, SUM(volume) AS total_sales FROM cpg.cpgnew_v2 GROUP BY brand;\n```\n\n",
                "widgets": [
                    {
                    "type": "input-form",
                    "value": {
                      "layout": [
                        {
                          "grid": true,
                          "element": "button-options",
                          "elementProps": {
                            "buttons": [
                              {
                                "query": "Submit",
                                "variant": "outlined"
                              }
                            ]
                          }
                        },
						{
							"grid": true,
							"element": null,
						}
                      ]
                    }
                  }
                ],
                "processed_query": "sales acorss barnds"
              }
            },
            "window_id": 61,
            "feedback": null,
            "status": StatusType.resolved
        };
		const query2 = {
            "id": 574,
            "input": "sales acorss barnds",
            "output": {
              "type": "sql",
              "response": {
                "text": "The sales across different brands are as follows:\n- Sodax: 769,336\n- Icex: 1,276,130\n- Drinksjet: 3,834,760\n- Softella: 180,672\n- Waterhut: 5,738,560\n\nNotable trends:\n- Waterhut has the highest sales, followed by Drinksjet and Icex.\n- Softella has the lowest sales among the brands.\n\nRecommendations:\n- Focus on promoting Waterhut, Drinksjet, and Icex as they have the highest sales.\n- Consider strategies to increase sales for Softella, such as targeted marketing campaigns or product improvements.",
                "sql_query": "\n#### SQL Query\n\n```\nSELECT brand, SUM(volume) AS total_sales FROM cpg.cpgnew_v2 GROUP BY brand;\n```\n\n",
                "widgets": [
                    {
                    "type": "input-form",
                    "value": {
                      "layout": [
                        {
                          "grid": true,
                          "element": "button-options",
                          "elementProps": {
                            "buttons": [
                              {
                                "query": "Submit",
                                "variant": "outlined"
                              }
                            ]
                          }
                        },
						{
							"grid": true,
							"element": null,
						}
                      ]
                    }
                  }
                ],
                "processed_query": "sales acorss barnds"
              }
            },
            "window_id": 61,
            "feedback": null
        }
        queryService.queries.value = [query1, query2]
        const { container } = render(<RootContextProvider value={{queryService: queryService}}>
          <QueryItemContextProvider value={{ query:query2, citationEnabled: false }}>
            <QueryFormInput data={query2.output.response.widgets[0].value} />
        </QueryItemContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toMatch('Submit');
    });

	test('component should render 4', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        queryService.queries.value = []
        const { container } = render(<RootContextProvider value={{queryService: queryService}}>
          <QueryItemContextProvider value={{ query: {}, citationEnabled: false }}>
            <QueryFormInput data={{}} />
        </QueryItemContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toBeFalsy();
    });

	test('component should render 5: handleFormButtonClick', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
		const query2 = {
            "id": 574,
            "input": "sales acorss barnds",
            "output": {
              "type": "sql",
              "response": {
                "text": "The sales across different brands are as follows:\n- Sodax: 769,336\n- Icex: 1,276,130\n- Drinksjet: 3,834,760\n- Softella: 180,672\n- Waterhut: 5,738,560\n\nNotable trends:\n- Waterhut has the highest sales, followed by Drinksjet and Icex.\n- Softella has the lowest sales among the brands.\n\nRecommendations:\n- Focus on promoting Waterhut, Drinksjet, and Icex as they have the highest sales.\n- Consider strategies to increase sales for Softella, such as targeted marketing campaigns or product improvements.",
                "sql_query": "\n#### SQL Query\n\n```\nSELECT brand, SUM(volume) AS total_sales FROM cpg.cpgnew_v2 GROUP BY brand;\n```\n\n",
                "widgets": [
                    {
                    "type": "input-form",
                    "value": {
                      "layout": [
                        {
                          "grid": true,
                          "element": "button-options",
                          "elementProps": {
                            "buttons": [
                              {
                                "query": "Submit",
                                "variant": "outlined"
                              }
                            ]
                          }
                        },
						{
							"grid": true,
							"element": null,
						}
                      ]
                    }
                  }
                ],
                "processed_query": "sales acorss barnds"
              }
            },
            "window_id": 61,
            "feedback": null
        }
        queryService.queries.value = [query2];
		queryService.makeQuery = jest.fn();
        const { container } = render(<RootContextProvider value={{queryService: queryService}}>
          <QueryItemContextProvider value={{ query:query2, citationEnabled: false }}>
            <QueryFormInput data={query2.output.response.widgets[0].value} />
        </QueryItemContextProvider>
        </RootContextProvider>);
        fireEvent.click(screen.getByText("Submit"));
        expect(queryService.makeQuery).toHaveBeenCalled();
    });
});
