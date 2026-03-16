package weather.weatherapp;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    @GetMapping("/weather")
    public String getWeather(@RequestParam String city) {
        try {

            String apikey = "6baba3bd162ce04b0cf27553c5f3f1a7";

            String url = "https://api.openweathermap.org/data/2.5/weather?q="
                    + city + "&appid=" + apikey + "&units=metric";

            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            con.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));

            String line;
            StringBuffer response = new StringBuffer();

            while ((line = in.readLine()) != null) {
                response.append(line);
            }

            in.close();

            return response.toString();

        } catch (Exception e) {
            return "Error fetching weather data: " + e.getMessage();
        }
    }

}
