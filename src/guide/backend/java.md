# Java 1.8+

This Java implementation is compatible with Java 1.8 and above. A [register](https://docs.passwordless.dev/guide/api/#register-token) function might look something like:

```java
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class CreateToken {

    // Define the API secret key used for authentication with the remote server
    private static final String API_SECRET = "YOUR_API_SECRET";

    public static void main(String[] args) throws IOException {
        // Get the alias from the command-line argument
        String alias = args[0];

        // Create a URL object with the target URL
        URL url = new URL("https://v4.passwordless.dev/register/token");
        // Open an HTTP connection to the specified URL
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        // Set the request method to POST
        connection.setRequestMethod("POST");
        // Set the request headers for the API secret and content type
        connection.setRequestProperty("ApiSecret", API_SECRET);
        connection.setRequestProperty("Content-Type", "application/json");

        // Build the JSON payload for the request as a string
        String payload = "{" +
                "  \"userId\": " + getRandomInt() + "," +
                "  \"username\": \"" + alias + "\", " +
                "  \"aliases\": [\"" + alias + "\"]" +
                "}";

        // Enable output for the connection to allow writing data
        connection.setDoOutput(true);
        // Write the payload to the connection's output stream using a PrintWriter
        try (PrintWriter writer = new PrintWriter(connection.getOutputStream())) {
            writer.print(payload);
        }

        // Get the response code and response message from the connection
        int responseCode = connection.getResponseCode();
        String responseMessage = connection.getResponseMessage();
        // Get the response content as an input stream
        InputStream responseInputStream = connection.getInputStream();

        // Read the response content using a Scanner
        Scanner scanner = new Scanner(responseInputStream);
        String responseData = scanner.nextLine();

        // Print the response code, message, and data
        System.out.println("passwordless api response: " + responseCode + " " + responseMessage + " " + responseData);

        // Check if the response code is 200 (Success) and print the received token
        if (responseCode == 200) {
            System.out.println("received token: " + responseData);
        } else {
            // Handle or log any API error
            // Add error handling or logging code here if needed
        }
    }

    // Function to generate a random integer value
    private static int getRandomInt() {
        // Multiply a random float (0 to 1) by 1e9 (one billion) and return the integer value
        return (int) (1e9 * Math.random());
    }
}
```
