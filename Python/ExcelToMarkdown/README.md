# Excel To Markdown

&nbsp; Convert Excel data to Github markdown table


### \<List>

- [Excel To Markdown 3 (2022.06.22)](#excel-to-markdown-3-20220622)
- [Excel To Markdown 2 (2022.02.06)](#excel-to-markdown-2-20220206)
- [Excel To Markdown 1 (2022.02.05)](#excel-to-markdown-1-20220205)


## [Excel To Markdown 3 (2022.06.22)](#list)

- Input arguments though `.bat` file, don't need to modify `.py` file directly anymore
- Extract `.md` file not only from the 1st sheet, but also any other sheet
- Bug fix : don't change any other words including "nan" except pure "nan"

#### `ExcelToMarkdown3.xlsx`
Sheet1 : 'a'
| Col1 | Col2 |
| :-- | :-- |
| Nan | nan |
| NAND | nand |
| Nanan | nanan |
| . | |

Sheet2 : '1'
| Col1 | Col2 |
| :-- | :-- |
| Finance | finance |
| Financial | financial |
| Fice | fice |
| Ficial | ficial |
| Artificial | artificial |

#### `ExcelToMarkdown3.bat`
```bat
python ExcelToMarkdown3.py
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx 1
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx a
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx a b

@echo --------------------------------------------------------------------------------
```

#### Mainly changed parts of `ExcelToMarkdown3.py`
```python
import sys                                                                      # for argument parsing from .bat file
……
```
```python
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
```
```python
# Get the file path
def getFilePath(fileName, sheet) :

    ……
    saveFilePath = root + "_" + str(sheet) + ".md"
    ……

```
```python
# Read data as a pandas dataframe from excel
def excelToMarkdown(path, ext, sheet) :

    ……

    if ext.lower() in excelExtension :
        if sheet != '' :
            df = pd.read_excel(path, sheet_name = sheet)
        else :
            df = pd.read_excel(path)
    ……
    else :
        ……
        Quit()

    # Print markdown table
    print(path, sheet)
    ……

    # Modify details
    ……
    md = re.sub(" nan ", "  ", md)                                              # 'finance` is safe

    print(md[:500], end = '\n')                                                 # string

    ……
```
```python
# Quit
def Quit() :

    print('-' * 80)
    sys.exit()
```
```python
# Run
if __name__ == "__main__" :

    # Get the arguments
    fileName, sheet = ArguementParsing()
    print(fileName, sheet)

    # The stem of the filename should not include '.'
    path, ext, saveFilePath = getFilePath(fileName, sheet)

    # Check if the file exists
    if os.path.isfile(path) :
        ……

        # Check if the overwriting risk exists and save as a .md file
        if os.path.isfile(saveFilePath) == False :
            md = excelToMarkdown(path, ext, sheet)
            ……
        else :
            ……
            if answer.lower() in ("y", "yes") :
                md = excelToMarkdown(path, ext, sheet)
                ……
            ……

    ……

    Quit()
```

#### Output : `ExcelToMarkdown3_.md`
```bat
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx
```
```md
| Col1 | Col2 |
| :-: | :-: |
| Nan |  |
| NAND | nand |
| Nanan | nanan |
| . |  |
```
| Col1 | Col2 |
| :-: | :-: |
| Nan |  |
| NAND | nand |
| Nanan | nanan |
| . |  |

#### Output : `ExcelToMarkdown3_1.md`, `ExcelToMarkdown3_a.md`
```bat
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx 1
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx a
```
```md
| Col1 | Col2 |
| :-: | :-: |
| Finance | finance |
| Financial | financial |
| Fice | fice |
| Ficial | ficial |
| Artificial | artificial |
```
| Col1 | Col2 |
| :-: | :-: |
| Finance | finance |
| Financial | financial |
| Fice | fice |
| Ficial | ficial |
| Artificial | artificial |

#### Output : etc
```bat
python ExcelToMarkdown3.py
python ExcelToMarkdown3.py ExcelToMarkdown3.xlsx a b
```
```
It requires 1~2 arguements. : file name(necessary), sheet name or number(optional)
```


## [Excel To Markdown 2 (2022.02.06)](#list)

- Advanced code from [Excel To Markdown 1 (2022.02.05)](#excel-to-markdown-1-20220205)  
  - **Support more file extensions** : not only `.csv` but also `.xls` `.xlsx` `.xlsm` `xlsb` and so on
  - Ask if overwrite `.md` file
  - Improve entire code structure : seperate functions of `getFilePath()` `excelToMarkdown()` `saveMarkdown()`
  - Get the `.md` file name for saving by `os.path.splitext()` instead of `re`
  - Change sample `.csv` file that can test more markdown syntax

#### ExcelToMarkdown2.csv
```csv
**A**,**B**,**C**
A2,B<br>2,[C2](#)
〃,`B3`,*C3*
<u>〃</u>,__B4__,~~C4~~

```

#### ExcelToMarkdown2.py
```python
import os
import pandas as pd
import re
```
```python
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
```
```python
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
```
```python
# Save as a .md file
def saveMarkdown(md, saveFilePath) :
    # if os.path.isfile(saveFilePath) == False :    # check in __main__
    with open(saveFilePath, 'w', encoding='utf-8') as f :
        f.write(md)
        f.close()
    print("The markdown table has been saved in " + saveFilePath + ".")
```
```python
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
```

#### Output
```md
| **A**    | **B**   | **C**   |
|:---------|:--------|:--------|
| A2       | B<br>2  | [C2](#) |
| 〃        | `B3`    | *C3*    |
| <u>〃</u> | __B4__  | ~~C4~~  |
```
| **A**    | **B**   | **C**   |
|:---------|:--------|:--------|
| A2       | B<br>2  | [C2](#) |
| 〃        | `B3`    | *C3*    |
| <u>〃</u> | __B4__  | ~~C4~~  |
```md
| **A** | **B** | **C** |
|:-:|:-:|:-:|
| A2 | B<br>2 | [C2](#) |
| 〃 | `B3` | *C3* |
| <u>〃</u> | __B4__ | ~~C4~~ |
```
| **A** | **B** | **C** |
|:-:|:-:|:-:|
| A2 | B<br>2 | [C2](#) |
| 〃 | `B3` | *C3* |
| <u>〃</u> | __B4__ | ~~C4~~ |
> `<u>` tag doesn't work on the real browser.


## [Excel To Markdown 1 (2022.02.05)](#list)

- Convert **Excel**(`.csv`) data to **Github markdown table**
  - Use `pandas` for reading and converting data, `re` for customizing the markdaown table
  - The result will be saved in a `.md` file that has the same name with the `.csv` file after check if an overwriting occurs.

#### ExcelToMarkdown.csv
```csv
A,B,C
A(병합),B<br>2,[C2](#)
,B3(병합),

```

#### ExcelToMarkdown0.py
```python
import pandas as pd
import re
```
```python
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
```

##### Output
```md
|    | A     | B      | C       |
|---:|:------|:-------|:--------|
|  0 | A(병합) | B<br>2 | [C2](#) |
|  1 | nan   | B3(병합) | nan     |
```
|    | A     | B      | C       |
|---:|:------|:-------|:--------|
|  0 | A(병합) | B<br>2 | [C2](#) |
|  1 | nan   | B3(병합) | nan     |
```md
| | A | B | C |
|--:|-:-|-:-|-:-|
| 0 | A(병합) | B<br>2 | [C2](#) |
| 1 | | B3(병합) | |
```
| | A | B | C |
|--:|-:-|-:-|-:-|
| 0 | A(병합) | B<br>2 | [C2](#) |
| 1 | | B3(병합) | |
> `-:-` should be fixed as `:-:`

#### ExcelToMarkdown1.py
```python
import os
import pandas as pd
import re
```
```python
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
```

##### Output
```md
|    | A     | B      | C       |
|---:|:------|:-------|:--------|
|  0 | A(병합) | B<br>2 | [C2](#) |
|  1 |       | B3(병합) |         |
```
|    | A     | B      | C       |
|---:|:------|:-------|:--------|
|  0 | A(병합) | B<br>2 | [C2](#) |
|  1 |       | B3(병합) |         |

> Merging cells doesn't work (`pandas` never has a reason to consider it!)