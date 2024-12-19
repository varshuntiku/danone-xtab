const problemTypeAndFormat = {
    text_to_sql: [
        {
            system: 'Below is an instruction that describes a task of converting text explaination to SQLite query. Input is complete detail of schema for the query.',
            instruction:
                'What are the names of the heads who are born outside the California state?',
            input: 'department:(department id, number),(name, text),(creation, text),(ranking, number),(budget in billions, number),(num employees, number);head:(head id, number),(name, text),(born state, text),(age, number);management:(department id, number),(head id, number),(temporary acting, text)',
            output: "SELECT name FROM head WHERE born_state != 'California'",
            history: '[[<instruction>, <output>]] # optional'
        },
        {
            system: 'Below is an instruction that describes a task of converting text explaination to SQLite query. Input is complete detail of schema for the query.',
            instruction:
                'What are the names of the heads who are born outside the California state?',
            input: 'department:(department id, number),(name, text),(creation, text),(ranking, number),(budget in billions, number),(num employees, number);head:(head id, number),(name, text),(born state, text),(age, number);management:(department id, number),(head id, number),(temporary acting, text)',
            output: "SELECT name FROM head WHERE born_state != 'California'",
            history:
                '[[<instruction>, <output>]] # optional, give pairs of the history of previous instructions and responses that can be relevant to generate response of the current instruction'
        }
    ],
    classification: [
        {
            instruction: 'Identify the category of the following customer feedback.',
            input: "I've been using your app for the past few months, and it has completely changed how I manage my daily tasks. Extremely user-friendly and effective.",
            output: 'Positive Feedback',
            system: '"", # optional',
            history:
                '[[<instruction>, <output>]]  # optional, useful for chat/conversational context.'
        },
        {
            instruction: 'Identify the category of the following support ticket.',
            input: 'My internet connection drops every few minutes, making it impossible to work from home efficiently.',
            output: 'Technical Issue',
            system: '"", # optional',
            history:
                '[[<instruction>, <output>]]  # optional, useful for chat/conversational context.'
        }
    ],
    summarization: [
        {
            instruction: '"Generate a summary of the given article."',
            input: '"Between 1989 and 2019, the size of the U.S. economy, measured in terms of the gross domestic product (GDP), more than doubled. The growth was faster than in the prior two decades, driven in part by the dramatic expansion of the information technology sector in the 1990s and early 2000s, gains in worker productivity and strong consumer demand, and government investments in research and development."',
            output: '"The U.S. economy more than doubled in size between 1989 and 2019, largely due to the rise of the information technology sector, improvements in worker productivity and consumer demand, and government investments. This growth was faster than in the prior two decades."',
            system: ' " " # optional',
            history: '[[<instruction>, <output>]] # optional'
        },
        {
            instruction: 'Provide a brief overview of the latest environmental policy.',
            input: 'The government announced a new environmental policy aimed at reducing carbon emissions by 40% over the next decade through investments in renewable energy sources and stricter emission standards for industries.',
            output: 'New government policy seeks to cut carbon emissions by 40% in a decade via renewable energy investments and stricter industry standards.',
            system: '"", # optional',
            history:
                '[[<instruction>, <output>]]  # optional, useful for chat/conversational context.'
        }
    ],
    openqa: [
        {
            instruction: '"Explain why the following fraction is equivalent to 1/4"',
            input: '4/16',
            output: '"The fraction 4/16 is equivalent to 1/4 because both numerators and denominators are divisible by 4. Dividing both the top and bottom numbers by 4 yields the fraction 1/4."',
            system: ' " " # optional',
            history: '[[<instruction>, <output>]]  # optional'
        },
        {
            instruction: '"Reverse engineer this code to create a new version"',
            input: '\n &nbsp;"def factorialize(num):\n &nbsp;&nbsp; factorial = 1\n  &nbsp;&nbsp; for i in range(1, num):\n   &nbsp; &nbsp;&nbsp; factorial *= i\n  \n&nbsp;&nbsp;  return factorial"',
            output: '\n &nbsp;"def factorialize(num):\n &nbsp;&nbsp; factorial = 1\n &nbsp;&nbsp; for i in range(num, 0, -1):\n&nbsp; &nbsp;&nbsp;    factorial *= i\n  \n&nbsp;&nbsp;    return factorial"',
            system: ' " " # optional',
            history: '[[<instruction>, <output>]]  # optional'
        }
    ],
    mcqa: [
        {
            instruction: '"Question: This question refers to the following information."',
            input: '"In the context of web development, consider the following technologies. Which one is primarily used for defining the structure and layout of web pages, rather than being a programming language?\n a) Python\n b) JavaScript\n c) HTML\n d) SQL"',
            output: '"C"',
            system: ' " " # optional',
            history: '[[<instruction>, <output>]]  # optional'
        },
        {
            instruction:
                'Question: Based on the descriptions provided, choose the option that best represents an operating system.',
            input: 'Which of the following is an example of an operating system used in personal computers and servers?\n a) MySQL\n b) Linux\n c) PHP\n d) Excel',
            output: 'B',
            system: '"", # optional',
            history:
                '[[<instruction>, <output>]]  # optional, useful for chat/conversational context.'
        }
    ],
    function_calling: [
        {
            instruction:
                'Hi, I need help with calculating my loan repayment. I borrowed $50000 at an interest rate of 5% and the term of the loan is 60 months.',
            input: '[{"name": "calculate_loan_repayment", "description": "Calculate monthly loan repayment amount", "parameters": {"type": "object", "properties": {"loan_amount": {"type": "number", "description": "The amount of the loan"}, "interest_rate": {"type": "number", "description": "The interest rate on the loan"}, "loan_term": {"type": "integer", "description": "The term of the loan in months"}}, "required": ["loan_amount", "interest_rate", "loan_term"]}}]',
            output: '{"name": "calculate_loan_repayment", "arguments": {"loan_amount": 50000, "interest_rate": 5, "loan_term": 60}}',
            system: 'You will be provided with a list of functions and descriptions along with parameters and thier descriptions for each of the functions in the inputs. Convert the given instruction into an appropriate function call using the inputs.',
            history:
                '[[<instruction>, <output>]]  # optional, useful for chat/conversational context.'
        },
        {
            instruction:
                "I saw a dress that I liked. It was originally priced at $200 but it's on sale for 20% off. Can you tell me how much it will cost after the discount?",
            input: '[{"name": "calculate_discount", "description": "Calculate the discounted price", "parameters": {"type": "object", "properties": {"original_price": {"type": "number", "description": "The original price of the item"}, "discount_percentage": {"type": "number", "description": "The percentage of discount"}}, "required": ["original_price", "discount_percentage"]}}]',
            output: '{"name": "calculate_discount", "arguments": {"original_price": 200, "discount_percentage": 20}}',
            system: 'You will be provided with a list of functions and descriptions along with parameters and thier descriptions for each of the functions in the inputs. Convert the given instruction into an appropriate function call using the inputs.',
            history:
                '[[<instruction>, <output>]]  # optional, useful for chat/conversational context.'
        }
    ]
};

export default problemTypeAndFormat;
