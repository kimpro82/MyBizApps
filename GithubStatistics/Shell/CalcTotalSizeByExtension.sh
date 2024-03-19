#!/bin/bash

# Calculate the Total Number and Size of Files by Extension in All Subfolders
# 2024.03.19


find */ -type f | awk -F'.' '{print $NF}' | sort | uniq -c | while read count ext; do 
  size=$(find */ -type f -name "*.$ext" -exec du -b {} + | awk '{total+=$1} END {print total}')
  echo "$ext $count $size"
done
