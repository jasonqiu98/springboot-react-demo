FROM amazoncorretto:11

COPY target/springboot-react-demo-0.0.1-SNAPSHOT.jar springboot-app.jar

EXPOSE 8091

ENTRYPOINT [ "java", "-jar", "springboot-app.jar" ]
