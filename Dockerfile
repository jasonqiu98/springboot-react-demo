# build the backend with Maven
FROM maven:3.6 AS build
COPY src /home/app/src
COPY pom.xml /home/app

WORKDIR /home/app
RUN mvn clean package

# run the jar package
FROM amazoncorretto:11
COPY --from=build /home/app/target/springboot-react-demo-0.0.1-SNAPSHOT.jar /usr/local/lib/springboot-app.jar
EXPOSE 8091

ENTRYPOINT [ "java", "-jar", "/usr/local/lib/springboot-app.jar" ]
