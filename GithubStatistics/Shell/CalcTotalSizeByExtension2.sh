#!/bin/bash

# Calculate the Total Number and Size of Files by Extension in All Subdirectories 2
# 2024.03.21


# Initialize associative arrays for counting files and summing sizes
declare -A file_counts
declare -A file_sizes

# Process each file in subdirectories
while IFS= read -r -d '' file; do
    ext="${file##*.}"
    size=$(stat -c%s "$file")
    ((file_counts[$ext]++))
    ((file_sizes[$ext]+=$size))
done < <(find . -mindepth 2 -type f -print0)

# Initialize variables for total count and size
total_count=0
total_size=0

# Print the header with left-aligned extension names and right-aligned numbers
printf "%-9s %10s %17s\n" "Extension" "FileCount" "TotalSize(Bytes)"
printf '=%.0s' {1..38}
echo ""

# Use process substitution to sort the output
while read -r line; do
    echo "$line"
    read -r ext count size <<< "$line"
    ((total_count += count))
    ((total_size += size))
done < <(for ext in "${!file_counts[@]}"; do
    count=${file_counts[$ext]}
    size=${file_sizes[$ext]}
    printf "%-9s %10d %17d\n" "$ext" "$count" "$size"
done | sort -k3 -nr)

# Print dashed line before total
printf '=%.0s' {1..38}
echo ""
# Output total count and size with right-aligned numbers
printf "%-9s %10d %17d\n" total ${total_count} ${total_size}
