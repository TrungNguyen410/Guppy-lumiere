# Giai đoạn 1: build bằng Maven (tách bước tải thư viện để tận dụng cache)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B package

# Giai đoạn 2: chỉ giữ JRE và file jar
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --no-create-home guppy
COPY --from=build /app/target/*.jar app.jar
USER guppy
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
