"""
Crawling Daily Contribution Data from Github
2023.12.31

"""


import datetime
import pytz
import requests
from bs4 import BeautifulSoup
import pandas as pd


TEST = True


def search_used_item_all(_id:str, _year:int = 0):
    """

    """

    # URL 설정
    _this_year = datetime.datetime.now().year
    if isinstance(_year, int) and _year > 2000 and _year <= _this_year:
        _year = str(_year)
        _url = f"https://github.com/{_id}?from={_year}-01-01&to={_year}-12-31"
    else:
        _url = f"https://github.com/{_id}"
    if TEST:
        print("URL : ", _url, "\n")                         # Ok

    _daily_contributions_data = []
    _daily_tooltip_data = []

    try :
        # Response 수신
        _response = requests.get(_url, timeout = 3)
        _soup = BeautifulSoup(_response.text, "html.parser")
        _class_str = "ContributionCalendar-grid js-calendar-graph-table"
        _td_list = _soup.find("table", class_ = _class_str).select("tbody > tr > td")

        for _one_td_data in _td_list:

            # <td tabindex="0" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-4" style="width: 10px" data-date="2023-01-01" id="contribution-day-component-0-0" data-level="4" role="gridcell" data-view-component="true" class="ContributionCalendar-day"></td>
            # <tool-tip id="tooltip-e4f9e24e-d9ec-4ee3-ad3c-c2265e892038" for="contribution-day-component-0-0" popover="manual" data-direction="n" data-type="label" data-view-component="true" class="sr-only position-absolute">5 contributions on January 1st.</tool-tip>

            if _one_td_data.name == "td" and "data-date" in _one_td_data.attrs:

                # if TEST:
                #     print(_one_td_data)
                #     print(_one_td_data.find_next_sibling("tool-tip"))

                # 1) _data_date
                _data_date = _one_td_data["data-date"]
                _data_date_key = _one_td_data["id"]

                # 2) _tt_data
                _tt_data = _one_td_data.find_next_sibling("tool-tip")
                _tt_data_key = ""
                if _tt_data:
                    _tt_data_key = _tt_data["for"]
                    _tt_data = _tt_data.text.split(' ')[0]
                    if _tt_data == "No":
                        _num = int(0)
                    else:
                        _num = int(_tt_data)
                else:
                    _num = int(0)

                # 3) validation
                _validation = True
                if _data_date_key != _tt_data_key:
                    _validation = False
                _one_td_data = [_data_date, _num, _validation]

                if TEST:
                    print(_one_td_data)

                _daily_contributions_data.append(_one_td_data)

    except Exception as e:
        print("검색 결과를 가져오지 못 했습니다:", e)
        _daily_contributions_data.append("Failed")

    _columns = ["data-date", "tool-tip", "validation"]
    _df = pd.DataFrame(data = _daily_contributions_data, columns = _columns)

    return _df


def save_csv(_data_frame, _filename="github_daily_contributions"):
    """

    """

    _seoul_timezone = pytz.timezone('Asia/Seoul')
    _time_stamp = datetime.datetime.now(_seoul_timezone).strftime("%Y%m%d_%H%M%S")
    _path = f"Data/{_filename}_{_time_stamp}.csv"
    _data_frame.to_csv(_path, index = False, encoding = 'utf-8-sig')
    print("파일 저장을 완료하였습니다. :", _path)


if __name__ == "__main__":

    df = search_used_item_all(_id = "kimpro82", _year = 2023)
    print(df)

    save_csv(df)
