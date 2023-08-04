"""
save_csv.py / 2023.08.04

테스트용 2차원 배열 데이터를 생성하여 CSV 파일로 저장하는 스크립트입니다.
"""

import csv

# 테스트용 2차원 배열 데이터 생성
data = [
    ['이름', '나이', '성별'],
    ['Alice', 28, '여성'],
    ['Bob', 35, '남성'],
    ['Charlie', 22, '남성'],
    ['David', 30, '남성']
]

# CSV 파일로 데이터 저장
with open('test_csv.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:    # utf-8-sig : 엑셀에서 한글 깨짐 현상 방지
    csvwriter = csv.writer(csvfile)
    csvwriter.writerows(data)

print('CSV 파일 생성이 완료되었습니다.')
