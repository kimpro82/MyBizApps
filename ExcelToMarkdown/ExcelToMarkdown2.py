import os
import pandas as pd
import re


# Get the file path
def getFilePath(fileName) :

    os.getcwd()
    path = os.getcwd() + os.sep + fileName          # not os.sep()
    # print(path)                                   # test : ok

    root, ext = os.path.splitext(path)
    saveFilePath = root + ".md"
    # saveFilePath = re.sub("[.]\w*", ".md", path)  # do not need to use regular expression directly
    # print(ext, saveFilePath)                      # test : ok

    return path, ext, saveFilePath


# Read data as a pandas dataframe from excel
def excelToMarkdown(path, ext) :

    excelExtension = (".xls", ".xlsx", ".xlsm", ".xlsb", ".odf", ".ods", ".odt")
    # reference ☞ https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html

    if ext.lower() in excelExtension :
        df = pd.read_excel(path)
    elif  ext.lower() == ".csv" :
        df = pd.read_csv(path)
    else :
        print("The process doesn't supprt", ext, "file.")
    print(df, '\n')

    # Print markdown table
    md = df.to_markdown(index=False)                # string
    print(md, '\n')

    # Modify details
    md = re.sub("---*", "--", md)
    md = re.sub(":--", ":-:", md)
    md = re.sub("nan", "", md)
    # md = re.sub("nan", "   ", md)
    md = re.sub("  *", " ", md)

    print(md, '\n')

    return md


# Save as a .md file
def saveMarkdown(md, saveFilePath) :
    # if os.path.isfile(saveFilePath) == False :    # check in __main__
    with open(saveFilePath, 'w', encoding='utf-8') as f :
        f.write(md)
        f.close()
    print("The markdown table has been saved in " + saveFilePath + ".")


# Run
if __name__ == "__main__" :

    fileName = "ExcelToMarkdown2.csv"
    # The stem of the filename should not include '.'
    path, ext, saveFilePath = getFilePath(fileName)

    # Check if the file exists
    if os.path.isfile(path) :
        print("The file exists.\n")

        # Check if the overwriting risk exists and save as a .md file
        if os.path.isfile(saveFilePath) == False :
            md = excelToMarkdown(path, ext)
            saveMarkdown(md, saveFilePath)
        else :
            answer = input(path + " has already existed. Will you overwriter? (y/n) ")
            if answer.lower() in ("y", "yes") :
                md = excelToMarkdown(path, ext)
                saveMarkdown(md, saveFilePath)
            else :
                print("The process has stopped without saving data.")

    else :
        print("The file doesn't exist.")