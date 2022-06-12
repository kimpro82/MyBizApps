import pandas as pd
import re

path = 'ExcelToMarkdown.csv'

# Read data as a pandas dataframe from excel
df = pd.read_csv(path)
print(df, '\n')

# Print markdown table
md = df.to_markdown()                           # string
print(md, '\n')

# Modify details
md2 = re.sub("---*", '--', md)
md2 = re.sub(":--", '-:-', md2)                 # wrong : -:- → :-:
md2 = re.sub("nan", '', md2)
md2 = re.sub("  *", ' ', md2)
print(md2, '\n')