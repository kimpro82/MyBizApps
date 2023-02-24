#!/bin/bash

echo -n "Enter the file name: "
read file

chars=$(wc -m < "$file" | tr -d ' ')
words=$(wc -w < "$file" | tr -d ' ')
lines=$(wc -l < "$file" | tr -d ' ')

echo "Number of characters : $chars"
echo "Number of words      : $words"
echo "Number of lines      : $lines"

read