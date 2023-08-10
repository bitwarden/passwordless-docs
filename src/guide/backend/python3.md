# Python 3+

This Python 3.8+ implementation is done in only a few lines of code. A [register](https://docs.passwordless.dev/guide/api/#register-token) function might look something like:

```python
import requests  # Import the requests library for making HTTP requests
import json      # Import the json library for working with JSON data
import random    # Import the random library to generate random numbers

# Define the API secret key used for authentication with the remote server
API_SECRET = "YOUR_API_SECRET"

# Function to generate a random integer value
def get_random_int():
  # Multiply a random float (0 to 1) by 1e9 (one billion) and return the integer value
  return int(1e9 * random.random())

# Function to create a token using the given alias
def create_token(alias):
  # Prepare the payload for the API request, including the user ID, username, and aliases
  payload = {
    "userId": get_random_int(),
    "username": alias,
    "aliases": [alias]
  }

  # Make a POST request to the specified URL, sending the payload as JSON, and including headers for the API secret and content type
  response = requests.post("https://v4.passwordless.dev/register/token", json=payload, headers={"ApiSecret": API_SECRET, "Content-Type": "application/json"})

  # Decode the JSON response into a Python dictionary
  response_data = response.json()

  # Print the response status code, text, and data
  print("passwordless api response", response.status_code, response.text, response_data)

  # Check if the response status code is 200 (Success) and print the received token
  if response.status_code == 200:
    print("received token: ", response_data["token"])
  else:
    # Handle or log any API error
    # Add error handling or logging code here if needed
    pass

  # Return the response data
  return response_data

# Check if the script is being run as the main module
if __name__ == "__main__":
  # Call the create_token function with the alias "alias" and store the response
  response_data = create_token("alias")
```

## References

* [Open the example Python 3.8+ application using Flask on GitHub
](https://github.com/passwordless/sdk-collection/tree/main/Python%203.8-Flask)