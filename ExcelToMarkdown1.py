import os
import pandas as pd
import re

path = "ExcelToMarkdown.csv"

# Check if the file exists
if os.path.isfile(path) :
    print("The file exists.")

    # Read data as a pandas dataframe from excel
    df = pd.read_csv(path)
    print(df, '\n')

    # Print markdown table
    md = df.to_markdown()                           # string
    print(md, '\n')

    # Modify details
    # md2 = re.sub("---*", "--", md)
    # md2 = re.sub(":--", ":-:", md2)
    # md2 = re.sub("nan", "", md2)
    md2 = re.sub("nan", "   ", md)
    # md2 = re.sub("  *", " ", md2)
    print(md2, '\n')

    # Save as a .txt file
    saveFileName = re.sub("[.]\w*", ".md", path)    # The file name should not include '.' 
    # print(saveFileName)                           # test : ok
    if os.path.isfile(saveFileName) == False :
        with open(saveFileName, 'w', encoding='utf-8') as f :
            f.write(md2)
            f.close()
        print("The markdown table has been saved in " + saveFileName + ".")
    else :
        print("A file called " + saveFileName + " has already existed.")

else :
    print("The file doesn't exist.")