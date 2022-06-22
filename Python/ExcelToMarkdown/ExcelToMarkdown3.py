import sys                                                                      # for argument parsing from .bat file
import os
import pandas as pd
import re


# Get the arguments
def ArguementParsing() :

    args = sys.argv

    if len(args) >= 2 and len(args) <= 3 :                                      # sys.argv[0] is always given as the script file name

        fileName = args[1]
        sheet = ''

        if len(args) == 3 :
            if args[2].isdigit() == True :
                sheet = int(args[2])
            else :
                sheet = args[2]

        return fileName, sheet

    else :
        print("It requires 1~2 arguements. : file name(necessary), sheet name or number(optional)")
        Quit()


# Get the file path
def getFilePath(fileName, sheet) :

    os.getcwd()
    path = os.getcwd() + os.sep + fileName                                      # not os.sep()
    # print(path)                                                               # test : ok

    root, ext = os.path.splitext(path)
    saveFilePath = root + "_" + str(sheet) + ".md"
    # saveFilePath = re.sub("[.]\w*", ".md", path)                              # do not need to use regular expression directly
    # print(ext, saveFilePath)                                                  # test : ok

    return path, ext, saveFilePath


# Read data as a pandas dataframe from excel
def excelToMarkdown(path, ext, sheet) :

    excelExtension = (".xls", ".xlsx", ".xlsm", ".xlsb", ".odf", ".ods", ".odt")
    # reference ☞ https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html

    if ext.lower() in excelExtension :
        if sheet != '' :
            df = pd.read_excel(path, sheet_name = sheet)
        else :
            df = pd.read_excel(path)
    elif  ext.lower() == ".csv" :
        df = pd.read_csv(path)
    else :
        print("The process doesn't supprt", ext, "file.")
        Quit()

    # Print markdown table
    print(path, sheet)
    # df.head()
    md = df.to_markdown(index=False)                                            # string

    # Modify details
    md = re.sub("---*", "--", md)
    md = re.sub(":--", " :-: ", md)
    md = re.sub("  *", " ", md)
    md = re.sub(" nan ", "  ", md)                                              # 'finance` is safe

    print(md[:500], end = '\n')                                                 # string

    return md


# Save as a .md file
def saveMarkdown(md, saveFilePath) :

    # if os.path.isfile(saveFilePath) == False :                                # check in __main__
    with open(saveFilePath, 'w', encoding='utf-8') as f :
        f.write(md)
        f.close()

    print("The markdown table has been saved in " + saveFilePath + ".")


# Quit
def Quit() :

    print('-' * 80)
    sys.exit()


# Run
if __name__ == "__main__" :

    # Get the arguments
    fileName, sheet = ArguementParsing()
    print(fileName, sheet)

    # The stem of the filename should not include '.'
    path, ext, saveFilePath = getFilePath(fileName, sheet)

    # Check if the file exists
    if os.path.isfile(path) :
        print("The file exists.\n")

        # Check if the overwriting risk exists and save as a .md file
        if os.path.isfile(saveFilePath) == False :
            md = excelToMarkdown(path, ext, sheet)
            saveMarkdown(md, saveFilePath)
        else :
            answer = input(path + " has already existed. Will you overwriter? (y/n) ")
            if answer.lower() in ("y", "yes") :
                md = excelToMarkdown(path, ext, sheet)
                saveMarkdown(md, saveFilePath)
            else :
                print("The process has stopped without saving data.")

    else :
        print("The file doesn't exist.")

    Quit()