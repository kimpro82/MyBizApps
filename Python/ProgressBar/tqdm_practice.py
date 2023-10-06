"""
Progress Bar Practice by using `tqdm`

2023.10.05

A simple example demonstrating the use of `tqdm` to create a progress bar.

This code simulates a repetitive task using a list of data and displays a progress bar using `tqdm`.

Usage:
    Run this script to see a progress bar while the task is being processed.
"""

from tqdm import tqdm
import time

# Simulating a repetitive task with a list
data = range(100)

# Creating a progress bar using tqdm
for item in tqdm(data, desc="Processing"):
    # Simulating a delay for demonstration purposes
    time.sleep(0.02)

print("Task completed")
