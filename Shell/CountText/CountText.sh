#!/bin/bash

echo -n "Enter the file name: "
read file

chars=$(wc -m < "$file")
words=$(wc -w < "$file")
lines=$(wc -l < "$file")

echo "Number of characters : $chars"
echo "Number of words      : $words"
echo "Number of lines      : $lines"

read