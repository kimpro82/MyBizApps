# [Progress Bar Practice (Python)](../../README.md#python)

How to Enhance the Value of a Program: Not Speed Improvements but Progress Bars


### \<List>

- [Progress Bar Practice by using `tqdm` (2023.10.05)](#progress-bar-practice-by-using-tqdm-20231005)


## [Progress Bar Practice by using `tqdm` (2023.10.05)](#list)

- Implementing a progress bar using `tqdm` in synchronous and asynchronous methods
- Almost written by *ChatGPT*
- Codes and results

  <details>
    <summary>Codes : tqdm_practice.py</summary>

  ```python
  from tqdm import tqdm
  import time
  ```
  ```python
  # Simulating a repetitive task with a list
  data = range(100)

  # Creating a progress bar using tqdm
  for item in tqdm(data, desc="Processing"):
      # Simulating a delay for demonstration purposes
      time.sleep(0.02)

  print("Task completed")
  ```
  </details>

  <details open="">
    <summary>Results</summary>

  ![tqdm practice](./Images/tqdm_practice.gif)
  </details>
  <details>
    <summary>Codes : tqdm_practice_2.py</summary>

  ```python
  import asyncio
  from tqdm import tqdm
  ```
  ```python
  # Asynchronous function
  async def async_worker(item):
      # Simulate asynchronous work being done
      await asyncio.sleep(1)
      return item
  ```
  ```python
  # Function for performing asynchronous tasks
  async def process_async_data(data):
      results = []
      with tqdm(total=len(data), desc="Processing") as pbar:
          # Run asynchronous tasks and collect results in a list
          tasks = [async_worker(item) for item in data]
          results = await asyncio.gather(*tasks)  # Parallel execution of asynchronous tasks
          pbar.update(len(data))  # Update progress to 100% upon completion

      return results
  ```
  ```python
  # Data list
  data = range(100)

  # Create an event loop
  loop = asyncio.get_event_loop()

  # Execute asynchronous tasks
  async def main():
      results = await process_async_data(data)
      print("Task completed")
  ```
  ```python
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
  ```
  </details>
  <details open="">
    <summary>Results</summary>

  ![tqdm practice 2](./Images/tqdm_practice_2.gif)
  </details>
