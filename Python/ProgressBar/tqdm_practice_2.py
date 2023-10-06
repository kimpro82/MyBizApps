"""
Progress Bar Practice by using `tqdm` 2
: with `acync` ~ `await` statements

2023.10.05

An example demonstrating the use of `tqdm` with asyncio in a multithreading environment.

This code combines asyncio with `tqdm` to create progress bars while performing asynchronous tasks. 
It waits until all tasks are completed before exiting.

Usage:
    Run this script to see progress bars for asynchronous tasks being processed until 100% completion.

"""

import asyncio
from tqdm import tqdm

# Asynchronous function
async def async_worker(item):
    # Simulate asynchronous work being done
    await asyncio.sleep(1)
    return item

# Function for performing asynchronous tasks
async def process_async_data(data):
    results = []
    with tqdm(total=len(data), desc="Processing") as pbar:
        # Run asynchronous tasks and collect results in a list
        tasks = [async_worker(item) for item in data]
        results = await asyncio.gather(*tasks)  # Parallel execution of asynchronous tasks
        pbar.update(len(data))  # Update progress to 100% upon completion

    return results

# Data list
data = range(100)

# Create an event loop
loop = asyncio.get_event_loop()

# Execute asynchronous tasks
async def main():
    results = await process_async_data(data)
    print("Task completed")

if __name__ == "__main__":
    try:
        # Run the event loop until completion or KeyboardInterrupt
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        pass
    finally:
        # Clean up and close the event loop
        loop.run_until_complete(loop.shutdown_asyncgens())
        loop.close()
