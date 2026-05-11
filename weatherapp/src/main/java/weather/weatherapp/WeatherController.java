package weather.weatherapp;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@RestController
public class WeatherController {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String apikey = "6baba3bd162ce04b0cf27553c5f3f1a7";

    @GetMapping("/weather")
    public ResponseEntity<String> getWeather(@RequestParam String city) {

        try {

            String url = "https://api.openweathermap.org/data/2.5/weather?q="
                    + city.trim()
                    + "&appid=" + apikey
                    + "&units=metric";

            String response = restTemplate.getForObject(url, String.class);

            return ResponseEntity.ok(response);

        } catch (HttpClientErrorException e) {

            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (Exception e) {

            return ResponseEntity
                    .status(500)
                    .body("{\"message\":\"Internal Server Error\"}");
        }
    }
}