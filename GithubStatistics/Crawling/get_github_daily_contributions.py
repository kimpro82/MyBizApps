"""
GitHub Daily Contributions Scraper
2023.12.31

This script retrieves daily contribution data from a GitHub profile for a specified year.

Usage:
1. retrieve_daily_contributions function scrapes the daily contribution data for a given GitHub user and year.
2. save_csv function saves the collected data as a CSV file.
"""


import datetime
import pytz
import requests
from bs4 import BeautifulSoup
import pandas as pd


TEST = True


def retrieve_daily_contributions(username: str, year: int = 0) -> pd.DataFrame:
    """
    Retrieve daily contribution data from a GitHub profile for a specific year.

    Args:
        username (str): GitHub username or ID
        year (int): Year for which contributions are to be retrieved (default: 0 for the current year)

    Returns:
        DataFrame: DataFrame containing the daily contribution data
    """

    # URL 설정
    current_year = datetime.datetime.now().year
    if 2000 < year <= current_year:
        year_str = str(year)
        url = f"https://github.com/{username}?from={year_str}-01-01&to={year_str}-12-31"
    else:
        url = f"https://github.com/{username}"
    if TEST:
        print("URL:", url, "\n")

    daily_contributions = []

    try:
        response = requests.get(url, timeout=3)
        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.find("table", class_="ContributionCalendar-grid js-calendar-graph-table")
        if table:
            td_list = table.select("tbody > tr > td")

            # <td tabindex="0" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-4" style="width: 10px" data-date="2023-01-01" id="contribution-day-component-0-0" data-level="4" role="gridcell" data-view-component="true" class="ContributionCalendar-day"></td>
            # <tool-tip id="tooltip-e4f9e24e-d9ec-4ee3-ad3c-c2265e892038" for="contribution-day-component-0-0" popover="manual" data-direction="n" data-type="label" data-view-component="true" class="sr-only position-absolute">5 contributions on January 1st.</tool-tip>
            # ……

            for td in td_list:
                if td.name == "td" and "data-date" in td.attrs:
                    data_date = td["data-date"]
                    tooltip = td.find_next_sibling("tool-tip")
                    tooltip_id = ""
                    if tooltip:
                        tooltip_id = tooltip["for"]
                        tooltip_text = tooltip.text.split(' ')[0]
                        num_contributions = int(tooltip_text) if tooltip_text.isdigit() else 0
                    else:
                        num_contributions = 0

                    validation = tooltip_id == td["id"]
                    daily_contributions.append([data_date, num_contributions, validation])

    except requests.RequestException as e:
        print(f"Failed to retrieve data: {e}")
        daily_contributions.append(["Failed", "Failed", "Failed"])

    columns = ["Date", "Contributions", "Validation"]
    df = pd.DataFrame(data=daily_contributions, columns=columns)

    return df


def save_csv(data_frame, filename="github_daily_contributions"):
    """
    Save DataFrame as a CSV file.

    Args:
        data_frame (DataFrame): DataFrame to be saved
        filename (str): Name of the output file (default: github_daily_contributions)
    """
    seoul_timezone = pytz.timezone('Asia/Seoul')
    timestamp = datetime.datetime.now(seoul_timezone).strftime("%Y%m%d_%H%M%S")
    path = f"Data/{filename}_{timestamp}.csv"
    data_frame.to_csv(path, index=False, encoding='utf-8-sig')
    print("File saved successfully:", path)


if __name__ == "__main__":
    # Example usage:
    USERNAME = "kimpro82"
    contributions_data = retrieve_daily_contributions(username=USERNAME, year=2023)
    print(contributions_data)

    save_csv(contributions_data)
