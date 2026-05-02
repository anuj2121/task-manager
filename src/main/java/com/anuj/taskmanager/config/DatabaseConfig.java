import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        try {
            String dbUrl = System.getenv("DATABASE_URL");

            URI uri = new URI(dbUrl);

            String username = uri.getUserInfo().split(":")[0];
            String password = uri.getUserInfo().split(":")[1];

            String url = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath();

            return DataSourceBuilder.create()
                    .url(url)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}